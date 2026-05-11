# Sandbox Test Runbook — Certificate Issuance Pipeline

**Scope:** End-to-end functional verification of the certificate issuance workflow in a sandbox environment.  
**When to run:** Before every deployment to staging or production. Must be completed and signed off before any production deployment.  
**Environment:** Supabase sandbox project with stub insurer and DMVIC adapters (or live sandbox endpoints if available).

> This runbook verifies functional behavior only. Security penetration testing, load testing, and chaos testing are separate activities not covered here.

---

## Preconditions

Before starting any test scenario, confirm all of the following:

- [ ] Migration `20260510000001_certificate_issuance.sql` applied and verified (see `SUPABASE_MIGRATION_VERIFICATION_CERTIFICATE_ISSUANCE.md`)
- [ ] All Edge Functions deployed to the sandbox Supabase project:
  - `payment-webhook`
  - `issue-certificate`
  - `process-certificate-queue`
  - `send-certificate-email`
- [ ] All environment variables set in sandbox (see `ENV_CERTIFICATE_ISSUANCE.md`)
- [ ] `claim_next_certificate_queue_entry()` RPC verified (see migration verification doc)
- [ ] Insurer stub/sandbox returns a response that includes `insurer_ira_license`
- [ ] DMVIC stub/sandbox returns a response that includes `certificate_number`, `issued_at`, `download_url`
- [ ] Resend test key configured (emails delivered to test inbox, not real customer)
- [ ] Database tables are empty or test data from prior runs has been cleaned up
- [ ] You have the Supabase SQL editor open for querying audit and reconciliation logs after each test

---

## Test Data Required

Before running tests, prepare the following identifiers. Keep them consistent across all test steps.

| Item | Value to use | Notes |
|---|---|---|
| `customer_id` | A UUID you generate (e.g., `11111111-1111-1111-1111-111111111111`) | Must be a valid UUID; does not need to exist in auth.users for sandbox |
| `quote_id` | A UUID you generate (e.g., `22222222-2222-2222-2222-222222222222`) | Represents the quote this payment is for |
| `payment_reference` | `MP-TEST-RUNBOOK-001` | Unique per test run; change suffix if re-running |
| `session_id` | `sess-runbook-001` | Arbitrary session identifier |
| `vehicle_registration` | `KDA 001A` | Test vehicle |
| `customer_name` | `John Kamau` | Test customer name |
| `amount_kes` | `45000` | Premium amount |
| `cover_start_date` | `2026-06-01` | Must be a future date |
| `cover_end_date` | `2027-05-31` | Must be after cover_start_date |
| `ip_address` | `41.80.1.1` | Test IP |

---

## Test 1: Happy-Path — Quote to Certificate

**Goal:** Confirm that a confirmed payment flows through to a issued certificate and a delivered email.

### Step 1.1 — POST confirmed payment webhook

```bash
curl -X POST https://<project-ref>.supabase.co/functions/v1/payment-webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SUPABASE_ANON_KEY>" \
  -d '{
    "payment_reference": "MP-TEST-RUNBOOK-001",
    "quote_id": "22222222-2222-2222-2222-222222222222",
    "status": "confirmed",
    "amount_kes": 45000,
    "customer_id": "11111111-1111-1111-1111-111111111111",
    "session_id": "sess-runbook-001",
    "processor": "mpesa",
    "confirmed_at": "2026-06-01T10:00:00.000Z",
    "ip_address": "41.80.1.1"
  }'
```

**Expected HTTP response:** `200 OK` with `{ "ok": true }` or similar success body.

**Verify in DB:**
```sql
SELECT id, payment_reference, status, quote_id, customer_id
FROM payments
WHERE payment_reference = 'MP-TEST-RUNBOOK-001';
-- Expected: 1 row, status = 'confirmed'

SELECT id, status, next_attempt_at
FROM certificate_queue
WHERE payment_id = (SELECT id FROM payments WHERE payment_reference = 'MP-TEST-RUNBOOK-001');
-- Expected: 1 row, status = 'pending'
```

### Step 1.2 — Invoke queue processor

```bash
curl -X POST https://<project-ref>.supabase.co/functions/v1/process-certificate-queue \
  -H "Authorization: Bearer <SUPABASE_ANON_KEY>"
```

**Expected HTTP response:** `200 OK` with `{ "processed": 1 }` or similar.

**Verify in DB:**
```sql
SELECT id, status, certificate_number, insurer_id, insurer_ira_license
FROM certificates
WHERE payment_id = (SELECT id FROM payments WHERE payment_reference = 'MP-TEST-RUNBOOK-001');
-- Expected: 1 row, status = 'issued', certificate_number populated, insurer_ira_license populated

SELECT status, attempts
FROM certificate_queue
WHERE payment_id = (SELECT id FROM payments WHERE payment_reference = 'MP-TEST-RUNBOOK-001');
-- Expected: status = 'completed'
```

