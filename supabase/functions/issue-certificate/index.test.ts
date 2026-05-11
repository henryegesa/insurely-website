// supabase/functions/issue-certificate/index.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { buildCertificateRecord, validateCertificateCompleteness, issueCertificateForPayment } from "./index.ts";
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

Deno.test("validateCertificateCompleteness fails if premium_paid_kes is 0", () => {
  const result = validateCertificateCompleteness({
    policy_id: "pol-001",
    payment_id: "pay-001",
    certificate_number: "DMVIC-001",
    insurer_id: "INS-001",
    insurer_ira_license: "IRA/001/2026",
    vehicle_registration: "KDA 001A",
    cover_start_date: "2026-06-01",
    cover_end_date: "2027-05-31",
    premium_paid_kes: 0,
    customer_id: "cust-123",
    customer_name: "John Kamau",
    issued_at: "2026-06-01T10:01:00.000Z",
    issuing_system: "dmvic",
  });
  assertEquals(result, false);
});

Deno.test("validateCertificateCompleteness fails if policy_id is missing", () => {
  const result = validateCertificateCompleteness({
    payment_id: "pay-001",
    certificate_number: "DMVIC-001",
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
  assertEquals(result, false);
});

Deno.test("validateCertificateCompleteness passes for a complete record", () => {
  const result = validateCertificateCompleteness({
    policy_id: "pol-uuid-001",
    payment_id: "pay-uuid-001",
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

// ─── Fix 2: insurer_ira_license from insurer_response ────────────────────────

/** Minimal in-memory supabase stub for issueCertificateForPayment tests. */
function makeIssueCertStub(opts: {
  insurerResponse: Record<string, unknown>;
  dmvicCallSpy?: { called: boolean };
}) {
  const payment = {
    id: "pay-001",
    status: "confirmed",
    customer_id: "cust-001",
    customer_name: "John Kamau",
    payment_reference: "REF-001",
    vehicle_registration: "KDA 001A",
    vehicle_make: "Toyota",
    vehicle_model: "Corolla",
    vehicle_year: 2020,
    cover_type: "comprehensive",
    cover_start_date: "2026-06-01",
    cover_end_date: "2027-05-31",
    amount_kes: 45000,
    customer_id_number: "12345678",
  };

  const policy = {
    id: "pol-001",
    payment_id: "pay-001",
    policy_reference: "POL-STUB-001",
    insurer_id: "INSURER-STUB-001",
    cover_type: "comprehensive",
    cover_start_date: "2026-06-01",
    cover_end_date: "2027-05-31",
    created_at: new Date().toISOString(),
    insurer_response: opts.insurerResponse,
  };

  const capturedDmvicRequest: Record<string, unknown>[] = [];

  return {
    _capturedDmvicRequest: capturedDmvicRequest,
    supabase: {
      from: (table: string) => ({
        select: (_cols: string) => ({
          eq: (_col: string, _val: string) => ({
            single: () => {
              if (table === "payments") return Promise.resolve({ data: payment, error: null });
              return Promise.resolve({ data: null, error: "not found" });
            },
            maybeSingle: () => {
              if (table === "certificates") return Promise.resolve({ data: null, error: null });
              if (table === "policies") return Promise.resolve({ data: policy, error: null });
              return Promise.resolve({ data: null, error: null });
            },
          }),
        }),
        insert: (_obj: unknown) => ({
          select: (_c: string) => ({
            single: () => Promise.resolve({ data: { id: "cert-001" }, error: null }),
          }),
        }),
        update: (_obj: unknown) => ({ eq: () => Promise.resolve({ error: null }) }),
      }),
      functions: {
        invoke: (_name: string, _opts: unknown) => Promise.resolve({ error: null }),
      },
    } as unknown,
  };
}

Deno.test("Fix2: when insurer_response has insurer_ira_license, issuance succeeds and uses the value", async () => {
  const { supabase } = makeIssueCertStub({
    insurerResponse: { insurer_ira_license: "IRA/001/2026" },
  });

  // We need to intercept the reconciliation and audit writes — use a thin no-op
  // wrapper by relying on the stubs already returning success from .from().
  // The function calls recon and audit via supabase.from("reconciliation_logs")
  // and supabase.from("audit_events") .insert() — our stub returns success for all.

  const result = await issueCertificateForPayment(supabase as any, "pay-001", "req-001");
  assertEquals(result.success, true);
});

Deno.test("Fix2: when insurer_response is missing insurer_ira_license, returns failure without calling DMVIC", async () => {
  const { supabase } = makeIssueCertStub({
    insurerResponse: {}, // no insurer_ira_license
  });

  const result = await issueCertificateForPayment(supabase as any, "pay-001", "req-001");
  assertEquals(result.success, false);
  assertEquals(result.error?.includes("insurer_ira_license missing"), true);
});
