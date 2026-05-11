// supabase/functions/_shared/reconciliation.test.ts
import { assertEquals, assertMatch } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { hashPayload, buildReconEntry, writeReconLog } from "./reconciliation.ts";

Deno.test("hashPayload returns a 64-char hex string", async () => {
  const hash = await hashPayload({ policy_reference: "POL-001" });
  assertMatch(hash, /^[0-9a-f]{64}$/);
});

Deno.test("hashPayload returns different hashes for different payloads", async () => {
  const h1 = await hashPayload({ a: 1 });
  const h2 = await hashPayload({ a: 2 });
  assertEquals(h1 === h2, false);
});

Deno.test("hashPayload is deterministic regardless of key insertion order", async () => {
  const h1 = await hashPayload({ a: 1, b: { x: 1, y: 2 } });
  const h2 = await hashPayload({ b: { y: 2, x: 1 }, a: 1 });
  assertEquals(h1, h2);
});

Deno.test("buildReconEntry includes all required fields", async () => {
  const entry = await buildReconEntry({
    integration_name: "dmvic",
    operation_type: "issue_certificate",
    idempotency_key: "idem-001",
    related_entity_type: "certificate",
    related_entity_id: "cert-456" as any,
    request_payload: { certificate_number: "DMVIC-001" },
    response_status: "success",
    response_body: { certificate_number: "DMVIC-001" },
    latency_ms: 220,
  });
  assertEquals(entry.integration_name, "dmvic");
  assertEquals(entry.operation_type, "issue_certificate");
  assertEquals(entry.idempotency_key, "idem-001");
  assertEquals(entry.related_entity_type, "certificate");
  assertEquals(entry.related_entity_id, "cert-456");
  assertEquals(entry.response_status, "success");
  assertEquals(entry.response_body, { certificate_number: "DMVIC-001" });
  assertEquals(entry.latency_ms, 220);
  assertMatch(entry.request_payload_hash, /^[0-9a-f]{64}$/);
});

Deno.test("writeReconLog swallows errors and does not throw", async () => {
  const stubClient = {
    from: (_: string) => ({
      insert: (_: unknown) => Promise.resolve({ error: { message: "db down" } }),
    }),
  };
  await writeReconLog(stubClient, {
    integration_name: "dmvic",
    operation_type: "issue_certificate",
    idempotency_key: "idem-001",
    request_payload_hash: "abc",
    response_status: "error",
    response_body: null,
    latency_ms: 0,
  });
});
