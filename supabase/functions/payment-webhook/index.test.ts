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
