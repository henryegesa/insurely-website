// supabase/functions/payment-webhook/index.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { validateWebhookPayload, buildPaymentRecord } from "./index.ts";

Deno.test("validateWebhookPayload accepts a valid confirmed payload", () => {
  const payload = {
    payment_reference: "MP-REF-001",
    quote_id: "quote-abc-001",
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
    quote_id: "quote-abc-001",
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
    quote_id: "quote-abc-001",
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
    quote_id: "quote-abc-001",
    status: "confirmed" as const,
    amount_kes: 12000,
    customer_id: "cust-456" as any,
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

Deno.test("buildPaymentRecord sets confirmed_at to null for failed status", () => {
  const payload = {
    payment_reference: "MP-REF-004",
    quote_id: "quote-abc-001",
    status: "failed" as const,
    amount_kes: 12000,
    customer_id: "cust-789" as any,
    session_id: "sess-fail",
    processor: "mpesa" as const,
    confirmed_at: "2026-06-01T11:00:00.000Z",
    ip_address: null,
  };
  const record = buildPaymentRecord(payload, "idem-002", "quote-789");
  assertEquals(record.status, "failed");
  assertEquals(record.confirmed_at, null);
});

Deno.test("validateWebhookPayload accepts a valid failed payload without confirmed_at", () => {
  const payload = {
    payment_reference: "MP-REF-005",
    quote_id: "quote-abc-001",
    status: "failed",
    amount_kes: 12000,
    customer_id: "cust-123",
    session_id: "sess-fail",
    processor: "card",
    ip_address: null,
  };
  const result = validateWebhookPayload(payload);
  assertEquals(result.valid, true);
});

Deno.test("validateWebhookPayload rejects invalid processor value", () => {
  const payload = {
    payment_reference: "MP-REF-006",
    quote_id: "quote-abc-001",
    status: "confirmed",
    amount_kes: 12000,
    customer_id: "cust-123",
    session_id: "sess-abc",
    processor: "bitcoin",
    confirmed_at: "2026-06-01T11:00:00.000Z",
    ip_address: null,
  };
  const result = validateWebhookPayload(payload);
  assertEquals(result.valid, false);
});

// Fix 3: quote_id is required — missing it must reject before any DB write.
Deno.test("validateWebhookPayload rejects payload missing quote_id", () => {
  const payload = {
    payment_reference: "MP-REF-007",
    // quote_id intentionally omitted
    status: "confirmed",
    amount_kes: 12000,
    customer_id: "cust-123",
    session_id: "sess-abc",
    processor: "mpesa",
    confirmed_at: "2026-06-01T11:00:00.000Z",
    ip_address: null,
  };
  const result = validateWebhookPayload(payload);
  assertEquals(result.valid, false);
  assertEquals(result.error?.includes("quote_id"), true);
});
