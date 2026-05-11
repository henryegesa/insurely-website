// supabase/functions/_shared/audit.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { buildAuditEvent } from "./audit.ts";

Deno.test("buildAuditEvent includes all 13 required R10 fields", () => {
  const input = {
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
  const event = buildAuditEvent(input);
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
