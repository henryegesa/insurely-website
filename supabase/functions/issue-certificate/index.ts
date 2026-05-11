// supabase/functions/issue-certificate/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { writeAuditEvent } from "../_shared/audit.ts";
import { buildReconEntry, writeReconLog } from "../_shared/reconciliation.ts";
import { scopedKey } from "../_shared/idempotency.ts";
import { InsurerStub } from "../_shared/insurer-adapter.ts";
import { DmvicStub } from "../_shared/dmvic-adapter.ts";
import type { CreatePolicyResponse, IssueCertificateResponse } from "../_shared/types.ts";
import { toUuid } from "../_shared/types.ts";

const SYSTEM_VERSION = "1.0.0";

// deno-lint-ignore no-explicit-any
const audit = writeAuditEvent as (db: any, ev: any) => Promise<void>;
// deno-lint-ignore no-explicit-any
const recon = writeReconLog as (db: any, entry: any) => Promise<void>;

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
    "policy_id", "payment_id",
    "certificate_number", "insurer_id", "insurer_ira_license",
    "vehicle_registration", "cover_start_date", "cover_end_date",
    "premium_paid_kes", "customer_id", "customer_name", "issued_at", "issuing_system",
  ];
  return required.every((f) => {
    const v = record[f];
    if (typeof v === "number") return v !== 0;
    return v !== undefined && v !== null && v !== "";
  });
}

// deno-lint-ignore no-explicit-any
export async function issueCertificateForPayment(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  paymentId: string,
  requestId: string,
): Promise<{ success: boolean; certificateId?: string; error?: string }> {
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

  const { data: existingCert } = await supabase
    .from("certificates")
    .select("id")
    .eq("payment_id", paymentId)
    .maybeSingle();

  if (existingCert) {
    return { success: true, certificateId: existingCert.id };
  }

  // deno-lint-ignore no-explicit-any
  let policy: any = await supabase
    .from("policies")
    .select("*")
    .eq("payment_id", paymentId)
    .maybeSingle()
    .then((r: { data: unknown }) => r.data);

  if (!policy) {
    const policyIdempotencyKey = scopedKey("policy", payment.payment_reference);
    const insurer = new InsurerStub();

    await audit(supabase, {
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

      await recon(supabase, await buildReconEntry({
        integration_name: "insurer",
        operation_type: "create_policy",
        idempotency_key: policyIdempotencyKey,
        related_entity_type: "payment",
        related_entity_id: toUuid(paymentId),
        request_payload: { payment_id: paymentId },
        response_status: policyReconStatus,
        response_body: policyReconBody,
        latency_ms: Date.now() - policyStart,
      }));

      await audit(supabase, {
        event_type: "policy_failed",
        actor: "system",
        customer_id: payment.customer_id,
        request_id: requestId,
        entity_type: "payment",
        entity_id: paymentId,
        before_state: null,
        after_state: { error: String(err) },
        system_version: SYSTEM_VERSION,
        ip_address: null,
      });

      return { success: false, error: `Insurer API error: ${err}` };
    }

    await recon(supabase, await buildReconEntry({
      integration_name: "insurer",
      operation_type: "create_policy",
      idempotency_key: policyIdempotencyKey,
      related_entity_type: "payment",
      related_entity_id: toUuid(paymentId),
      request_payload: { payment_id: paymentId },
      response_status: policyReconStatus,
      response_body: policyReconBody,
      latency_ms: Date.now() - policyStart,
    }));

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
      await audit(supabase, {
        event_type: "policy_failed",
        actor: "system",
        customer_id: payment.customer_id,
        request_id: requestId,
        entity_type: "payment",
        entity_id: paymentId,
        before_state: null,
        after_state: { error: "Policy DB insert failed", db_error: policyInsertError },
        system_version: SYSTEM_VERSION,
        ip_address: null,
      });
      return { success: false, error: "Policy record creation failed" };
    }

    await audit(supabase, {
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

  const certIdempotencyKey = scopedKey("certificate", payment.payment_reference);
  const dmvic = new DmvicStub();

  await audit(supabase, {
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

  // Fix 2: insurer_ira_license lives in insurer_response jsonb — the policies
  // table has no top-level column for it. Extract it before calling DMVIC.
  const insurerIraLicense: string = policy.insurer_response?.insurer_ira_license ?? "";

  if (!insurerIraLicense) {
    await recon(supabase, await buildReconEntry({
      integration_name: "dmvic",
      operation_type: "issue_certificate",
      idempotency_key: certIdempotencyKey,
      related_entity_type: "policy",
      related_entity_id: policy.id,
      request_payload: { policy_id: policy.id },
      response_status: "error",
      response_body: { error: "insurer_ira_license missing from policy response" },
      latency_ms: 0,
    }));

    await audit(supabase, {
      event_type: "certificate_failed",
      actor: "system",
      customer_id: payment.customer_id,
      request_id: requestId,
      entity_type: "policy",
      entity_id: policy.id,
      before_state: null,
      after_state: { error: "insurer_ira_license missing from policy response" },
      system_version: SYSTEM_VERSION,
      ip_address: null,
    });

    return { success: false, error: "insurer_ira_license missing — cannot issue DMVIC certificate" };
  }

  try {
    dmvicResponse = await dmvic.issueCertificate({
      idempotency_key: certIdempotencyKey,
      policy_reference: policy.policy_reference,
      insurer_id: policy.insurer_id,
      insurer_ira_license: insurerIraLicense,
      customer_id: payment.customer_id,
      customer_name: payment.customer_name ?? "Customer",
      vehicle_registration: payment.vehicle_registration ?? "",
      cover_type: policy.cover_type ?? "comprehensive",
      cover_start_date: policy.cover_start_date ?? "",
      cover_end_date: policy.cover_end_date ?? "",
      premium_paid_kes: Number(payment.amount_kes),
    });
    dmvicReconBody = dmvicResponse as unknown as Record<string, unknown>;
  } catch (err) {
    dmvicReconStatus = "error";
    dmvicReconBody = { error: String(err) };

    await recon(supabase, await buildReconEntry({
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

    await audit(supabase, {
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

  await recon(supabase, await buildReconEntry({
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

  const certRecord = buildCertificateRecord({
    policyId: policy.id,
    paymentId,
    idempotencyKey: certIdempotencyKey,
    policyResponse: {
      policy_reference: policy.policy_reference,
      insurer_id: policy.insurer_id,
      insurer_ira_license: policy.insurer_response?.insurer_ira_license ?? "",
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

  await audit(supabase, {
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

  // Fix 4: email delivery is deliberately decoupled from certificate issuance.
  // A failure here must NOT roll back the issued certificate — the certificate
  // is already recorded and audited. The send-certificate-email function writes
  // its own reconciliation log and audit event on failure, providing full
  // observability without coupling issuance success to email delivery success.
  try {
    const emailResult = await supabase.functions.invoke("send-certificate-email", {
      body: {
        certificate_id: certificate.id,
        customer_id: payment.customer_id,
        download_url: dmvicResponse.download_url,
        certificate_number: dmvicResponse.certificate_number,
      },
    });
    if (emailResult?.error) {
      console.error(`[certificate:${certificate.id}] Email delivery failed (non-fatal):`, emailResult.error);
    }
  } catch (emailErr) {
    console.error(`[certificate:${certificate.id}] Email invoke threw (non-fatal):`, emailErr);
  }

  return { success: true, certificateId: certificate.id };
}

if (import.meta.main) Deno.serve(async (req: Request) => {
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
