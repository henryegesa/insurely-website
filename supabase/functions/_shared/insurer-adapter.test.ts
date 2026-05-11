// supabase/functions/_shared/insurer-adapter.test.ts
import { assertEquals, assertNotEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { InsurerStub } from "./insurer-adapter.ts";
import { toUuid } from "./types.ts";

const stub = new InsurerStub();

const baseReq = {
  idempotency_key: "idem-001",
  customer_id: toUuid("cust-123"),
  customer_name: "John Kamau",
  customer_id_number: "12345678",
  vehicle_registration: "KDA 001A",
  vehicle_make: "Toyota",
  vehicle_model: "Fielder",
  vehicle_year: 2019,
  cover_type: "comprehensive" as const,
  cover_start_date: "2026-06-01",
  cover_end_date: "2027-05-31",
  premium_kes: 45000,
  payment_reference: "MP-REF-001",
};

Deno.test("InsurerStub.createPolicy returns a valid policy reference", async () => {
  const response = await stub.createPolicy(baseReq);
  assertEquals(typeof response.policy_reference, "string");
  assertEquals(response.policy_reference.length > 0, true);
  assertEquals(response.status, "active");
  assertEquals(typeof response.insurer_ira_license, "string");
  assertEquals(isNaN(Date.parse(response.issued_at)), false);
});

Deno.test("InsurerStub.createPolicy is idempotent: same key returns same reference", async () => {
  const req = { ...baseReq, idempotency_key: "idem-same", customer_id: toUuid("cust-456") };
  const r1 = await stub.createPolicy(req);
  const r2 = await stub.createPolicy(req);
  assertEquals(r1.policy_reference, r2.policy_reference);
});

Deno.test("InsurerStub.createPolicy returns distinct references for distinct idempotency keys", async () => {
  const r1 = await stub.createPolicy({ ...baseReq, idempotency_key: "idem-distinct-A" });
  const r2 = await stub.createPolicy({ ...baseReq, idempotency_key: "idem-distinct-B" });
  assertNotEquals(r1.policy_reference, r2.policy_reference);
});
