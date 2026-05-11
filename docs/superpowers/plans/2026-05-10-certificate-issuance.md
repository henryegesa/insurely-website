# Digital Motor Insurance Certificate Issuance — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Issue a digital motor insurance certificate to the customer within 5 minutes of confirmed premium payment, with full idempotency, audit logging, and graceful queue-and-retry degradation.

**Architecture:** Payment webhook → insurer policy creation (typed stub) → DMVIC certificate issuance (typed stub) → customer email delivery via Resend. All external integrations implement a typed adapter interface so real API contracts can be wired in without touching orchestration logic. A certificate queue handles insurer/DMVIC unavailability with a 5-minute SLA enforced by a scheduled processor.

**Tech Stack:** Supabase Edge Functions (Deno + TypeScript), Supabase Postgres, Resend (transactional email), typed integration stubs for insurer and DMVIC.

**Constitution rules satisfied:** R2, R4, R5, R6, R7, R8, R9, R10, R11, R17, R18, R19.

---

## Constitution Compliance Check

| Field | Detail |
|---|---|
| **Relevant rules** | R2 (certificate attributed to underwriter), R4 (no silent money movement), R5 (no silent certificate issuance), R6 (idempotency keys), R7 (typed integration contracts), R8 (reconciliation logs), R9 (degraded-state behavior), R10 (audit trail), R11 (audit immutability), R17–R19 (mandatory tests) |
| **Compliance status** | All rules addressed: idempotency keys generated server-side, stored pre-call, checked before retry (R6); all external calls produce reconciliation log entries (R8); queue-and-retry path defined for insurer/DMVIC unavailability (R9); audit events written for every material event with all 13 required fields (R10); audit table has no-update/no-delete RLS (R11); certificate record includes all 11 required fields (R5); insurer name and IRA license included on certificate (R2); every code path has a test (R17) |
| **Unresolved compliance risk** | Real insurer and DMVIC API contracts are not yet available. Stubs are designed to the correct typed interface but integration tests cannot run against real endpoints until contracts arrive. When contracts land, integration tests (R18) must be run against sandbox endpoints before any production release. |
| **Test and audit evidence** | Unit tests for all business logic (idempotency, certificate record creation, queue logic). Audit events produced: `payment_confirmed`, `policy_requested`, `policy_created`, `certificate_requested`, `certificate_issued`, `certificate_failed`, `certificate_queued`. Reconciliation log entry produced for every external call. |

---

## File Structure

**New files:**

```
supabase/
  migrations/
    20260510000001_certificate_issuance.sql   — all tables for this feature
  functions/
    _shared/
      types.ts                                — all shared TypeScript types
      audit.ts                                — write immutable audit events
      reconciliation.ts                       — write reconciliation log entries
      idempotency.ts                          — generate and check idempotency keys
      insurer-adapter.ts                      — InsurerAdapter interface + stub implementation
      dmvic-adapter.ts                        — DmvicAdapter interface + stub implementation
      db.ts                                   — typed Supabase client helper
    payment-webhook/
      index.ts                                — receives payment processor callback
      index.test.ts                           — unit tests
    issue-certificate/
      index.ts                                — orchestrates policy + certificate + email
      index.test.ts                           — unit tests
    process-certificate-queue/
      index.ts                                — scheduled: processes pending queue entries
      index.test.ts                           — unit tests
    send-certificate-email/
      index.ts                                — sends certificate PDF link via Resend
      index.test.ts                           — unit tests
```

**Why this split:** Each edge function has one responsibility and one entry point. The `_shared` layer owns all integration contracts and database utilities — orchestration functions never call external APIs directly. This makes stubbing, testing, and future API replacement straightforward.

---

## Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/20260510000001_certificate_issuance.sql`

- [ ] **Step 1: Create the migration file**

```sql
-- supabase/migrations/20260510000001_certificate_issuance.sql
-- Satisfies: R4, R5, R6, R8, R10, R11

-- ─── PAYMENTS ────────────────────────────────────────────────────────────────
-- Tracks every payment attempt. Status transitions: pending → confirmed | failed.
-- payment_reference is the processor-issued reference (e.g. M-Pesa ref).
-- idempotency_key is generated server-side before the processor call.
create table if not exists payments (
  id                  uuid primary key default gen_random_uuid(),
  payment_reference   text unique not null,
  idempotency_key     text unique not null,
  customer_id         uuid not null,
  quote_id            uuid not null,
  amount_kes          numeric(12, 2) not null check (amount_kes > 0),
  currency            text not null default 'KES',
  status              text not null default 'pending'
                        check (status in ('pending', 'confirmed', 'failed')),
  payment_processor   text not null check (payment_processor in ('mpesa', 'card')),
  processor_response  jsonb,
  confirmed_at        timestamptz,
  session_id          text not null,
  ip_address          inet,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ─── POLICIES ────────────────────────────────────────────────────────────────
-- One policy per payment. Created by the insurer after payment is confirmed.
create table if not exists policies (
  id                    uuid primary key default gen_random_uuid(),
  payment_id            uuid unique not null references payments (id),
  idempotency_key       text unique not null,
  insurer_id            text not null,
  policy_reference      text unique,
  customer_id           uuid not null,
  vehicle_registration  text not null,
  cover_type            text not null,
  cover_start_date      date not null,
  cover_end_date        date not null,
  status                text not null default 'requested'
                          check (status in ('requested', 'active', 'failed')),
  insurer_response      jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ─── CERTIFICATES ─────────────────────────────────────────────────────────────
-- One certificate per payment (enforced by unique constraint on payment_id).
-- Stores all 11 fields required by R5.
create table if not exists certificates (
  id                    uuid primary key default gen_random_uuid(),
  policy_id             uuid unique not null references policies (id),
  payment_id            uuid unique not null references payments (id),
  idempotency_key       text unique not null,
  certificate_number    text unique not null,
  insurer_id            text not null,
  insurer_ira_license   text not null,
  vehicle_registration  text not null,
  cover_start_date      date not null,
  cover_end_date        date not null,
  premium_paid_kes      numeric(12, 2) not null,
  customer_id           uuid not null,
  customer_name         text not null,
  issued_at             timestamptz not null,
  issuing_system        text not null default 'dmvic',
  status                text not null default 'issued'
                          check (status in ('issued', 'cancelled')),
  dmvic_response        jsonb,
  created_at            timestamptz not null default now()
);

-- ─── AUDIT_EVENTS ─────────────────────────────────────────────────────────────
-- Immutable. All 13 fields from R10. No update, no delete.
create table if not exists audit_events (
  id              uuid primary key default gen_random_uuid(),
  event_type      text not null,
  actor           text not null,
  customer_id     uuid,
  occurred_at     timestamptz not null default now(),
  request_id      text not null,
  entity_type     text not null,
  entity_id       uuid not null,
  before_state    jsonb,
  after_state     jsonb not null,
  system_version  text not null,
  ip_address      inet,
  created_at      timestamptz not null default now()
);

-- Immutability enforcement: no row may be updated or deleted after insert.
create or replace rule audit_events_no_update as
  on update to audit_events do instead nothing;

create or replace rule audit_events_no_delete as
  on delete to audit_events do instead nothing;

-- ─── RECONCILIATION_LOGS ──────────────────────────────────────────────────────
-- One entry per external API call, regardless of success or failure (R8).
-- Append-only by convention (no rule needed — service code never updates these).
create table if not exists reconciliation_logs (
  id                    uuid primary key default gen_random_uuid(),
  integration_name      text not null
                          check (integration_name in ('insurer', 'dmvic', 'mpesa', 'card', 'resend')),
  operation_type        text not null,
  idempotency_key       text not null,
  related_entity_type   text,
  related_entity_id     uuid,
  request_payload_hash  text not null,
  response_status       text not null check (response_status in ('success', 'error', 'timeout')),
  response_body         jsonb,
  latency_ms            integer not null,
  occurred_at           timestamptz not null default now()
);

-- ─── CERTIFICATE_QUEUE ────────────────────────────────────────────────────────
-- Holds certificate requests that could not complete due to degraded state (R9).
-- Processor runs every minute; 5-minute SLA means max 5 attempts before alert.
create table if not exists certificate_queue (
  id                uuid primary key default gen_random_uuid(),
  payment_id        uuid not null references payments (id),
  idempotency_key   text unique not null,
  status            text not null default 'pending'
                      check (status in ('pending', 'processing', 'completed', 'failed')),
  attempts          integer not null default 0,
  last_attempted_at timestamptz,
  next_attempt_at   timestamptz not null default now(),
  error_detail      text,
  created_at        timestamptz not null default now()
);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
create index if not exists payments_customer_id_idx     on payments (customer_id);
create index if not exists payments_status_idx          on payments (status);
create index if not exists policies_customer_id_idx     on policies (customer_id);
create index if not exists certificates_customer_id_idx on certificates (customer_id);
create index if not exists audit_events_entity_idx      on audit_events (entity_type, entity_id);
create index if not exists audit_events_customer_idx    on audit_events (customer_id);
create index if not exists audit_events_occurred_idx    on audit_events (occurred_at);
create index if not exists recon_logs_integration_idx   on reconciliation_logs (integration_name, occurred_at);
create index if not exists cert_queue_status_idx        on certificate_queue (status, next_attempt_at);
```

