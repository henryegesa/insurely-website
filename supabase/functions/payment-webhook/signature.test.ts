// supabase/functions/payment-webhook/signature.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { verifyWebhookSignature, SIGNATURE_HEADER } from "./signature.ts";

// ─── Helper: produce a valid sha256=<hex> signature ──────────────────────────
async function signBody(body: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `sha256=${hex}`;
}

const TEST_SECRET = "test-webhook-secret-32-bytes-min";
const VALID_BODY = JSON.stringify({
  payment_reference: "MP-REF-SIG-001",
  quote_id: "11111111-1111-1111-1111-111111111111",
  status: "confirmed",
  amount_kes: 45000,
  customer_id: "22222222-2222-2222-2222-222222222222",
  session_id: "sess-sig-001",
  processor: "mpesa",
  confirmed_at: "2026-06-01T10:00:00.000Z",
  ip_address: "41.80.1.1",
});

// ─── 1. Valid signature accepted ──────────────────────────────────────────────
Deno.test("verifyWebhookSignature: valid signature accepted", async () => {
  const header = await signBody(VALID_BODY, TEST_SECRET);
  const result = await verifyWebhookSignature(
    new TextEncoder().encode(VALID_BODY),
    header,
    TEST_SECRET,
  );
  assertEquals(result.valid, true);
  assertEquals(result.statusCode, undefined);
});

// ─── 2. Missing signature header → 401 ───────────────────────────────────────
Deno.test("verifyWebhookSignature: missing signature header returns 401", async () => {
  const result = await verifyWebhookSignature(
    new TextEncoder().encode(VALID_BODY),
    null,
    TEST_SECRET,
  );
  assertEquals(result.valid, false);
  assertEquals(result.statusCode, 401);
  assertEquals(result.error?.includes("missing"), true);
});

// ─── 3. Invalid (wrong) signature → 401 ──────────────────────────────────────
Deno.test("verifyWebhookSignature: invalid signature returns 401", async () => {
  const result = await verifyWebhookSignature(
    new TextEncoder().encode(VALID_BODY),
    "sha256=deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
    TEST_SECRET,
  );
  assertEquals(result.valid, false);
  assertEquals(result.statusCode, 401);
  assertEquals(result.error?.includes("mismatch"), true);
});

// ─── 4. Body tampered after signing → 401 ────────────────────────────────────
Deno.test("verifyWebhookSignature: tampered body rejected", async () => {
  const header = await signBody(VALID_BODY, TEST_SECRET);
  // Attacker changes amount_kes from 45000 to 1
  const tamperedBody = VALID_BODY.replace('"amount_kes":45000', '"amount_kes":1');
  const result = await verifyWebhookSignature(
    new TextEncoder().encode(tamperedBody),
    header,
    TEST_SECRET,
  );
  assertEquals(result.valid, false);
  assertEquals(result.statusCode, 401);
  assertEquals(result.error?.includes("mismatch"), true);
});

// ─── 5. Missing PAYMENT_WEBHOOK_SECRET → 500 config error ────────────────────
Deno.test("verifyWebhookSignature: missing secret returns 500", async () => {
  const header = await signBody(VALID_BODY, TEST_SECRET);
  const result = await verifyWebhookSignature(
    new TextEncoder().encode(VALID_BODY),
    header,
    null,
  );
  assertEquals(result.valid, false);
  assertEquals(result.statusCode, 500);
  assertEquals(result.error?.includes("PAYMENT_WEBHOOK_SECRET"), true);
});

Deno.test("verifyWebhookSignature: empty string secret returns 500", async () => {
  const header = await signBody(VALID_BODY, TEST_SECRET);
  const result = await verifyWebhookSignature(
    new TextEncoder().encode(VALID_BODY),
    header,
    "",
  );
  assertEquals(result.valid, false);
  assertEquals(result.statusCode, 500);
});

// ─── 6. Unsigned forged confirmed payment is blocked at signature gate ────────
// This verifies that a forged payment cannot slip through to business logic.
// A real integration test would also confirm no DB writes occur, but since the
// handler guard is the FIRST gate before any supabase call, blocking here is
// sufficient: if sigResult.valid is false, the handler returns before touching
// payments, policies, certificates, certificate_queue, or audit_events.
Deno.test("verifyWebhookSignature: unsigned forged confirmed payment is rejected", async () => {
  const forgedBody = JSON.stringify({
    payment_reference: "MP-FORGED-999",
    quote_id: "33333333-3333-3333-3333-333333333333",
    status: "confirmed",
    amount_kes: 999999,
    customer_id: "44444444-4444-4444-4444-444444444444",
    session_id: "sess-forged",
    processor: "mpesa",
    confirmed_at: "2026-06-01T10:00:00.000Z",
    ip_address: "1.2.3.4",
  });

  // No signature provided — forged request has no X-Webhook-Signature header.
  const result = await verifyWebhookSignature(
    new TextEncoder().encode(forgedBody),
    null, // missing header
    TEST_SECRET,
  );

  assertEquals(result.valid, false);
  assertEquals(result.statusCode, 401);
  // With valid=false the handler returns before any of:
  // payments insert, policies insert, certificate_queue insert, audit write.
});

// ─── 7. Malformed hex in signature header → 401 ───────────────────────────────
Deno.test("verifyWebhookSignature: malformed hex signature returns 401", async () => {
  const result = await verifyWebhookSignature(
    new TextEncoder().encode(VALID_BODY),
    "sha256=not-valid-hex!!",
    TEST_SECRET,
  );
  assertEquals(result.valid, false);
  assertEquals(result.statusCode, 401);
  assertEquals(result.error?.includes("malformed"), true);
});

// ─── 8. Signature constant: SIGNATURE_HEADER is lowercase (for Headers.get) ──
Deno.test("SIGNATURE_HEADER is lowercase", () => {
  assertEquals(SIGNATURE_HEADER, SIGNATURE_HEADER.toLowerCase());
});
