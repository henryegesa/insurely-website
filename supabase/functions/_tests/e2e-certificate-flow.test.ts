// supabase/functions/_tests/e2e-certificate-flow.test.ts
import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { InsurerStub } from "../_shared/insurer-adapter.ts";
import { DmvicStub } from "../_shared/dmvic-adapter.ts";
import { scopedKey } from "../_shared/idempotency.ts";
import { buildCertificateRecord, validateCertificateCompleteness } from "../issue-certificate/index.ts";
import { toUuid } from "../_shared/types.ts";

const PAYMENT_REFERENCE = "MP-E2E-REF-001";

Deno.test("E2E: insurer creates policy, DMVIC issues certificate, record is complete", async () => {
  const insurer = new InsurerStub();
  const dmvic = new DmvicStub();

  const policyKey = scopedKey("policy", PAYMENT_REFERENCE);
  const certKey = scopedKey("certificate", PAYMENT_REFERENCE);

  const policyResponse = await insurer.createPolicy({
    idempotency_key: policyKey,
    customer_id: toUuid("cust-e2e-001"),
    customer_name: "Grace Akinyi",
    customer_id_number: "11223344",
    vehicle_registration: "KDC 003C",
    vehicle_make: "Toyota",
    vehicle_model: "Vitz",
    vehicle_year: 2021,
    cover_type: "comprehensive",
    cover_start_date: "2026-07-01",
    cover_end_date: "2027-06-30",
    premium_kes: 38000,
    payment_reference: PAYMENT_REFERENCE,
  });

  assertEquals(typeof policyResponse.policy_reference, "string");
  assertEquals(policyResponse.status, "active");

  const dmvicResponse = await dmvic.issueCertificate({
    idempotency_key: certKey,
    policy_reference: policyResponse.policy_reference,
    insurer_id: policyResponse.insurer_id,
    insurer_ira_license: policyResponse.insurer_ira_license,
    customer_id: toUuid("cust-e2e-001"),
    customer_name: "Grace Akinyi",
    vehicle_registration: "KDC 003C",
    cover_type: "comprehensive",
    cover_start_date: "2026-07-01",
    cover_end_date: "2027-06-30",
    premium_paid_kes: 38000,
  });

  assertExists(dmvicResponse.certificate_number);
  assertExists(dmvicResponse.download_url);

  const certRecord = buildCertificateRecord({
    policyId: "policy-e2e-uuid",
    paymentId: "payment-e2e-uuid",
    idempotencyKey: certKey,
    policyResponse,
    dmvicResponse,
    vehicleRegistration: "KDC 003C",
    coverStartDate: "2026-07-01",
    coverEndDate: "2027-06-30",
    premiumPaidKes: 38000,
    customerId: "cust-e2e-001",
    customerName: "Grace Akinyi",
  });

  assertEquals(validateCertificateCompleteness(certRecord as Record<string, unknown>), true);
  assertEquals(certRecord.certificate_number, dmvicResponse.certificate_number);
  assertEquals(certRecord.insurer_ira_license, policyResponse.insurer_ira_license);
  assertEquals(certRecord.issuing_system, "dmvic");

  // Idempotency: same keys return same references.
  const policyResponse2 = await insurer.createPolicy({
    idempotency_key: policyKey,
    customer_id: toUuid("cust-e2e-001"),
    customer_name: "Grace Akinyi",
    customer_id_number: "11223344",
    vehicle_registration: "KDC 003C",
    vehicle_make: "Toyota",
    vehicle_model: "Vitz",
    vehicle_year: 2021,
    cover_type: "comprehensive",
    cover_start_date: "2026-07-01",
    cover_end_date: "2027-06-30",
    premium_kes: 38000,
    payment_reference: PAYMENT_REFERENCE,
  });
  assertEquals(policyResponse2.policy_reference, policyResponse.policy_reference);

  const dmvicResponse2 = await dmvic.issueCertificate({
    idempotency_key: certKey,
    policy_reference: policyResponse.policy_reference,
    insurer_id: policyResponse.insurer_id,
    insurer_ira_license: policyResponse.insurer_ira_license,
    customer_id: toUuid("cust-e2e-001"),
    customer_name: "Grace Akinyi",
    vehicle_registration: "KDC 003C",
    cover_type: "comprehensive",
    cover_start_date: "2026-07-01",
    cover_end_date: "2027-06-30",
    premium_paid_kes: 38000,
  });
  assertEquals(dmvicResponse2.certificate_number, dmvicResponse.certificate_number);
});
