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
