// supabase/functions/_shared/types.ts

export type PaymentStatus = "pending" | "confirmed" | "failed";
export type PolicyStatus = "requested" | "active" | "failed";
export type CertificateStatus = "issued" | "cancelled";
export type QueueStatus = "pending" | "processing" | "completed" | "failed";
export type ReconciliationStatus = "success" | "error" | "timeout";
export type IntegrationName = "insurer" | "dmvic" | "mpesa" | "card" | "resend";
export type PaymentProcessor = "mpesa" | "card";

// Branded UUID type — prevents passing arbitrary strings where a DB uuid is required.
export type Uuid = string & { readonly __brand: "Uuid" };
export const toUuid = (s: string): Uuid => s as Uuid;

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
  | "certificate_queued"
  | "certificate_cancelled"
  | "certificate_email_sent";

export interface AuditEventInput {
  event_type: MaterialEventType;
  actor: string;           // user_id UUID string or "system"
  customer_id: Uuid | null;
  request_id: string;
  entity_type: string;
  entity_id: Uuid;
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
  related_entity_id?: Uuid;
  request_payload_hash: string;
  response_status: ReconciliationStatus;
  response_body: Record<string, unknown> | null;
  latency_ms: number;
}

// ─── DB ROW TYPES ─────────────────────────────────────────────────────────────
export interface PaymentRow {
  id: Uuid;
  payment_reference: string;
  idempotency_key: string;
  customer_id: Uuid;
  quote_id: Uuid;
  amount_kes: number;
  currency: string;
  status: PaymentStatus;
  payment_processor: PaymentProcessor;
  processor_response: Record<string, unknown> | null;
  confirmed_at: string | null;
  session_id: string;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface PolicyRow {
  id: Uuid;
  payment_id: Uuid;
  idempotency_key: string;
  insurer_id: string;
  policy_reference: string | null;
  customer_id: Uuid;
  vehicle_registration: string;
  cover_type: string;
  cover_start_date: string;
  cover_end_date: string;
  status: PolicyStatus;
  insurer_response: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CertificateRow {
  id: Uuid;
  policy_id: Uuid;
  payment_id: Uuid;
  idempotency_key: string;
  certificate_number: string;
  insurer_id: string;
  insurer_ira_license: string;
  vehicle_registration: string;
  cover_start_date: string;
  cover_end_date: string;
  premium_paid_kes: number;
  customer_id: Uuid;
  customer_name: string;
  issued_at: string;
  issuing_system: string;
  status: CertificateStatus;
  cancelled_at: string | null;
  dmvic_response: Record<string, unknown> | null;
  created_at: string;
}

export interface CertificateQueueRow {
  id: Uuid;
  payment_id: Uuid;
  idempotency_key: string;
  status: QueueStatus;
  attempts: number;
  last_attempted_at: string | null;
  next_attempt_at: string;
  error_detail: string | null;
  created_at: string;
}

// ─── INSURER ADAPTER TYPES ───────────────────────────────────────────────────
export interface CreatePolicyRequest {
  idempotency_key: string;
  customer_id: Uuid;
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
  customer_id: Uuid;
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
  quote_id: string;           // required: maps to NOT NULL uuid payments.quote_id
  status: "confirmed" | "failed";
  amount_kes: number;
  customer_id: Uuid;
  session_id: string;
  processor: PaymentProcessor;
  confirmed_at: string;       // ISO 8601
  ip_address: string | null;
}