### Step 1.3 — Verify audit trail

```sql
SELECT event_type, actor, entity_type, occurred_at
FROM audit_events
WHERE customer_id = '11111111-1111-1111-1111-111111111111'
ORDER BY occurred_at;
```

**Expected events in order:**
1. `payment_confirmed`
2. `policy_requested` or `policy_created`
3. `certificate_requested` or `certificate_issued`
4. `certificate_email_sent`

All events must have `actor = 'system'` and `entity_id` matching the relevant row.

### Step 1.4 — Verify reconciliation logs

```sql
SELECT integration_name, operation_type, response_status, occurred_at
FROM reconciliation_logs
ORDER BY occurred_at;
```

**Expected log entries:**
- `insurer` / `create_policy` / `success`
- `dmvic` / `issue_certificate` / `success`
- `resend` / `send_certificate_email` / `success`

### Step 1.5 — Verify email delivery

Check the Resend test inbox or sandbox dashboard for a delivery to the test customer email. Email must contain:
- Certificate number
- Vehicle registration
- Cover period
- Download link

**Pass criteria:** All DB assertions above pass; at least 4 audit events present; 3 reconciliation log entries with `success`; email visible in Resend dashboard.

---

## Test 2: Duplicate Webhook — Idempotency

**Goal:** Confirm that posting the same `payment_reference` twice does not create a second payment row, policy, or certificate.

### Steps

1. Complete Test 1 (happy path) first.
2. POST the identical webhook payload a second time (same `payment_reference`).

```bash
curl -X POST https://<project-ref>.supabase.co/functions/v1/payment-webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SUPABASE_ANON_KEY>" \
  -d '{
    "payment_reference": "MP-TEST-RUNBOOK-001",
    "quote_id": "22222222-2222-2222-2222-222222222222",
    "status": "confirmed",
    "amount_kes": 45000,
    "customer_id": "11111111-1111-1111-1111-111111111111",
    "session_id": "sess-runbook-001",
    "processor": "mpesa",
    "confirmed_at": "2026-06-01T10:00:00.000Z",
    "ip_address": "41.80.1.1"
  }'
```

**Expected HTTP response:** `200 OK` (idempotent — not an error).

**Verify in DB:**
```sql
SELECT COUNT(*) FROM payments WHERE payment_reference = 'MP-TEST-RUNBOOK-001';
-- Expected: 1 (not 2)

SELECT COUNT(*) FROM certificates
WHERE payment_id = (SELECT id FROM payments WHERE payment_reference = 'MP-TEST-RUNBOOK-001');
-- Expected: 1 (not 2)
```

**Pass criteria:** Exactly 1 payment row and 1 certificate row exist after two identical webhook calls.

---

## Test 3: Insurer Failure — Degraded State

**Goal:** Confirm that an insurer API failure produces the correct degraded state without silent failure.

### Setup

Configure the insurer stub/sandbox to return an error response (e.g., HTTP 500 or a timeout) for this test.

### Steps

1. POST a new confirmed payment with a different `payment_reference`:

```bash
curl -X POST https://<project-ref>.supabase.co/functions/v1/payment-webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SUPABASE_ANON_KEY>" \
  -d '{
    "payment_reference": "MP-TEST-INSURER-FAIL-001",
    "quote_id": "33333333-3333-3333-3333-333333333333",
    "status": "confirmed",
    "amount_kes": 45000,
    "customer_id": "11111111-1111-1111-1111-111111111111",
    "session_id": "sess-runbook-002",
    "processor": "mpesa",
    "confirmed_at": "2026-06-01T10:30:00.000Z",
    "ip_address": "41.80.1.1"
  }'
```

2. Invoke the queue processor.

### Verify

```sql
-- Policy must be in 'failed' status
SELECT status FROM policies
WHERE payment_id = (SELECT id FROM payments WHERE payment_reference = 'MP-TEST-INSURER-FAIL-001');
-- Expected: 'failed'

-- Queue entry must show a failed attempt with error_detail populated
SELECT status, attempts, error_detail FROM certificate_queue
WHERE payment_id = (SELECT id FROM payments WHERE payment_reference = 'MP-TEST-INSURER-FAIL-001');
-- Expected: status = 'failed' or 'pending' (if retryable), attempts > 0, error_detail not null

-- Audit event for policy failure must exist
SELECT event_type FROM audit_events
WHERE entity_type = 'policy'
  AND entity_id = (SELECT id FROM policies WHERE payment_id = (SELECT id FROM payments WHERE payment_reference = 'MP-TEST-INSURER-FAIL-001'));
-- Expected: 'policy_failed'

-- Reconciliation log must record the error
SELECT integration_name, response_status, response_body FROM reconciliation_logs
WHERE idempotency_key LIKE '%INSURER-FAIL-001%'
ORDER BY occurred_at DESC LIMIT 1;
-- Expected: integration_name = 'insurer', response_status = 'error'
```

