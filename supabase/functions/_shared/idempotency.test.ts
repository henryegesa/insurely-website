// supabase/functions/_shared/idempotency.test.ts
import { assertEquals, assertNotEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { generateIdempotencyKey, scopedKey } from "./idempotency.ts";

Deno.test("generateIdempotencyKey returns a UUID-format string", () => {
  const key = generateIdempotencyKey();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  assertEquals(uuidRegex.test(key), true);
});

Deno.test("generateIdempotencyKey returns unique values each call", () => {
  const k1 = generateIdempotencyKey();
  const k2 = generateIdempotencyKey();
  assertNotEquals(k1, k2);
});

Deno.test("scopedKey prefixes the key with the scope", () => {
  const key = scopedKey("policy", "pay-ref-123");
  assertEquals(key.startsWith("policy:"), true);
  assertEquals(key.includes("pay-ref-123"), true);
});

Deno.test("scopedKey is deterministic for the same inputs", () => {
  const k1 = scopedKey("certificate", "pay-ref-abc");
  const k2 = scopedKey("certificate", "pay-ref-abc");
  assertEquals(k1, k2);
});