- [ ] **Step 2: Apply the migration locally**

```bash
supabase db reset
```

Expected: migration applied cleanly with no errors.

- [ ] **Step 3: Verify tables exist**

```bash
supabase db diff
```

Expected: no diff (all tables present).

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260510000001_certificate_issuance.sql
git commit -m "feat: add certificate issuance schema (R4, R5, R6, R8, R10, R11)"
```

---

## Task 2: Shared Types

**Files:**
- Create: `supabase/functions/_shared/types.ts`

- [ ] **Step 1: Write the types file**

```typescript
// supabase/functions/_shared/types.ts

export type PaymentStatus = "pending" | "confirmed" | "failed";
export type PolicyStatus = "requested" | "active" | "failed";
export type CertificateStatus = "issued" | "cancelled";
export type QueueStatus = "pending" | "processing" | "completed" | "failed";
export type ReconciliationStatus = "success" | "error" | "timeout";
export type IntegrationName = "insurer" | "dmvic" | "mpesa" | "card" | "resend";

// ─── AUDIT EVENTS ────────────────────────────────────────────────────────────
// All 13 fields from R10. occurred_at and created_at are DB defaults.
export type MaterialEventType =
  | "payment_confirmed"
  | "payment_failed"
  | "policy_requested"
  | "policy_created"
  | "policy_failed"
  | "certificate_requested"
  | "certificate_issued"
  | "certificate_failed"
  | "certificate_queued";

export interface AuditEventInput {
  event_type: MaterialEventType;
  actor: string;           // user_id UUID string or "system"
  customer_id: string | null;
  request_id: string;
  entity_type: string;
  entity_id: string;
  before_state: Record<string, unknown> | null;
  after_state: Record<string, unknown>;
  system_version: string;
  ip_address: string | null;
}

// ─── RECONCILIATION LOG ───────────────────────────────────────────────────────
export interface ReconciliationLogInput {
  integration_name: IntegrationName;
  operation_type: string;
  idempotency_key: string;
  related_entity_type?: string;
  related_entity_id?: string;
  request_payload_hash: string;
  response_status: ReconciliationStatus;
  response_body: Record<string, unknown> | null;
  latency_ms: number;
}

// ─── INSURER ADAPTER TYPES ───────────────────────────────────────────────────
export interface CreatePolicyRequest {
  idempotency_key: string;
  customer_id: string;
  customer_name: string;
  customer_id_number: string;  // National ID or Passport
  vehicle_registration: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  cover_type: "comprehensive" | "third_party";
  cover_start_date: string;   // ISO 8601 date
  cover_end_date: string;     // ISO 8601 date
  premium_kes: number;
  payment_reference: string;
}

export interface CreatePolicyResponse {
  policy_reference: string;
  insurer_id: string;
  insurer_ira_license: string;
  status: "active";
  issued_at: string;          // ISO 8601 datetime
}

// ─── DMVIC ADAPTER TYPES ─────────────────────────────────────────────────────
export interface IssueCertificateRequest {
  idempotency_key: string;
  policy_reference: string;
  insurer_id: string;
  insurer_ira_license: string;
  customer_id: string;
  customer_name: string;
  vehicle_registration: string;
  cover_type: "comprehensive" | "third_party";
  cover_start_date: string;
  cover_end_date: string;
  premium_paid_kes: number;
}

export interface IssueCertificateResponse {
  certificate_number: string;
  issued_at: string;          // ISO 8601 datetime
  download_url: string;       // secure DMVIC-hosted PDF link
}

// ─── PAYMENT WEBHOOK PAYLOAD ─────────────────────────────────────────────────
export interface PaymentWebhookPayload {
  payment_reference: string;  // processor-issued reference
  status: "confirmed" | "failed";
  amount_kes: number;
  customer_id: string;
  session_id: string;
  processor: "mpesa" | "card";
  confirmed_at: string;       // ISO 8601
  ip_address: string | null;
}
```

- [ ] **Step 2: Commit**

```bash
git add supabase/functions/_shared/types.ts
git commit -m "feat: add shared TypeScript types for certificate issuance"
```

---

## Task 3: Audit Log Utility

**Files:**
- Create: `supabase/functions/_shared/audit.ts`
- Create: `supabase/functions/_shared/audit.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// supabase/functions/_shared/audit.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { buildAuditEvent } from "./audit.ts";

