// supabase/functions/send-certificate-email/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { writeAuditEvent } from "../_shared/audit.ts";
import { buildReconEntry, writeReconLog } from "../_shared/reconciliation.ts";

// deno-lint-ignore no-explicit-any
const audit = writeAuditEvent as (db: any, ev: any) => Promise<void>;
// deno-lint-ignore no-explicit-any
const recon = writeReconLog as (db: any, entry: any) => Promise<void>;

const SYSTEM_VERSION = "1.0.0";
const FROM_ADDRESS = "Insurely <hello@insurely.co.ke>";

// Fix 5c: escape user-supplied values before interpolating into HTML to prevent
// XSS via certificate fields sourced from external APIs or user input.
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface CertificateEmailData {
  customerName: string;
  certificateNumber: string;
  vehicleRegistration: string;
  coverStartDate: string;
  coverEndDate: string;
  downloadUrl: string;
}

export function buildCertificateEmailHtml(data: CertificateEmailData): string {
  const name = escapeHtml(data.customerName);
  const certNum = escapeHtml(data.certificateNumber);
  const vehicleReg = escapeHtml(data.vehicleRegistration);
  const startDate = escapeHtml(data.coverStartDate);
  const endDate = escapeHtml(data.coverEndDate);
  const dlUrl = escapeHtml(data.downloadUrl);
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #c9a55c;">Your Insurance Certificate is Ready</h2>
  <p>Dear ${name},</p>
  <p>Your motor insurance certificate has been issued. Details below:</p>
  <table style="border-collapse: collapse; width: 100%;">
    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Certificate Number</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${certNum}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Vehicle Registration</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${vehicleReg}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Cover Period</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${startDate} to ${endDate}</td></tr>
  </table>
  <p style="margin-top: 24px;">
    <a href="${dlUrl}"
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

if (import.meta.main) Deno.serve(async (req: Request) => {
  const requestId = crypto.randomUUID();
  const { certificate_id, customer_id, download_url, certificate_number } = await req.json();

  // Fix 5b: validate required fields before any DB/email operation.
  if (!certificate_id || !customer_id || !download_url || !certificate_number) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: cert } = await supabase
    .from("certificates")
    .select("*, policies(policy_reference)")
    .eq("id", certificate_id)
    .single();

  if (!cert) {
    return new Response(JSON.stringify({ error: "Certificate not found" }), { status: 404 });
  }

  const { data: userData } = await supabase.auth.admin.getUserById(customer_id);
  const customerEmail = userData?.user?.email;

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

  await recon(supabase, await buildReconEntry({
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

  await audit(supabase, {
    event_type: "certificate_email_sent",
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
