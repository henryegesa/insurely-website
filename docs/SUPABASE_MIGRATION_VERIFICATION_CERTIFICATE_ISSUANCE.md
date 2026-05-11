# Supabase Migration Verification — Certificate Issuance Pipeline

**Migration file:** `supabase/migrations/20260510000001_certificate_issuance.sql`  
**Status:** Must be applied to hosted Supabase before any production or staging deployment

> **WARNING:** Run all verification queries against sandbox/staging first.  
> Do NOT run any DDL or destructive SQL against production without:
> - A confirmed PITR (Point-in-Time Recovery) window enabled on the hosted project
> - A manual backup snapshot taken immediately before applying the migration
> - A rollback plan reviewed and agreed by the team

---

## 1. Confirm the Migration Was Applied (via Supabase migration tracking)

Supabase tracks applied migrations in the `supabase_migrations.schema_migrations` table.

```sql
SELECT version, name, statements
FROM supabase_migrations.schema_migrations
WHERE version = '20260510000001';
```

**Expected result:** One row with `version = '20260510000001'` and `name` matching `certificate_issuance`.  
**If no row:** The migration has not been applied. Apply via `supabase db push` (local CLI) or `supabase migration up` (hosted).

---

## 2. Verify All 6 Tables Exist

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'payments',
    'policies',
    'certificates',
    'audit_events',
    'reconciliation_logs',
    'certificate_queue'
  )
ORDER BY table_name;
```

**Expected result:** 6 rows — one for each table name above.

---

## 3. Verify Table Columns (spot-check critical fields)

### 3a. payments — quote_id must be NOT NULL

```sql
SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'payments'
  AND column_name IN ('quote_id', 'idempotency_key', 'payment_reference', 'status');
```

**Expected:** `quote_id` has `is_nullable = 'NO'` and `data_type = 'uuid'`.

### 3b. certificates — all 11 R5-required fields present

```sql
SELECT column_name, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'certificates'
  AND column_name IN (
    'policy_id', 'payment_id', 'certificate_number', 'insurer_id',
    'insurer_ira_license', 'vehicle_registration', 'cover_start_date',
    'cover_end_date', 'premium_paid_kes', 'customer_id', 'customer_name',
    'issued_at', 'issuing_system'
  )
ORDER BY column_name;
```

**Expected:** 13 rows, all with `is_nullable = 'NO'` (these are the R5 mandatory fields plus `issued_at` and `issuing_system`).

### 3c. audit_events — immutable 13-field schema

```sql
SELECT column_name, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'audit_events'
ORDER BY ordinal_position;
```

**Expected columns (13 total):** id, event_type, actor, customer_id, occurred_at, request_id, entity_type, entity_id, before_state, after_state, system_version, ip_address, created_at.

---

## 4. Verify All Indexes Exist

```sql
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname IN (
    'payments_customer_id_idx',
    'payments_status_idx',
    'policies_customer_id_idx',
    'certificates_customer_id_idx',
    'audit_events_entity_idx',
    'audit_events_customer_idx',
    'audit_events_occurred_idx',
    'recon_logs_integration_idx',
    'recon_logs_idempotency_idx',
    'cert_queue_status_idx'
  )
ORDER BY indexname;
```

**Expected result:** 10 rows.

---

## 5. Verify Audit Immutability Rules

```sql
SELECT rulename, tablename, event
FROM pg_rules
WHERE schemaname = 'public'
  AND tablename = 'audit_events'
  AND rulename IN ('audit_events_no_update', 'audit_events_no_delete');
```

**Expected result:** 2 rows — `audit_events_no_update` (UPDATE) and `audit_events_no_delete` (DELETE).

**Manual smoke test (should silently do nothing):**
```sql
-- Insert a test row first
INSERT INTO audit_events (
  event_type, actor, occurred_at, request_id, entity_type, entity_id,
  after_state, system_version
) VALUES (
  'payment_confirmed', 'system', now(), 'test-req-001', 'payment',
  gen_random_uuid(), '{"test": true}', '1.0.0'
) RETURNING id;

