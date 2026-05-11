// supabase/functions/_shared/insurer-adapter.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { InsurerStub } from "./insurer-adapter.ts";

const stub = new InsurerStub();

Deno.test("InsurerStub.createPolicy returns a policy reference", async () => {
  const response = await stub.createPolicy({
    idempotency_key: "idem-001",
    customer_id: "cust-123" as any,
    customer_name: "John Kamau",
    customer_id_number: "12345678",
    vehicle_registration: "KDA 001A",
    vehicle_make: "Toyota",
    vehicle_model: "Fielder",
    vehicle_year: 2019,
    cover_type: "comprehensive",
    cover_start_date: "2026-06-01",
    cover_end_date: "2027-05-31",
    premium_kes: 45000,
    payment_reference: "MP-REF-001",
  });
  assertEquals(typeof response.policy_reference, "string");
  assertEquals(response.policy_reference.length > 0, true);
  assertEquals(response.status, "active");
  assertEquals(typeof response.insurer_ira_license, "string");
});

Deno.test("InsurerStub.createPolicy is idempotent: same key returns same reference", async () => {
  const req = {
    idempotency_key: "idem-same",
    customer_id: "cust-456" as any,
    customer_name: "Mary Wanjiru",
    customer_id_number: "87654321",
    vehicle_registration: "KDB 002B",
    vehicle_make: "Nissan",
    vehicle_model: "Note",
    vehicle_year: 2020,
    cover_type: "third_party" as const,
    cover_start_date: "2026-06-01",
    cover_end_date: "2027-05-31",
    premium_kes: 12000,
    payment_reference: "MP-REF-002",
  };
  const r1 = await stub.createPolicy(req);
  const r2 = await stub.createPolicy(req);
  assertEquals(r1.policy_reference, r2.policy_reference);
});
