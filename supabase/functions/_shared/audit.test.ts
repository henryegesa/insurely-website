// supabase/functions/_shared/audit.test.ts
import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { buildAuditEvent, writeAuditEvent } from "./audit.ts";

const baseInput = {
  event_type: "certificate_issued" as const,
  actor: "system",
  customer_id: "cust-123" as any,
  request_id: "req-abc",
  entity_type: "certificate",
  entity_id: "cert-456" as any,
  before_state: null,
  after_state: { certificate_number: "DMVIC-001" },
  system_version: "1.0.0",
  ip_address: null,
};

Deno.test("buildAuditEvent passes through all 10 AuditEventInput fields and adds occurred_at", () => {
  const event = buildAuditEvent(baseInput);
  assertEquals(event.event_type, "certificate_issued");
  assertEquals(event.actor, "system");
  assertEquals(event.customer_id, "cust-123");
  assertEquals(event.request_id, "req-abc");
  assertEquals(event.entity_type, "certificate");
  assertEquals(event.entity_id, "cert-456");
  assertEquals(event.before_state, null);
  assertEquals(event.after_state, { certificate_number: "DMVIC-001" });
  assertEquals(event.system_version, "1.0.0");
  assertEquals(event.ip_address, null);
  assertEquals(typeof event.occurred_at, "string");
  assertEquals(isNaN(Date.parse(event.occurred_at)), false);
});

Deno.test("writeAuditEvent resolves without throwing on success", async () => {
  const stubClient = {
    from: (_: string) => ({
      insert: (_: unknown) => Promise.resolve({ error: null }),
    }),
  };
  await writeAuditEvent(stubClient, baseInput);
});

Deno.test("writeAuditEvent throws when supabase returns an error (R11)", async () => {
  const stubClient = {
    from: (_: string) => ({
      insert: (_: unknown) => Promise.resolve({ error: { message: "db down", code: "500" } }),
    }),
  };
  await assertRejects(
    () => writeAuditEvent(stubClient, baseInput),
    Error,
    "Audit write failed",
  );
});