-- Attempt update — must return 0 rows affected
UPDATE audit_events SET actor = 'tampered' WHERE request_id = 'test-req-001';

-- Attempt delete — must return 0 rows affected
DELETE FROM audit_events WHERE request_id = 'test-req-001';

-- Verify row is still unchanged
SELECT actor FROM audit_events WHERE request_id = 'test-req-001';
-- Expected: 'system' (unchanged)

-- Clean up test row (direct DELETE bypasses rule in same transaction — use with care)
-- Note: rules apply to SQL commands, not direct executor calls from superuser sessions
-- on hosted Supabase this DELETE will also silently no-op
```

---

## 6. Verify claim_next_certificate_queue_entry() Exists

```sql
SELECT routine_name, routine_type, data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'claim_next_certificate_queue_entry';
```

**Expected result:** 1 row with `routine_type = 'FUNCTION'`.

---

## 7. Verify RPC Return Shape

```sql
-- View the function definition
SELECT pg_get_functiondef(oid)
FROM pg_proc
WHERE proname = 'claim_next_certificate_queue_entry';
```

**Expected:** Function body contains `FOR UPDATE SKIP LOCKED` and `returning *` from `certificate_queue`.

Return type must be `SETOF certificate_queue` — the columns returned by `returning *` are:

| Column | Type |
|---|---|
| id | uuid |
| payment_id | uuid |
| idempotency_key | text |
| status | text |
| attempts | integer |
| last_attempted_at | timestamptz |
| next_attempt_at | timestamptz |
| error_detail | text |
| created_at | timestamptz |

---

## 8. Test the RPC Manually (sandbox only)

Insert a test queue entry and call the RPC to confirm it claims exactly one row.

```sql
-- Step 1: Insert a test entry
INSERT INTO certificate_queue (payment_id, idempotency_key, next_attempt_at)
VALUES (gen_random_uuid(), 'test-rpc-idem-001', now())
RETURNING id, status;
-- Expected: status = 'pending'

-- Step 2: Call the RPC (simulating what the Edge Function does)
SELECT * FROM claim_next_certificate_queue_entry();
-- Expected: 1 row returned, status = 'processing', last_attempted_at set

-- Step 3: Confirm the row is now in 'processing' state
SELECT id, status, last_attempted_at
FROM certificate_queue
WHERE idempotency_key = 'test-rpc-idem-001';

-- Step 4: Confirm a second call returns 0 rows (already claimed)
SELECT * FROM claim_next_certificate_queue_entry();
-- Expected: 0 rows (entry is 'processing', not 'pending')

-- Step 5: Clean up
DELETE FROM certificate_queue WHERE idempotency_key = 'test-rpc-idem-001';
```

---

## 9. Rollback Considerations

There is **no automated rollback migration** for `20260510000001_certificate_issuance.sql`. If this migration must be reversed:

1. **Do not drop tables with live data.** Confirm with the product team that all rows can be discarded.
2. Drop in reverse dependency order (certificates → policies → payments; then certificate_queue, reconciliation_logs, audit_events):
   ```sql
   DROP TABLE IF EXISTS certificates CASCADE;
   DROP TABLE IF EXISTS certificate_queue CASCADE;
   DROP TABLE IF EXISTS policies CASCADE;
   DROP TABLE IF EXISTS payments CASCADE;
   DROP TABLE IF EXISTS reconciliation_logs CASCADE;
   DROP TABLE IF EXISTS audit_events CASCADE;
   DROP FUNCTION IF EXISTS claim_next_certificate_queue_entry();
   ```
3. Remove the migration tracking row:
   ```sql
   DELETE FROM supabase_migrations.schema_migrations
   WHERE version = '20260510000001';
   ```
4. Restore from PITR snapshot if any data was written to these tables before rollback decision.

> **IMPORTANT:** Dropping `audit_events` destroys the immutable audit trail. This action must be approved by legal/compliance if any regulated transactions were processed against this schema.

---

## 10. Sign-off

| Verifier | Date | Environment | Notes |
|---|---|---|---|
| | | Sandbox | |
| | | Staging | |
| | | Production | |
