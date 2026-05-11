// supabase/functions/process-certificate-queue/index.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { shouldRetry, computeNextAttemptAt } from "./index.ts";

Deno.test("shouldRetry returns true for attempts < 5", () => {
  assertEquals(shouldRetry(0), true);
  assertEquals(shouldRetry(4), true);
});

Deno.test("shouldRetry returns false at 5 attempts", () => {
  assertEquals(shouldRetry(5), false);
});

Deno.test("computeNextAttemptAt returns a date 60 seconds in the future", () => {
  const before = Date.now();
  const next = computeNextAttemptAt();
  const after = Date.now();
  const nextMs = new Date(next).getTime();
  assertEquals(nextMs >= before + 60_000, true);
  assertEquals(nextMs <= after + 61_000, true);
});
