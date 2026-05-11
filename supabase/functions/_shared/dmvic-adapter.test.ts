// supabase/functions/_shared/dmvic-adapter.test.ts
import { assertEquals, assertMatch } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { DmvicStub } from "./dmvic-adapter.ts";

const stub = new DmvicStub();

Deno.test("DmvicStub.issueCertificate returns a certificate number", async () => {
  const response = await stub.issueCertificate({
    idempotency_key: "idem-dmvic-001",
    policy_reference: "POL-001",
    insurer_id: "INS-001",
    insurer_ira_license: "IRA/001/2026",
    customer_id: "cust-123" as any,
    customer_name: "John Kamau",
    vehicle_registration: "KDA 001A",
    cover_type: "comprehensive",
    cover_start_date: "2026-06-01",
    cover_end_date: "2027-05-31",
    premium_paid_kes: 45000,
  });
  assertEquals(typeof response.certificate_number, "string");
  assertEquals(response.certificate_number.length > 0, true);
  assertEquals(typeof response.download_url, "string");
  assertMatch(response.download_url, /^https:\/\//);
});

Deno.test("DmvicStub.issueCertificate is idempotent: same key returns same certificate number", async () => {
  const req = {
    idempotency_key: "idem-dmvic-same",
    policy_reference: "POL-002",
    insurer_id: "INS-001",
    insurer_ira_license: "IRA/001/2026",
    customer_id: "cust-456" as any,
    customer_name: "Mary Wanjiru",
    vehicle_registration: "KDB 002B",
    cover_type: "third_party" as const,
    cover_start_date: "2026-06-01",
    cover_end_date: "2027-05-31",
    premium_paid_kes: 12000,
  };
  const r1 = await stub.issueCertificate(req);
  const r2 = await stub.issueCertificate(req);
  assertEquals(r1.certificate_number, r2.certificate_number);
});