**Pass criteria:** Policy row in `failed` state; `policy_failed` audit event present; reconciliation log entry with `response_status: 'error'`; no certificate row created.

---

## Test 4: DMVIC Failure — Degraded State

**Goal:** Confirm that a DMVIC API failure after successful policy creation produces the correct degraded state.

### Setup

Configure insurer stub to succeed. Configure DMVIC stub to return an error.

### Steps

POST a new confirmed payment with `payment_reference: 'MP-TEST-DMVIC-FAIL-001'`. Invoke the queue processor.

### Verify

```sql
-- Policy must be 'active' (insurer succeeded)
SELECT status FROM policies
WHERE payment_id = (SELECT id FROM payments WHERE payment_reference = 'MP-TEST-DMVIC-FAIL-001');
-- Expected: 'active'

-- Certificate must NOT exist (DMVIC failed)
SELECT COUNT(*) FROM certificates
WHERE payment_id = (SELECT id FROM payments WHERE payment_reference = 'MP-TEST-DMVIC-FAIL-001');
-- Expected: 0

-- Audit event for certificate failure must exist
SELECT event_type FROM audit_events
WHERE entity_type = 'certificate'
  AND customer_id = '11111111-1111-1111-1111-111111111111'
ORDER BY occurred_at DESC LIMIT 1;
-- Expected: 'certificate_failed'

-- Reconciliation log must record DMVIC error
SELECT integration_name, response_status FROM reconciliation_logs
WHERE integration_name = 'dmvic'
ORDER BY occurred_at DESC LIMIT 1;
-- Expected: response_status = 'error'
```

**Pass criteria:** Policy `active`; no certificate row; `certificate_failed` audit event; DMVIC reconciliation log with `response_status: 'error'`.

---

## Test 5: Email Delivery Failure — Certificate Still Valid

**Goal:** Confirm that a Resend API failure does NOT fail certificate issuance and that the failure is observable.

### Setup

Configure insurer and DMVIC stubs to succeed. Configure Resend to return an error (invalid key or use a test endpoint that returns 4xx).

### Steps

POST a new confirmed payment with `payment_reference: 'MP-TEST-EMAIL-FAIL-001'`. Invoke the queue processor.

### Verify

```sql
-- Certificate must still be 'issued'
SELECT status FROM certificates
WHERE payment_id = (SELECT id FROM payments WHERE payment_reference = 'MP-TEST-EMAIL-FAIL-001');
-- Expected: 'issued'

-- Queue entry must show 'completed' (email failure does not fail the queue entry)
SELECT status FROM certificate_queue
WHERE payment_id = (SELECT id FROM payments WHERE payment_reference = 'MP-TEST-EMAIL-FAIL-001');
-- Expected: 'completed'

-- Reconciliation log must record email error
SELECT integration_name, response_status FROM reconciliation_logs
WHERE integration_name = 'resend'
ORDER BY occurred_at DESC LIMIT 1;
-- Expected: response_status = 'error'

-- Audit event for certificate_email_sent must still exist (logged regardless of outcome)
SELECT event_type, after_state FROM audit_events
WHERE event_type = 'certificate_email_sent'
ORDER BY occurred_at DESC LIMIT 1;
-- Expected: after_state contains { email_sent: false }
```

**Pass criteria:** Certificate `issued`; queue `completed`; Resend reconciliation log with `error`; audit event shows `email_sent: false`.

**Manual resend path:** To resend the email after a failure, invoke `send-certificate-email` directly:
```bash
curl -X POST https://<project-ref>.supabase.co/functions/v1/send-certificate-email \
  -H "Authorization: Bearer <SUPABASE_ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "certificate_id": "<certificate-uuid>",
    "customer_id": "11111111-1111-1111-1111-111111111111",
    "download_url": "<dmvic-download-url>",
    "certificate_number": "<certificate-number>"
  }'
```

---

## Pass / Fail Criteria Summary

| Test | Pass Condition |
|---|---|
| 1. Happy path | Payment confirmed → certificate issued → email sent. 4+ audit events. 3 recon logs all `success`. |
| 2. Duplicate webhook | Only 1 payment row and 1 certificate row after 2 identical webhook calls. |
| 3. Insurer failure | Policy `failed`. `policy_failed` audit event. Insurer recon log `error`. No certificate. |
| 4. DMVIC failure | Policy `active`. No certificate. `certificate_failed` audit event. DMVIC recon log `error`. |
| 5. Email failure | Certificate `issued`. Queue `completed`. Resend recon log `error`. Audit event `email_sent: false`. |

**All 5 tests must pass before production deployment is approved.**

---

## Sign-off

| Tester | Date | Environment | Result | Notes |
|---|---|---|---|---|
| | | Sandbox | | |
| | | Staging | | |
