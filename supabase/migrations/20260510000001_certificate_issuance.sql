-- supabase/migrations/20260510000001_certificate_issuance.sql
-- Satisfies: R4, R5, R6, R8, R10, R11

-- ─── PAYMENTS ────────────────────────────────────────────────────────────────
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
  cover_end_date        date not null check (cover_end_date > cover_start_date),
  status                text not null default 'requested'
                          check (status in ('requested', 'active', 'failed')),
  insurer_response      jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ─── CERTIFICATES ─────────────────────────────────────────────────────────────
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
  cover_end_date        date not null check (cover_end_date > cover_start_date),
  premium_paid_kes      numeric(12, 2) not null check (premium_paid_kes > 0),
  customer_id           uuid not null,
  customer_name         text not null,
  issued_at             timestamptz not null,
  issuing_system        text not null default 'dmvic',
  status                text not null default 'issued'
                          check (status in ('issued', 'cancelled')),
  cancelled_at          timestamptz,
  dmvic_response        jsonb,
  created_at            timestamptz not null default now()
);

-- ─── AUDIT_EVENTS ─────────────────────────────────────────────────────────────
-- Immutable. All 13 fields from R10. No update, no delete.
create table if not exists audit_events (
  id              uuid primary key default gen_random_uuid(),
  event_type      text not null,
  actor           text not null,
  customer_id     uuid, -- nullable: system-level events (e.g. scheduled queue runs) have no customer
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

create or replace rule audit_events_no_update as
  on update to audit_events do instead nothing;

create or replace rule audit_events_no_delete as
  on delete to audit_events do instead nothing;

-- ─── RECONCILIATION_LOGS ──────────────────────────────────────────────────────
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
create index if not exists recon_logs_idempotency_idx   on reconciliation_logs (idempotency_key);
create index if not exists cert_queue_status_idx        on certificate_queue (status, next_attempt_at);

-- ─── ATOMIC QUEUE CLAIM (Fix 1: race-condition-free claim) ───────────────────
-- Uses FOR UPDATE SKIP LOCKED so concurrent invocations never claim the same row.
-- Satisfies: R6 (no concurrent double-issuance), R10 (status transition is atomic).
create or replace function claim_next_certificate_queue_entry()
returns setof certificate_queue
language sql
as $$
  update certificate_queue
  set status = 'processing',
      last_attempted_at = now()
  where id = (
    select id
    from certificate_queue
    where status = 'pending'
      and next_attempt_at <= now()
    order by next_attempt_at asc, created_at asc
    for update skip locked
    limit 1
  )
  returning *;
$$;
