// supabase/functions/issue-certificate/index.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { buildCertificateRecord, validateCertificateCompleteness } from "./index.ts";
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

Deno.test("validateCertificateCompleteness passes for a complete record", () => {
  const result = validateCertificateCompleteness({
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
