// supabase/functions/payment-webhook/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { writeAuditEvent } from "../_shared/audit.ts";
import { buildReconEntry, writeReconLog } from "../_shared/reconciliation.ts";
import { generateIdempotencyKey, scopedKey } from "../_shared/idempotency.ts";
import { verifyWebhookSignature, SIGNATURE_HEADER } from "./signature.ts";
import type { PaymentWebhookPayload } from "../_shared/types.ts";

const SYSTEM_VERSION = "1.0.0";

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
  // Fix 3: quote_id is NOT NULL uuid in the payments table — require it in the
  // webhook payload so the 400 fires before any DB write.
  if (!p.quote_id || typeof p.quote_id !== "string") {
    return { valid: false, error: "quote_id is required" };
  }
  if (p.processor !== "mpesa" && p.processor !== "card") {
    return { valid: false, error: "processor must be mpesa or card" };
  }
  // confirmed_at is required only for confirmed payments
  if (p.status === "confirmed") {
    if (!p.confirmed_at || typeof p.confirmed_at !== "string" || isNaN(Date.parse(p.confirmed_at as string))) {
      return { valid: false, error: "confirmed_at must be a valid ISO 8601 datetime" };
    }
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

if (import.meta.main) Deno.serve(async (req: Request) => {
  const requestId = crypto.randomUUID();

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  // Read raw bytes first — signature must be verified against the original body
  // before any JSON parsing. Parsing first would allow formatting attacks.
  let rawBody: Uint8Array;
  try {
    rawBody = new Uint8Array(await req.arrayBuffer());
  } catch {
    return new Response(JSON.stringify({ error: "Failed to read request body" }), { status: 400 });
  }

  // ── SIGNATURE VERIFICATION ── must happen before any business logic ──────
  const sigResult = await verifyWebhookSignature(
    rawBody,
    req.headers.get(SIGNATURE_HEADER),
    Deno.env.get("PAYMENT_WEBHOOK_SECRET"),
  );

  if (!sigResult.valid) {
    // Safe log: timestamp, source IP, reason only — no payload, no secret.
    console.warn("Webhook signature verification failed", {
      timestamp: new Date().toISOString(),
      source: req.headers.get("x-forwarded-for") ?? "unknown",
      reason: sigResult.error,
      request_id: requestId,
    });
    return new Response(
      JSON.stringify({ error: sigResult.error }),
      { status: sigResult.statusCode ?? 401 },
    );
  }
  // ── END SIGNATURE VERIFICATION ────────────────────────────────────────────

  let body: unknown;
  try {
    body = JSON.parse(new TextDecoder().decode(rawBody));
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

  const idempotencyKey = generateIdempotencyKey();
  // quote_id is validated non-empty by validateWebhookPayload above.
  const quoteId = (payload as unknown as Record<string, unknown>).quote_id as string;
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

  // Fix 5a: ip_address is already a first-class audit field — exclude it from
  // after_state to avoid duplication.
  const { ip_address: _ip, ...auditState } = paymentRecord;
  await writeAuditEvent(supabase as any, {
    event_type: payload.status === "confirmed" ? "payment_confirmed" : "payment_failed",
    actor: "system",
    customer_id: payload.customer_id,
    request_id: requestId,
    entity_type: "payment",
    entity_id: payment.id,
    before_state: null,
    after_state: auditState,
    system_version: SYSTEM_VERSION,
    ip_address: payload.ip_address,
  });

  if (payload.status === "confirmed") {
    const queueKey = scopedKey("certificate", payload.payment_reference);
    await supabase.from("certificate_queue").insert({
      payment_id: payment.id,
      idempotency_key: queueKey,
      status: "pending",
      next_attempt_at: new Date().toISOString(),
    });

    await writeAuditEvent(supabase as any, {
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
  await writeReconLog(supabase as any, reconEntry);

  return new Response(JSON.stringify({ ok: true, payment_id: payment.id }), { status: 200 });
});
