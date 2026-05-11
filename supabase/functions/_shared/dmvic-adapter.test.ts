// supabase/functions/_shared/dmvic-adapter.test.ts
import { assertEquals, assertMatch, assertNotEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { DmvicStub } from "./dmvic-adapter.ts";
import { toUuid } from "./types.ts";

const stub = new DmvicStub();

const baseReq = {
  idempotency_key: "idem-dmvic-001",
  policy_reference: "POL-001",
  insurer_id: "INS-001",
  insurer_ira_license: "IRA/001/2026",
  customer_id: toUuid("cust-123"),
  customer_name: "John Kamau",
  vehicle_registration: "KDA 001A",
  cover_type: "comprehensive" as const,
  cover_start_date: "2026-06-01",
  cover_end_date: "2027-05-31",
  premium_paid_kes: 45000,
};

Deno.test("DmvicStub.issueCertificate returns a valid certificate number and URL", async () => {
  const response = await stub.issueCertificate(baseReq);
  assertEquals(typeof response.certificate_number, "string");
  assertEquals(response.certificate_number.length > 0, true);
  assertMatch(response.download_url, /^https:\/\//);
  assertEquals(isNaN(Date.parse(response.issued_at)), false);
});

Deno.test("DmvicStub.issueCertificate is idempotent: same key returns same certificate number", async () => {
  const req = { ...baseReq, idempotency_key: "idem-dmvic-same", customer_id: toUuid("cust-456") };
  const r1 = await stub.issueCertificate(req);
  const r2 = await stub.issueCertificate(req);
  assertEquals(r1.certificate_number, r2.certificate_number);
});

Deno.test("DmvicStub.issueCertificate returns distinct numbers for distinct idempotency keys", async () => {
  const r1 = await stub.issueCertificate({ ...baseReq, idempotency_key: "idem-dmvic-distinct-A" });
  const r2 = await stub.issueCertificate({ ...baseReq, idempotency_key: "idem-dmvic-distinct-B" });
  assertNotEquals(r1.certificate_number, r2.certificate_number);
});