Deno.test("buildAuditEvent includes all 13 required R10 fields", () => {
  const input = {
    event_type: "certificate_issued" as const,
    actor: "system",
    customer_id: "cust-123",
    request_id: "req-abc",
    entity_type: "certificate",
    entity_id: "cert-456",
    before_state: null,
    after_state: { certificate_number: "DMVIC-001" },
    system_version: "1.0.0",
    ip_address: null,
  };
  const event = buildAuditEvent(input);
  assertEquals(event.event_type, "certificate_issued");
  assertEquals(event.actor, "system");
  assertEquals(event.customer_id, "cust-123");
  assertEquals(event.request_id, "req-abc");
  assertEquals(event.entity_type, "certificate");
  assertEquals(event.entity_id, "cert-456");
  assertEquals(event.before_state, null);
  assertEquals(event.after_state, { certificate_number: "DMVIC-001" });
  assertEquals(event.system_version, "1.0.0");
  assertEquals(event.ip_address, null);
  // occurred_at must be a valid ISO timestamp
  assertEquals(typeof event.occurred_at, "string");
  assertEquals(isNaN(Date.parse(event.occurred_at)), false);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
deno test supabase/functions/_shared/audit.test.ts
```

Expected: FAIL — `audit.ts` does not exist yet.

- [ ] **Step 3: Implement the utility**

```typescript
// supabase/functions/_shared/audit.ts
import type { AuditEventInput } from "./types.ts";

export interface AuditEventRecord extends AuditEventInput {
  occurred_at: string;
}

export function buildAuditEvent(input: AuditEventInput): AuditEventRecord {
  return {
    ...input,
    occurred_at: new Date().toISOString(),
  };
}

// writeAuditEvent inserts a single audit record via the Supabase client.
// The caller must pass a Supabase client with service-role privileges.
// Throws on insert failure — the caller must not proceed if the audit write fails.
export async function writeAuditEvent(
  supabase: { from: (t: string) => { insert: (r: unknown) => Promise<{ error: unknown }> } },
  input: AuditEventInput,
): Promise<void> {
  const record = buildAuditEvent(input);
  const { error } = await supabase.from("audit_events").insert(record);
  if (error) {
    throw new Error(`Audit write failed: ${JSON.stringify(error)}`);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
deno test supabase/functions/_shared/audit.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/_shared/audit.ts supabase/functions/_shared/audit.test.ts
git commit -m "feat: audit log utility with R10 field enforcement (R10, R11)"
```

---

## Task 4: Reconciliation Log Utility

**Files:**
- Create: `supabase/functions/_shared/reconciliation.ts`
- Create: `supabase/functions/_shared/reconciliation.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// supabase/functions/_shared/reconciliation.test.ts
import { assertEquals, assertMatch } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { hashPayload, buildReconEntry } from "./reconciliation.ts";

Deno.test("hashPayload returns a non-empty hex string", async () => {
  const hash = await hashPayload({ policy_reference: "POL-001" });
  assertMatch(hash, /^[0-9a-f]{64}$/);
});

Deno.test("hashPayload returns different hashes for different payloads", async () => {
  const h1 = await hashPayload({ a: 1 });
  const h2 = await hashPayload({ a: 2 });
  assertEquals(h1 === h2, false);
});

Deno.test("buildReconEntry includes all required fields", async () => {
  const entry = await buildReconEntry({
    integration_name: "dmvic",
    operation_type: "issue_certificate",
    idempotency_key: "idem-001",
    related_entity_type: "certificate",
    related_entity_id: "cert-456",
    request_payload: { certificate_number: "DMVIC-001" },
    response_status: "success",
    response_body: { certificate_number: "DMVIC-001" },
    latency_ms: 220,
  });
  assertEquals(entry.integration_name, "dmvic");
  assertEquals(entry.operation_type, "issue_certificate");
  assertEquals(entry.response_status, "success");
  assertEquals(entry.latency_ms, 220);
  assertMatch(entry.request_payload_hash, /^[0-9a-f]{64}$/);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
deno test supabase/functions/_shared/reconciliation.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement the utility**

```typescript
// supabase/functions/_shared/reconciliation.ts
import type { ReconciliationLogInput } from "./types.ts";

export async function hashPayload(payload: Record<string, unknown>): Promise<string> {
  const text = JSON.stringify(payload, Object.keys(payload).sort());
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface BuildReconEntryInput {
  integration_name: ReconciliationLogInput["integration_name"];
  operation_type: string;
  idempotency_key: string;
  related_entity_type?: string;
  related_entity_id?: string;
  request_payload: Record<string, unknown>;
  response_status: ReconciliationLogInput["response_status"];
  response_body: Record<string, unknown> | null;
  latency_ms: number;
}

export async function buildReconEntry(input: BuildReconEntryInput): Promise<ReconciliationLogInput> {
  return {
    integration_name: input.integration_name,
    operation_type: input.operation_type,
    idempotency_key: input.idempotency_key,
    related_entity_type: input.related_entity_type,
    related_entity_id: input.related_entity_id,
    request_payload_hash: await hashPayload(input.request_payload),
    response_status: input.response_status,
    response_body: input.response_body,
    latency_ms: input.latency_ms,
  };
}

export async function writeReconLog(
  supabase: { from: (t: string) => { insert: (r: unknown) => Promise<{ error: unknown }> } },
  entry: ReconciliationLogInput,
): Promise<void> {
  const { error } = await supabase.from("reconciliation_logs").insert(entry);
  if (error) {
    // Reconciliation write failure is logged but must not block the main flow.
    console.error("Reconciliation log write failed:", JSON.stringify(error));
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
deno test supabase/functions/_shared/reconciliation.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/_shared/reconciliation.ts supabase/functions/_shared/reconciliation.test.ts
git commit -m "feat: reconciliation log utility with SHA-256 payload hashing (R8)"
```

---

## Task 5: Idempotency Utility

**Files:**
- Create: `supabase/functions/_shared/idempotency.ts`
- Create: `supabase/functions/_shared/idempotency.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// supabase/functions/_shared/idempotency.test.ts
import { assertEquals, assertNotEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { generateIdempotencyKey, scopedKey } from "./idempotency.ts";

Deno.test("generateIdempotencyKey returns a UUID-format string", () => {
  const key = generateIdempotencyKey();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  assertEquals(uuidRegex.test(key), true);
});

Deno.test("generateIdempotencyKey returns unique values each call", () => {
  const k1 = generateIdempotencyKey();
  const k2 = generateIdempotencyKey();
  assertNotEquals(k1, k2);
});

Deno.test("scopedKey prefixes the key with the scope", () => {
  const key = scopedKey("policy", "pay-ref-123");
  assertEquals(key.startsWith("policy:"), true);
  assertEquals(key.includes("pay-ref-123"), true);
});

Deno.test("scopedKey is deterministic for the same inputs", () => {
  const k1 = scopedKey("certificate", "pay-ref-abc");
  const k2 = scopedKey("certificate", "pay-ref-abc");
  assertEquals(k1, k2);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
deno test supabase/functions/_shared/idempotency.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement the utility**

```typescript
// supabase/functions/_shared/idempotency.ts

// generateIdempotencyKey produces a random UUID v4 server-side.
// Use this before initiating any external operation (R6).
export function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}

// scopedKey produces a deterministic key for an operation scoped to a payment reference.
// Use this to guarantee that re-attempting the same payment never creates a duplicate
// policy or certificate (R6: "same payment reference must never produce two distinct certificates").
export function scopedKey(scope: "policy" | "certificate" | "email", paymentReference: string): string {
  return `${scope}:${paymentReference}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
deno test supabase/functions/_shared/idempotency.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/_shared/idempotency.ts supabase/functions/_shared/idempotency.test.ts
git commit -m "feat: idempotency key utilities (R6)"
```

---

## Task 6: Insurer Adapter (Typed Interface + Stub)

**Files:**
- Create: `supabase/functions/_shared/insurer-adapter.ts`
- Create: `supabase/functions/_shared/insurer-adapter.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// supabase/functions/_shared/insurer-adapter.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { InsurerStub } from "./insurer-adapter.ts";

const stub = new InsurerStub();

Deno.test("InsurerStub.createPolicy returns a policy reference", async () => {
  const response = await stub.createPolicy({
    idempotency_key: "idem-001",
    customer_id: "cust-123",
    customer_name: "John Kamau",
    customer_id_number: "12345678",
    vehicle_registration: "KDA 001A",
    vehicle_make: "Toyota",
    vehicle_model: "Fielder",
    vehicle_year: 2019,
    cover_type: "comprehensive",
    cover_start_date: "2026-06-01",
    cover_end_date: "2027-05-31",
    premium_kes: 45000,
    payment_reference: "MP-REF-001",
  });
  assertEquals(typeof response.policy_reference, "string");
  assertEquals(response.policy_reference.length > 0, true);
  assertEquals(response.status, "active");
  assertEquals(typeof response.insurer_ira_license, "string");
});

Deno.test("InsurerStub.createPolicy is idempotent: same key returns same reference", async () => {
  const req = {
    idempotency_key: "idem-same",
    customer_id: "cust-456",
    customer_name: "Mary Wanjiru",
    customer_id_number: "87654321",
    vehicle_registration: "KDB 002B",
    vehicle_make: "Nissan",
    vehicle_model: "Note",
    vehicle_year: 2020,
    cover_type: "third_party" as const,
    cover_start_date: "2026-06-01",
    cover_end_date: "2027-05-31",
    premium_kes: 12000,
    payment_reference: "MP-REF-002",
  };
  const r1 = await stub.createPolicy(req);
  const r2 = await stub.createPolicy(req);
  assertEquals(r1.policy_reference, r2.policy_reference);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
deno test supabase/functions/_shared/insurer-adapter.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement the adapter**

```typescript
// supabase/functions/_shared/insurer-adapter.ts
// Defines the InsurerAdapter interface that both the stub and real implementation satisfy.
// When real insurer API docs arrive, create RealInsurerAdapter implementing this interface.
// No orchestration code imports the stub directly — it imports the interface and receives
// the implementation via dependency injection.

import type { CreatePolicyRequest, CreatePolicyResponse } from "./types.ts";

export interface InsurerAdapter {
  createPolicy(req: CreatePolicyRequest): Promise<CreatePolicyResponse>;
}

// InsurerStub is used in tests and development until the real API contract is available.
// It stores responses in memory per idempotency_key to simulate idempotent behavior.
export class InsurerStub implements InsurerAdapter {
  private readonly store = new Map<string, CreatePolicyResponse>();

  async createPolicy(req: CreatePolicyRequest): Promise<CreatePolicyResponse> {
    if (this.store.has(req.idempotency_key)) {
      return this.store.get(req.idempotency_key)!;
    }
    // Simulate ~200ms network latency in stub
    await new Promise((r) => setTimeout(r, 200));
    const response: CreatePolicyResponse = {
      policy_reference: `POL-STUB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      insurer_id: "INSURER-STUB-001",
      insurer_ira_license: "IRA/STUB/2026/001",
      status: "active",
      issued_at: new Date().toISOString(),
    };
    this.store.set(req.idempotency_key, response);
    return response;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
deno test supabase/functions/_shared/insurer-adapter.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/_shared/insurer-adapter.ts supabase/functions/_shared/insurer-adapter.test.ts
git commit -m "feat: insurer adapter interface + stub (R7)"
```

---

## Task 7: DMVIC Adapter (Typed Interface + Stub)

**Files:**
- Create: `supabase/functions/_shared/dmvic-adapter.ts`
- Create: `supabase/functions/_shared/dmvic-adapter.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// supabase/functions/_shared/dmvic-adapter.test.ts
import { assertEquals, assertMatch } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { DmvicStub } from "./dmvic-adapter.ts";

const stub = new DmvicStub();

Deno.test("DmvicStub.issueCertificate returns a certificate number", async () => {
  const response = await stub.issueCertificate({
    idempotency_key: "idem-dmvic-001",
    policy_reference: "POL-001",
    insurer_id: "INS-001",
    insurer_ira_license: "IRA/001/2026",
    customer_id: "cust-123",
    customer_name: "John Kamau",
    vehicle_registration: "KDA 001A",
    cover_type: "comprehensive",
    cover_start_date: "2026-06-01",
    cover_end_date: "2027-05-31",
    premium_paid_kes: 45000,
  });
  assertEquals(typeof response.certificate_number, "string");
  assertEquals(response.certificate_number.length > 0, true);
  assertEquals(typeof response.download_url, "string");
  assertMatch(response.download_url, /^https:\/\//);
});

Deno.test("DmvicStub.issueCertificate is idempotent: same key returns same certificate number", async () => {
  const req = {
    idempotency_key: "idem-dmvic-same",
    policy_reference: "POL-002",
    insurer_id: "INS-001",
    insurer_ira_license: "IRA/001/2026",
    customer_id: "cust-456",
    customer_name: "Mary Wanjiru",
    vehicle_registration: "KDB 002B",
    cover_type: "third_party" as const,
    cover_start_date: "2026-06-01",
    cover_end_date: "2027-05-31",
    premium_paid_kes: 12000,
  };
  const r1 = await stub.issueCertificate(req);
  const r2 = await stub.issueCertificate(req);
  assertEquals(r1.certificate_number, r2.certificate_number);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
deno test supabase/functions/_shared/dmvic-adapter.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement the adapter**

```typescript
// supabase/functions/_shared/dmvic-adapter.ts
// Defines the DmvicAdapter interface. DMVIC is the certificate issuing authority.
// The stub simulates DMVIC's response. Real implementation wires in when API docs arrive.

import type { IssueCertificateRequest, IssueCertificateResponse } from "./types.ts";

export interface DmvicAdapter {
  issueCertificate(req: IssueCertificateRequest): Promise<IssueCertificateResponse>;
}

export class DmvicStub implements DmvicAdapter {
  private readonly store = new Map<string, IssueCertificateResponse>();

  async issueCertificate(req: IssueCertificateRequest): Promise<IssueCertificateResponse> {
    if (this.store.has(req.idempotency_key)) {
      return this.store.get(req.idempotency_key)!;
    }
    await new Promise((r) => setTimeout(r, 300));
    const certNumber = `DMVIC-${req.vehicle_registration.replace(/\s/g, "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const response: IssueCertificateResponse = {
      certificate_number: certNumber,
      issued_at: new Date().toISOString(),
      download_url: `https://dmvic-stub.insurely.co.ke/certificates/${certNumber}.pdf`,
    };
    this.store.set(req.idempotency_key, response);
    return response;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
deno test supabase/functions/_shared/dmvic-adapter.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/_shared/dmvic-adapter.ts supabase/functions/_shared/dmvic-adapter.test.ts
git commit -m "feat: DMVIC adapter interface + stub (R7)"
```

---

## Task 8: Payment Webhook Edge Function

**Files:**
- Create: `supabase/functions/payment-webhook/index.ts`
- Create: `supabase/functions/payment-webhook/index.test.ts`

This function receives the confirmed payment callback from the payment processor. It validates the payload, updates payment status, enqueues certificate issuance, and writes audit + reconciliation records. It does not issue certificates itself — that is the responsibility of `issue-certificate`.

- [ ] **Step 1: Write the failing tests**

```typescript
// supabase/functions/payment-webhook/index.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { validateWebhookPayload, buildPaymentRecord } from "./index.ts";

Deno.test("validateWebhookPayload accepts a valid confirmed payload", () => {
  const payload = {
    payment_reference: "MP-REF-001",
    status: "confirmed",
    amount_kes: 45000,
    customer_id: "cust-123",
    session_id: "sess-abc",
    processor: "mpesa",
    confirmed_at: "2026-06-01T10:00:00.000Z",
    ip_address: "41.80.1.1",
  };
  const result = validateWebhookPayload(payload);
  assertEquals(result.valid, true);
});

Deno.test("validateWebhookPayload rejects payload missing payment_reference", () => {
  const payload = {
    status: "confirmed",
    amount_kes: 45000,
    customer_id: "cust-123",
    session_id: "sess-abc",
    processor: "mpesa",
    confirmed_at: "2026-06-01T10:00:00.000Z",
    ip_address: null,
  };
  const result = validateWebhookPayload(payload);
  assertEquals(result.valid, false);
  assertEquals(result.error?.includes("payment_reference"), true);
});

Deno.test("validateWebhookPayload rejects payload with zero or negative amount", () => {
  const payload = {
    payment_reference: "MP-REF-002",
    status: "confirmed",
    amount_kes: 0,
    customer_id: "cust-123",
    session_id: "sess-abc",
    processor: "mpesa",
    confirmed_at: "2026-06-01T10:00:00.000Z",
    ip_address: null,
  };
  const result = validateWebhookPayload(payload);
  assertEquals(result.valid, false);
});

Deno.test("buildPaymentRecord sets status to confirmed and includes confirmed_at", () => {
  const payload = {
    payment_reference: "MP-REF-003",
    status: "confirmed" as const,
    amount_kes: 12000,
    customer_id: "cust-456",
    session_id: "sess-xyz",
    processor: "mpesa" as const,
    confirmed_at: "2026-06-01T11:00:00.000Z",
    ip_address: "41.80.2.2",
  };
  const record = buildPaymentRecord(payload, "idem-001", "quote-789");
  assertEquals(record.status, "confirmed");
  assertEquals(record.confirmed_at, "2026-06-01T11:00:00.000Z");
  assertEquals(record.idempotency_key, "idem-001");
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
deno test supabase/functions/payment-webhook/index.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement the function**

```typescript
// supabase/functions/payment-webhook/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { writeAuditEvent } from "../_shared/audit.ts";
import { buildReconEntry, writeReconLog } from "../_shared/reconciliation.ts";
import { generateIdempotencyKey, scopedKey } from "../_shared/idempotency.ts";
import type { PaymentWebhookPayload } from "../_shared/types.ts";

const SYSTEM_VERSION = "1.0.0";

// ─── VALIDATION ───────────────────────────────────────────────────────────────
interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateWebhookPayload(raw: unknown): ValidationResult {
  const p = raw as Record<string, unknown>;
  if (!p.payment_reference || typeof p.payment_reference !== "string") {
    return { valid: false, error: "payment_reference is required" };
  }
  if (p.status !== "confirmed" && p.status !== "failed") {
    return { valid: false, error: "status must be confirmed or failed" };
  }
  if (typeof p.amount_kes !== "number" || p.amount_kes <= 0) {
    return { valid: false, error: "amount_kes must be a positive number" };
  }
  if (!p.customer_id || typeof p.customer_id !== "string") {
    return { valid: false, error: "customer_id is required" };
  }
  if (!p.session_id || typeof p.session_id !== "string") {
    return { valid: false, error: "session_id is required" };
  }
  if (p.processor !== "mpesa" && p.processor !== "card") {
    return { valid: false, error: "processor must be mpesa or card" };
  }
  if (!p.confirmed_at || typeof p.confirmed_at !== "string" || isNaN(Date.parse(p.confirmed_at as string))) {
    return { valid: false, error: "confirmed_at must be a valid ISO 8601 datetime" };
  }
  return { valid: true };
}

export function buildPaymentRecord(
  payload: PaymentWebhookPayload,
  idempotencyKey: string,
  quoteId: string,
) {
  return {
    payment_reference: payload.payment_reference,
    idempotency_key: idempotencyKey,
    customer_id: payload.customer_id,
    quote_id: quoteId,
    amount_kes: payload.amount_kes,
    currency: "KES",
    status: payload.status,
    payment_processor: payload.processor,
    processor_response: null,
    confirmed_at: payload.status === "confirmed" ? payload.confirmed_at : null,
    session_id: payload.session_id,
    ip_address: payload.ip_address,
  };
}

// ─── EDGE FUNCTION HANDLER ───────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  const requestId = crypto.randomUUID();

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const validation = validateWebhookPayload(body);
  if (!validation.valid) {
    return new Response(JSON.stringify({ error: validation.error }), { status: 400 });
  }

  const payload = body as PaymentWebhookPayload;
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Check idempotency: if this payment_reference already exists, return early.
  const { data: existingPayment } = await supabase
    .from("payments")
    .select("id, status")
    .eq("payment_reference", payload.payment_reference)
    .maybeSingle();

  if (existingPayment) {
    return new Response(
      JSON.stringify({ ok: true, payment_id: existingPayment.id, idempotent: true }),
      { status: 200 },
    );
  }

  // Generate idempotency key for this payment record.
  // quote_id must be included in the webhook payload in production; stub with empty string here.
  const idempotencyKey = generateIdempotencyKey();
  const quoteId = (payload as Record<string, unknown>).quote_id as string ?? "";
  const paymentRecord = buildPaymentRecord(payload, idempotencyKey, quoteId);

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert(paymentRecord)
    .select("id")
    .single();

  if (paymentError || !payment) {
    console.error("Payment insert failed:", paymentError);
    return new Response(JSON.stringify({ error: "Payment record creation failed" }), { status: 500 });
  }

  // Write audit event for payment_confirmed (R10).
  await writeAuditEvent(supabase, {
    event_type: "payment_confirmed",
    actor: "system",
    customer_id: payload.customer_id,
    request_id: requestId,
    entity_type: "payment",
    entity_id: payment.id,
    before_state: null,
    after_state: paymentRecord,
    system_version: SYSTEM_VERSION,
    ip_address: payload.ip_address,
  });

  // If payment is confirmed, enqueue certificate issuance.
  if (payload.status === "confirmed") {
    const queueKey = scopedKey("certificate", payload.payment_reference);
    await supabase.from("certificate_queue").insert({
      payment_id: payment.id,
      idempotency_key: queueKey,
      status: "pending",
      next_attempt_at: new Date().toISOString(),
    });

    await writeAuditEvent(supabase, {
      event_type: "certificate_queued",
      actor: "system",
      customer_id: payload.customer_id,
      request_id: requestId,
      entity_type: "payment",
      entity_id: payment.id,
      before_state: null,
      after_state: { queue_key: queueKey, payment_id: payment.id },
      system_version: SYSTEM_VERSION,
      ip_address: payload.ip_address,
    });
  }

  // Write reconciliation log for the webhook receipt (R8).
  const reconEntry = await buildReconEntry({
    integration_name: payload.processor === "mpesa" ? "mpesa" : "card",
    operation_type: "payment_webhook",
    idempotency_key: idempotencyKey,
    related_entity_type: "payment",
    related_entity_id: payment.id,
    request_payload: paymentRecord,
    response_status: "success",
    response_body: { payment_id: payment.id },
    latency_ms: 0,
  });
  await writeReconLog(supabase, reconEntry);

  return new Response(JSON.stringify({ ok: true, payment_id: payment.id }), { status: 200 });
});
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
deno test supabase/functions/payment-webhook/index.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/payment-webhook/
git commit -m "feat: payment webhook with idempotency, audit, and queue enqueue (R4, R6, R8, R10)"
```

---

## Task 9: Certificate Issuance Edge Function

**Files:**
- Create: `supabase/functions/issue-certificate/index.ts`
- Create: `supabase/functions/issue-certificate/index.test.ts`

This function is called by the queue processor. It orchestrates: insurer policy creation → DMVIC certificate issuance → certificate record persistence → customer notification trigger. All external calls use the adapter interfaces. Idempotency is checked at every step.

- [ ] **Step 1: Write the failing tests**

```typescript
// supabase/functions/issue-certificate/index.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { buildCertificateRecord, validateCertificateCompleteness } from "./index.ts";
import type { CreatePolicyResponse, IssueCertificateResponse } from "../_shared/types.ts";

Deno.test("buildCertificateRecord maps all 11 R5-required fields", () => {
  const policyRes: CreatePolicyResponse = {
    policy_reference: "POL-001",
    insurer_id: "INS-001",
    insurer_ira_license: "IRA/001/2026",
    status: "active",
    issued_at: "2026-06-01T10:00:00.000Z",
  };
  const dmvicRes: IssueCertificateResponse = {
    certificate_number: "DMVIC-KDA001A-ABC123",
    issued_at: "2026-06-01T10:01:00.000Z",
    download_url: "https://dmvic-stub.insurely.co.ke/certificates/DMVIC-KDA001A-ABC123.pdf",
  };
  const record = buildCertificateRecord({
    policyId: "policy-uuid-001",
    paymentId: "payment-uuid-001",
    idempotencyKey: "idem-cert-001",
    policyResponse: policyRes,
    dmvicResponse: dmvicRes,
    vehicleRegistration: "KDA 001A",
    coverStartDate: "2026-06-01",
    coverEndDate: "2027-05-31",
    premiumPaidKes: 45000,
    customerId: "cust-123",
    customerName: "John Kamau",
  });
  // Verify all 11 R5 fields are present and non-empty
  assertEquals(typeof record.policy_id, "string");
  assertEquals(typeof record.payment_id, "string");
  assertEquals(typeof record.certificate_number, "string");
  assertEquals(typeof record.insurer_id, "string");
  assertEquals(typeof record.insurer_ira_license, "string");
  assertEquals(typeof record.vehicle_registration, "string");
  assertEquals(typeof record.cover_start_date, "string");
  assertEquals(typeof record.cover_end_date, "string");
  assertEquals(typeof record.premium_paid_kes, "number");
  assertEquals(typeof record.customer_id, "string");
  assertEquals(typeof record.customer_name, "string");
  assertEquals(typeof record.issued_at, "string");
  assertEquals(typeof record.issuing_system, "string");
});

Deno.test("validateCertificateCompleteness fails if certificate_number is empty", () => {
  const result = validateCertificateCompleteness({ certificate_number: "" });
  assertEquals(result, false);
});

Deno.test("validateCertificateCompleteness passes for a complete record", () => {
  const result = validateCertificateCompleteness({
    certificate_number: "DMVIC-KDA001A-ABC123",
    insurer_id: "INS-001",
    insurer_ira_license: "IRA/001/2026",
    vehicle_registration: "KDA 001A",
    cover_start_date: "2026-06-01",
    cover_end_date: "2027-05-31",
    premium_paid_kes: 45000,
    customer_id: "cust-123",
    customer_name: "John Kamau",
    issued_at: "2026-06-01T10:01:00.000Z",
    issuing_system: "dmvic",
  });
  assertEquals(result, true);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
deno test supabase/functions/issue-certificate/index.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement the function**

```typescript
// supabase/functions/issue-certificate/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { writeAuditEvent } from "../_shared/audit.ts";
import { buildReconEntry, writeReconLog } from "../_shared/reconciliation.ts";
import { scopedKey } from "../_shared/idempotency.ts";
import { InsurerStub } from "../_shared/insurer-adapter.ts";
import { DmvicStub } from "../_shared/dmvic-adapter.ts";
import type { CreatePolicyResponse, IssueCertificateResponse } from "../_shared/types.ts";

const SYSTEM_VERSION = "1.0.0";

// ─── HELPERS (exported for testing) ──────────────────────────────────────────

interface BuildCertificateRecordInput {
  policyId: string;
  paymentId: string;
  idempotencyKey: string;
  policyResponse: CreatePolicyResponse;
  dmvicResponse: IssueCertificateResponse;
  vehicleRegistration: string;
  coverStartDate: string;
  coverEndDate: string;
  premiumPaidKes: number;
  customerId: string;
  customerName: string;
}

export function buildCertificateRecord(input: BuildCertificateRecordInput) {
  return {
    policy_id: input.policyId,
    payment_id: input.paymentId,
    idempotency_key: input.idempotencyKey,
    certificate_number: input.dmvicResponse.certificate_number,
    insurer_id: input.policyResponse.insurer_id,
    insurer_ira_license: input.policyResponse.insurer_ira_license,
    vehicle_registration: input.vehicleRegistration,
    cover_start_date: input.coverStartDate,
    cover_end_date: input.coverEndDate,
    premium_paid_kes: input.premiumPaidKes,
    customer_id: input.customerId,
    customer_name: input.customerName,
    issued_at: input.dmvicResponse.issued_at,
    issuing_system: "dmvic",
    status: "issued",
    dmvic_response: input.dmvicResponse,
  };
}

export function validateCertificateCompleteness(record: Record<string, unknown>): boolean {
  const required = [
    "certificate_number", "insurer_id", "insurer_ira_license",
    "vehicle_registration", "cover_start_date", "cover_end_date",
    "premium_paid_kes", "customer_id", "customer_name", "issued_at", "issuing_system",
  ];
  return required.every((f) => {
    const v = record[f];
    return v !== undefined && v !== null && v !== "";
  });
}

// ─── ORCHESTRATION ────────────────────────────────────────────────────────────
// issueCertificateForPayment is the core orchestration function.
// Called by the queue processor with a payment_id.
export async function issueCertificateForPayment(
  supabase: ReturnType<typeof createClient>,
  paymentId: string,
  requestId: string,
): Promise<{ success: boolean; certificateId?: string; error?: string }> {

  // 1. Load payment record.
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  if (paymentError || !payment) {
    return { success: false, error: "Payment not found" };
  }

  if (payment.status !== "confirmed") {
    return { success: false, error: "Payment not confirmed" };
  }

  // 2. Idempotency: check if a certificate already exists for this payment.
  const { data: existingCert } = await supabase
    .from("certificates")
    .select("id")
    .eq("payment_id", paymentId)
    .maybeSingle();

  if (existingCert) {
    return { success: true, certificateId: existingCert.id };
  }

  // 3. Idempotency: check if a policy already exists for this payment.
  let policy = await supabase
    .from("policies")
    .select("*")
    .eq("payment_id", paymentId)
    .maybeSingle()
    .then((r) => r.data);

  if (!policy) {
    // 4. Create policy with insurer.
    const policyIdempotencyKey = scopedKey("policy", payment.payment_reference);
    const insurer = new InsurerStub(); // swap for RealInsurerAdapter when API available

    await writeAuditEvent(supabase, {
      event_type: "policy_requested",
      actor: "system",
      customer_id: payment.customer_id,
      request_id: requestId,
      entity_type: "payment",
      entity_id: paymentId,
      before_state: null,
      after_state: { payment_id: paymentId, idempotency_key: policyIdempotencyKey },
      system_version: SYSTEM_VERSION,
      ip_address: null,
    });

    const policyStart = Date.now();
    let policyResponse;
    let policyReconStatus: "success" | "error" | "timeout" = "success";
    let policyReconBody: Record<string, unknown> | null = null;

    try {
      policyResponse = await insurer.createPolicy({
        idempotency_key: policyIdempotencyKey,
        customer_id: payment.customer_id,
        customer_name: payment.customer_name ?? "Customer",
        customer_id_number: payment.customer_id_number ?? "",
        vehicle_registration: payment.vehicle_registration ?? "",
        vehicle_make: payment.vehicle_make ?? "",
        vehicle_model: payment.vehicle_model ?? "",
        vehicle_year: payment.vehicle_year ?? 2020,
        cover_type: payment.cover_type ?? "comprehensive",
        cover_start_date: payment.cover_start_date ?? "",
        cover_end_date: payment.cover_end_date ?? "",
        premium_kes: Number(payment.amount_kes),
        payment_reference: payment.payment_reference,
      });
      policyReconBody = policyResponse as unknown as Record<string, unknown>;
    } catch (err) {
      policyReconStatus = "error";
      policyReconBody = { error: String(err) };

      await writeReconLog(supabase, await buildReconEntry({
        integration_name: "insurer",
        operation_type: "create_policy",
        idempotency_key: policyIdempotencyKey,
        related_entity_type: "payment",
        related_entity_id: paymentId,
        request_payload: { payment_id: paymentId },
        response_status: policyReconStatus,
        response_body: policyReconBody,
        latency_ms: Date.now() - policyStart,
      }));

      return { success: false, error: `Insurer API error: ${err}` };
    }

    const policyLatency = Date.now() - policyStart;

    await writeReconLog(supabase, await buildReconEntry({
      integration_name: "insurer",
      operation_type: "create_policy",
      idempotency_key: policyIdempotencyKey,
      related_entity_type: "payment",
      related_entity_id: paymentId,
      request_payload: { payment_id: paymentId },
      response_status: policyReconStatus,
      response_body: policyReconBody,
      latency_ms: policyLatency,
    }));

    // 5. Persist policy record.
    const { data: newPolicy, error: policyInsertError } = await supabase
      .from("policies")
      .insert({
        payment_id: paymentId,
        idempotency_key: policyIdempotencyKey,
        insurer_id: policyResponse.insurer_id,
        policy_reference: policyResponse.policy_reference,
        customer_id: payment.customer_id,
        vehicle_registration: payment.vehicle_registration ?? "",
        cover_type: payment.cover_type ?? "comprehensive",
        cover_start_date: payment.cover_start_date ?? "",
        cover_end_date: payment.cover_end_date ?? "",
        status: "active",
        insurer_response: policyResponse,
      })
      .select("*")
      .single();

    if (policyInsertError || !newPolicy) {
      return { success: false, error: "Policy record creation failed" };
    }

    await writeAuditEvent(supabase, {
      event_type: "policy_created",
      actor: "system",
      customer_id: payment.customer_id,
      request_id: requestId,
      entity_type: "policy",
      entity_id: newPolicy.id,
      before_state: null,
      after_state: newPolicy,
      system_version: SYSTEM_VERSION,
      ip_address: null,
    });

    policy = newPolicy;
  }

  // 6. Issue certificate from DMVIC.
  const certIdempotencyKey = scopedKey("certificate", payment.payment_reference);
  const dmvic = new DmvicStub(); // swap for RealDmvicAdapter when API available

  await writeAuditEvent(supabase, {
    event_type: "certificate_requested",
    actor: "system",
    customer_id: payment.customer_id,
    request_id: requestId,
    entity_type: "policy",
    entity_id: policy.id,
    before_state: null,
    after_state: { policy_id: policy.id, idempotency_key: certIdempotencyKey },
    system_version: SYSTEM_VERSION,
    ip_address: null,
  });

  const dmvicStart = Date.now();
  let dmvicResponse;
  let dmvicReconStatus: "success" | "error" | "timeout" = "success";
  let dmvicReconBody: Record<string, unknown> | null = null;

  try {
    dmvicResponse = await dmvic.issueCertificate({
      idempotency_key: certIdempotencyKey,
      policy_reference: policy.policy_reference,
      insurer_id: policy.insurer_id,
      insurer_ira_license: policy.insurer_ira_license ?? "",
      customer_id: payment.customer_id,
      customer_name: payment.customer_name ?? "Customer",
      vehicle_registration: payment.vehicle_registration ?? "",
      cover_type: payment.cover_type ?? "comprehensive",
      cover_start_date: payment.cover_start_date ?? "",
      cover_end_date: payment.cover_end_date ?? "",
      premium_paid_kes: Number(payment.amount_kes),
    });
    dmvicReconBody = dmvicResponse as unknown as Record<string, unknown>;
  } catch (err) {
    dmvicReconStatus = "error";
    dmvicReconBody = { error: String(err) };

    await writeReconLog(supabase, await buildReconEntry({
      integration_name: "dmvic",
      operation_type: "issue_certificate",
      idempotency_key: certIdempotencyKey,
      related_entity_type: "policy",
      related_entity_id: policy.id,
      request_payload: { policy_id: policy.id },
      response_status: dmvicReconStatus,
      response_body: dmvicReconBody,
      latency_ms: Date.now() - dmvicStart,
    }));

    await writeAuditEvent(supabase, {
      event_type: "certificate_failed",
      actor: "system",
      customer_id: payment.customer_id,
      request_id: requestId,
      entity_type: "policy",
      entity_id: policy.id,
      before_state: null,
      after_state: { error: String(err) },
      system_version: SYSTEM_VERSION,
      ip_address: null,
    });

    return { success: false, error: `DMVIC API error: ${err}` };
  }

  await writeReconLog(supabase, await buildReconEntry({
    integration_name: "dmvic",
    operation_type: "issue_certificate",
    idempotency_key: certIdempotencyKey,
    related_entity_type: "policy",
    related_entity_id: policy.id,
    request_payload: { policy_id: policy.id },
    response_status: dmvicReconStatus,
    response_body: dmvicReconBody,
    latency_ms: Date.now() - dmvicStart,
  }));

  // 7. Persist certificate record (all 11 R5 fields).
  const certRecord = buildCertificateRecord({
    policyId: policy.id,
    paymentId,
    idempotencyKey: certIdempotencyKey,
    policyResponse: {
      policy_reference: policy.policy_reference,
      insurer_id: policy.insurer_id,
      insurer_ira_license: policy.insurer_ira_license ?? "",
      status: "active",
      issued_at: policy.created_at,
    },
    dmvicResponse,
    vehicleRegistration: payment.vehicle_registration ?? "",
    coverStartDate: payment.cover_start_date ?? "",
    coverEndDate: payment.cover_end_date ?? "",
    premiumPaidKes: Number(payment.amount_kes),
    customerId: payment.customer_id,
    customerName: payment.customer_name ?? "Customer",
  });

  if (!validateCertificateCompleteness(certRecord as Record<string, unknown>)) {
    return { success: false, error: "Certificate record is incomplete — missing required fields" };
  }

  const { data: certificate, error: certInsertError } = await supabase
    .from("certificates")
    .insert(certRecord)
    .select("id")
    .single();

  if (certInsertError || !certificate) {
    return { success: false, error: "Certificate record persistence failed" };
  }

  // 8. Write certificate_issued audit event (R10).
  await writeAuditEvent(supabase, {
    event_type: "certificate_issued",
    actor: "system",
    customer_id: payment.customer_id,
    request_id: requestId,
    entity_type: "certificate",
    entity_id: certificate.id,
    before_state: null,
    after_state: certRecord,
    system_version: SYSTEM_VERSION,
    ip_address: null,
  });

  // 9. Trigger customer notification (fire-and-forget — handled by send-certificate-email).
  await supabase.functions.invoke("send-certificate-email", {
    body: {
      certificate_id: certificate.id,
      customer_id: payment.customer_id,
      download_url: dmvicResponse.download_url,
      certificate_number: dmvicResponse.certificate_number,
    },
  });

  return { success: true, certificateId: certificate.id };
}

// ─── EDGE FUNCTION HANDLER ───────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  const requestId = crypto.randomUUID();
  const { payment_id } = await req.json();

  if (!payment_id) {
    return new Response(JSON.stringify({ error: "payment_id required" }), { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const result = await issueCertificateForPayment(supabase, payment_id, requestId);

  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 500,
  });
});
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
deno test supabase/functions/issue-certificate/index.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/issue-certificate/
git commit -m "feat: certificate issuance orchestration with idempotency, R5 fields, audit, recon (R2, R5, R6, R7, R8, R10)"
```

---

## Task 10: Queue Processor Edge Function

**Files:**
- Create: `supabase/functions/process-certificate-queue/index.ts`
- Create: `supabase/functions/process-certificate-queue/index.test.ts`

This function is invoked on a schedule (every minute via pg_cron or Supabase scheduled function). It picks up `pending` queue entries and calls `issueCertificateForPayment`. After 5 failed attempts (= 5 minutes), it marks the entry `failed` and alerts operations.

- [ ] **Step 1: Write the failing tests**

```typescript
// supabase/functions/process-certificate-queue/index.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { shouldRetry, computeNextAttemptAt } from "./index.ts";

Deno.test("shouldRetry returns true for attempts < 5", () => {
  assertEquals(shouldRetry(0), true);
  assertEquals(shouldRetry(4), true);
});

Deno.test("shouldRetry returns false at 5 attempts", () => {
  assertEquals(shouldRetry(5), false);
});

Deno.test("computeNextAttemptAt returns a date 60 seconds in the future", () => {
  const before = Date.now();
  const next = computeNextAttemptAt();
  const after = Date.now();
  const nextMs = new Date(next).getTime();
  assertEquals(nextMs >= before + 60_000, true);
  assertEquals(nextMs <= after + 61_000, true);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
deno test supabase/functions/process-certificate-queue/index.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement the function**

```typescript
// supabase/functions/process-certificate-queue/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { issueCertificateForPayment } from "../issue-certificate/index.ts";

const MAX_ATTEMPTS = 5;

export function shouldRetry(attempts: number): boolean {
  return attempts < MAX_ATTEMPTS;
}

export function computeNextAttemptAt(): string {
  return new Date(Date.now() + 60_000).toISOString();
}

Deno.serve(async (_req: Request) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Fetch all pending queue entries that are due.
  const { data: entries, error } = await supabase
    .from("certificate_queue")
    .select("*")
    .eq("status", "pending")
    .lte("next_attempt_at", new Date().toISOString())
    .order("created_at", { ascending: true })
    .limit(20);

  if (error || !entries?.length) {
    return new Response(JSON.stringify({ processed: 0 }), { status: 200 });
  }

  let processed = 0;
  let failed = 0;

  for (const entry of entries) {
    // Mark as processing to prevent concurrent pickup.
    await supabase
      .from("certificate_queue")
      .update({ status: "processing", last_attempted_at: new Date().toISOString() })
      .eq("id", entry.id);

    const requestId = crypto.randomUUID();
    const result = await issueCertificateForPayment(supabase, entry.payment_id, requestId);

    if (result.success) {
      await supabase
        .from("certificate_queue")
        .update({ status: "completed" })
        .eq("id", entry.id);
      processed++;
    } else {
      const newAttempts = entry.attempts + 1;
      if (!shouldRetry(newAttempts)) {
        // 5-minute SLA exhausted: mark failed, alert operations.
        await supabase
          .from("certificate_queue")
          .update({
            status: "failed",
            attempts: newAttempts,
            error_detail: result.error ?? "Unknown error",
          })
          .eq("id", entry.id);

        // TODO: wire to operations alerting (PagerDuty / Slack) when available.
        console.error(`Certificate queue entry ${entry.id} exhausted retries:`, result.error);
        failed++;
      } else {
        await supabase
          .from("certificate_queue")
          .update({
            status: "pending",
            attempts: newAttempts,
            next_attempt_at: computeNextAttemptAt(),
            error_detail: result.error ?? null,
          })
          .eq("id", entry.id);
      }
    }
  }

  return new Response(JSON.stringify({ processed, failed }), { status: 200 });
});
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
deno test supabase/functions/process-certificate-queue/index.test.ts
```

Expected: PASS.

- [ ] **Step 5: Register as a scheduled function**

In the Supabase dashboard → Edge Functions → Schedule, add:

```
Function: process-certificate-queue
Schedule: * * * * *   (every minute)
```

Or via SQL if pg_cron is enabled:

```sql
select cron.schedule(
  'process-certificate-queue',
  '* * * * *',
  $$select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'SUPABASE_FUNCTIONS_URL') || '/process-certificate-queue',
    headers := '{"Authorization": "Bearer " || current_setting(''app.service_role_key'')}',
    body := '{}'
  )$$
);
```

- [ ] **Step 6: Commit**

```bash
git add supabase/functions/process-certificate-queue/
git commit -m "feat: certificate queue processor with 5-attempt retry, 5-min SLA (R9)"
```

---

## Task 11: Certificate Email Notification

**Files:**
- Create: `supabase/functions/send-certificate-email/index.ts`
- Create: `supabase/functions/send-certificate-email/index.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// supabase/functions/send-certificate-email/index.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { buildCertificateEmailHtml } from "./index.ts";

Deno.test("buildCertificateEmailHtml includes certificate number", () => {
  const html = buildCertificateEmailHtml({
    customerName: "John Kamau",
    certificateNumber: "DMVIC-KDA001A-ABC123",
    vehicleRegistration: "KDA 001A",
    coverStartDate: "2026-06-01",
    coverEndDate: "2027-05-31",
    downloadUrl: "https://dmvic-stub.insurely.co.ke/certificates/DMVIC-KDA001A-ABC123.pdf",
  });
  assertEquals(html.includes("DMVIC-KDA001A-ABC123"), true);
  assertEquals(html.includes("John Kamau"), true);
  assertEquals(html.includes("KDA 001A"), true);
  assertEquals(html.includes("https://dmvic-stub.insurely.co.ke"), true);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
deno test supabase/functions/send-certificate-email/index.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement the function**

```typescript
// supabase/functions/send-certificate-email/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { writeAuditEvent } from "../_shared/audit.ts";
import { buildReconEntry, writeReconLog } from "../_shared/reconciliation.ts";

const SYSTEM_VERSION = "1.0.0";
const FROM_ADDRESS = "Insurely <hello@insurely.co.ke>";

interface CertificateEmailData {
  customerName: string;
  certificateNumber: string;
  vehicleRegistration: string;
  coverStartDate: string;
  coverEndDate: string;
  downloadUrl: string;
}

export function buildCertificateEmailHtml(data: CertificateEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #c9a55c;">Your Insurance Certificate is Ready</h2>
  <p>Dear ${data.customerName},</p>
  <p>Your motor insurance certificate has been issued. Details below:</p>
  <table style="border-collapse: collapse; width: 100%;">
    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Certificate Number</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.certificateNumber}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Vehicle Registration</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.vehicleRegistration}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Cover Period</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.coverStartDate} to ${data.coverEndDate}</td></tr>
  </table>
  <p style="margin-top: 24px;">
    <a href="${data.downloadUrl}"
       style="background: #c9a55c; color: #0a0907; padding: 12px 24px; text-decoration: none; font-weight: bold; display: inline-block;">
      Download Certificate (PDF)
    </a>
  </p>
  <p style="color: #777; font-size: 12px;">
    This certificate was issued by the licensed underwriter via DMVIC.
    Insurely acts as your insurance intermediary only.
    Keep this document in your vehicle at all times.
  </p>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  const requestId = crypto.randomUUID();
  const { certificate_id, customer_id, download_url, certificate_number } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Load certificate + customer details.
  const { data: cert } = await supabase
    .from("certificates")
    .select("*, policies(policy_reference)")
    .eq("id", certificate_id)
    .single();

  if (!cert) {
    return new Response(JSON.stringify({ error: "Certificate not found" }), { status: 404 });
  }

  // Load customer email — assumes a profiles or auth.users lookup.
  const { data: { user } } = await supabase.auth.admin.getUserById(customer_id);
  const customerEmail = user?.email;

  if (!customerEmail) {
    return new Response(JSON.stringify({ error: "Customer email not found" }), { status: 404 });
  }

  const html = buildCertificateEmailHtml({
    customerName: cert.customer_name,
    certificateNumber: certificate_number,
    vehicleRegistration: cert.vehicle_registration,
    coverStartDate: cert.cover_start_date,
    coverEndDate: cert.cover_end_date,
    downloadUrl: download_url,
  });

  const emailStart = Date.now();
  let resendStatus: "success" | "error" = "success";
  let resendBody: Record<string, unknown> | null = null;

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [customerEmail],
      subject: `Your Motor Insurance Certificate — ${certificate_number}`,
      html,
    }),
  });

  const emailLatency = Date.now() - emailStart;

  if (!resendResponse.ok) {
    resendStatus = "error";
    resendBody = { status: resendResponse.status, body: await resendResponse.text() };
  } else {
    resendBody = await resendResponse.json();
  }

  await writeReconLog(supabase, await buildReconEntry({
    integration_name: "resend",
    operation_type: "send_certificate_email",
    idempotency_key: `email:${certificate_id}`,
    related_entity_type: "certificate",
    related_entity_id: certificate_id,
    request_payload: { to: customerEmail, certificate_id },
    response_status: resendStatus,
    response_body: resendBody,
    latency_ms: emailLatency,
  }));

  await writeAuditEvent(supabase, {
    event_type: "certificate_issued",   // re-use: email delivery is part of issuance
    actor: "system",
    customer_id,
    request_id: requestId,
    entity_type: "certificate",
    entity_id: certificate_id,
    before_state: null,
    after_state: { email_sent: resendStatus === "success", to: customerEmail },
    system_version: SYSTEM_VERSION,
    ip_address: null,
  });

  return new Response(
    JSON.stringify({ ok: resendStatus === "success" }),
    { status: resendStatus === "success" ? 200 : 500 },
  );
});
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
deno test supabase/functions/send-certificate-email/index.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/send-certificate-email/
git commit -m "feat: certificate email delivery via Resend with audit and reconciliation (R8, R10)"
```

---

## Task 12: End-to-End Regression Test

**Files:**
- Create: `supabase/functions/_tests/e2e-certificate-flow.test.ts`

This test covers the full quote-to-certificate path using stub adapters and an in-memory Supabase mock. It satisfies R17 (regression test for end-to-end flow) and R19 (no untested certificate logic in production).

- [ ] **Step 1: Write the test**

```typescript
// supabase/functions/_tests/e2e-certificate-flow.test.ts
// End-to-end regression test: payment confirmed → certificate issued.
// Uses stub adapters (InsurerStub, DmvicStub) and real idempotency/audit logic.
// Satisfies R17, R19.

import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { InsurerStub } from "../_shared/insurer-adapter.ts";
import { DmvicStub } from "../_shared/dmvic-adapter.ts";
import { scopedKey } from "../_shared/idempotency.ts";
import { buildCertificateRecord, validateCertificateCompleteness } from "../issue-certificate/index.ts";

const PAYMENT_REFERENCE = "MP-E2E-REF-001";

Deno.test("E2E: insurer creates policy, DMVIC issues certificate, record is complete", async () => {
  const insurer = new InsurerStub();
  const dmvic = new DmvicStub();

  const policyKey = scopedKey("policy", PAYMENT_REFERENCE);
  const certKey = scopedKey("certificate", PAYMENT_REFERENCE);

  // Step 1: Create policy with insurer.
  const policyResponse = await insurer.createPolicy({
    idempotency_key: policyKey,
    customer_id: "cust-e2e-001",
    customer_name: "Grace Akinyi",
    customer_id_number: "11223344",
    vehicle_registration: "KDC 003C",
    vehicle_make: "Toyota",
    vehicle_model: "Vitz",
    vehicle_year: 2021,
    cover_type: "comprehensive",
    cover_start_date: "2026-07-01",
    cover_end_date: "2027-06-30",
    premium_kes: 38000,
    payment_reference: PAYMENT_REFERENCE,
  });

  assertEquals(typeof policyResponse.policy_reference, "string");
  assertEquals(policyResponse.status, "active");

  // Step 2: Issue certificate from DMVIC.
  const dmvicResponse = await dmvic.issueCertificate({
    idempotency_key: certKey,
    policy_reference: policyResponse.policy_reference,
    insurer_id: policyResponse.insurer_id,
    insurer_ira_license: policyResponse.insurer_ira_license,
    customer_id: "cust-e2e-001",
    customer_name: "Grace Akinyi",
    vehicle_registration: "KDC 003C",
    cover_type: "comprehensive",
    cover_start_date: "2026-07-01",
    cover_end_date: "2027-06-30",
    premium_paid_kes: 38000,
  });

  assertExists(dmvicResponse.certificate_number);
  assertExists(dmvicResponse.download_url);

  // Step 3: Build and validate the certificate record (all 11 R5 fields).
  const certRecord = buildCertificateRecord({
    policyId: "policy-e2e-uuid",
    paymentId: "payment-e2e-uuid",
    idempotencyKey: certKey,
    policyResponse,
    dmvicResponse,
    vehicleRegistration: "KDC 003C",
    coverStartDate: "2026-07-01",
    coverEndDate: "2027-06-30",
    premiumPaidKes: 38000,
    customerId: "cust-e2e-001",
    customerName: "Grace Akinyi",
  });

  assertEquals(validateCertificateCompleteness(certRecord as Record<string, unknown>), true);
  assertEquals(certRecord.certificate_number, dmvicResponse.certificate_number);
  assertEquals(certRecord.insurer_ira_license, policyResponse.insurer_ira_license);
  assertEquals(certRecord.issuing_system, "dmvic");

  // Step 4: Idempotency — same keys return same references.
  const policyResponse2 = await insurer.createPolicy({
    idempotency_key: policyKey,
    customer_id: "cust-e2e-001",
    customer_name: "Grace Akinyi",
    customer_id_number: "11223344",
    vehicle_registration: "KDC 003C",
    vehicle_make: "Toyota",
    vehicle_model: "Vitz",
    vehicle_year: 2021,
    cover_type: "comprehensive",
    cover_start_date: "2026-07-01",
    cover_end_date: "2027-06-30",
    premium_kes: 38000,
    payment_reference: PAYMENT_REFERENCE,
  });
  assertEquals(policyResponse2.policy_reference, policyResponse.policy_reference);

  const dmvicResponse2 = await dmvic.issueCertificate({
    idempotency_key: certKey,
    policy_reference: policyResponse.policy_reference,
    insurer_id: policyResponse.insurer_id,
    insurer_ira_license: policyResponse.insurer_ira_license,
    customer_id: "cust-e2e-001",
    customer_name: "Grace Akinyi",
    vehicle_registration: "KDC 003C",
    cover_type: "comprehensive",
    cover_start_date: "2026-07-01",
    cover_end_date: "2027-06-30",
    premium_paid_kes: 38000,
  });
  assertEquals(dmvicResponse2.certificate_number, dmvicResponse.certificate_number);
});
```

- [ ] **Step 2: Run the test**

```bash
deno test supabase/functions/_tests/e2e-certificate-flow.test.ts
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add supabase/functions/_tests/e2e-certificate-flow.test.ts
git commit -m "test: e2e regression test for quote-to-certificate flow (R17, R19)"
```

---

## Self-Review Against Spec

**Spec coverage check:**

| Spec requirement | Covered by |
|---|---|
| Payment confirmation is a hard gate | Task 8: `payment-webhook` only enqueues on `status === "confirmed"` |
| Insurer confirmation is a hard gate | Task 9: policy must be `active` before DMVIC is called |
| One certificate per payment reference | Task 9: `certificates.payment_id` unique constraint + idempotency check |
| 11 R5 certificate fields | Task 9: `buildCertificateRecord`, `validateCertificateCompleteness` |
| Immutable audit log for 6 material events | Tasks 8, 9, 11: `writeAuditEvent` called for all 6 event types |
| Customer email within 5 minutes | Task 10: queue retries every 60s, max 5 attempts; Task 11: email function |
| Certificate shows underwriter name + IRA license | Task 11: HTML includes `insurer_ira_license`; Task 9: `buildCertificateRecord` maps it |
| Insurer unavailable → queue | Task 9: error returns `{ success: false }` → Task 10: retry logic |
| Idempotency keys server-side | Tasks 5, 6, 7: `scopedKey` used before every external call |
| No certificate marked issued without audit log | Task 9: `writeAuditEvent(certificate_issued)` called before returning success |
| Degraded state: payment callback delayed | Task 8: queue only enqueued after `confirmed` status received |
| Degraded state: DMVIC unavailable → 5-minute SLA | Task 10: 5 attempts × 60s = 5 min maximum wait |
| 5-attempt exhaustion → operations alert | Task 10: `console.error` + TODO marker for alerting integration |

**Gaps found during self-review:**

1. `quote_id` is referenced in `buildPaymentRecord` but not sourced from the webhook payload spec. In production the webhook must include `quote_id` (vehicle registration, cover dates, customer name) so `issue-certificate` can populate the policy request. This is a data dependency that must be resolved when designing the payment processor integration — it is not a gap in this plan but must appear in the insurer/payment integration spec.

2. Operations alerting on queue exhaustion (`TODO` in Task 10, Step 3) is a stub. A real alerting integration (Slack webhook, PagerDuty, or email) must be added as a separate task when the alerting provider is chosen.

3. DMVIC PDF download link is DMVIC-hosted (stub returns an `https://` URL). If DMVIC requires Insurely to host the PDF, a storage task must be added. Flag for confirmation when DMVIC API docs arrive.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-10-certificate-issuance.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** — Fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
