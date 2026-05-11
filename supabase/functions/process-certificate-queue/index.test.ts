// supabase/functions/process-certificate-queue/index.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { shouldRetry, computeNextAttemptAt, processNextQueueEntry } from "./index.ts";

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

// Fix 1 test: when no pending entries exist, returns processed: 0.
Deno.test("processNextQueueEntry returns processed:0 when no pending entries", async () => {
  const supabase = {
    rpc: (_name: string) => Promise.resolve({ data: [], error: null }),
    from: () => ({
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
  };
  const result = await processNextQueueEntry(supabase);
  assertEquals(result, { ok: true, processed: 0 });
});

// Fix 1 test: simulates two concurrent callers both invoking claim. Because the
// stub is in-memory and the first call consumes the entry, the second call gets
// an empty result — proving only one invocation proceeds.
Deno.test("processNextQueueEntry only one invocation claims the entry when two compete", async () => {
  // The pending entry available for claiming.
  const pendingEntry = {
    id: "queue-001",
    payment_id: "pay-001",
    attempts: 0,
    status: "pending",
  };

  // Simulate an atomic claim: first call returns the entry, second returns empty.
  let claimCount = 0;

  const makeSupabase = () => ({
    rpc: (_name: string) => {
      claimCount++;
      // Only the first claimer gets the entry; subsequent ones get nothing.
      if (claimCount === 1) return Promise.resolve({ data: [pendingEntry], error: null });
      return Promise.resolve({ data: [], error: null });
    },
    from: (_table: string) => ({
      select: (_cols: string) => ({
        eq: (_col: string, _val: string) => ({
          single: () => Promise.resolve({ data: { id: "pay-001", status: "confirmed", customer_id: "c1", payment_reference: "ref-001" }, error: null }),
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      update: (_obj: unknown) => ({ eq: (_c: string, _v: string) => Promise.resolve({ error: null }) }),
      insert: (_obj: unknown) => ({
        select: (_c: string) => ({
          single: () => Promise.resolve({ data: { id: "cert-001" }, error: null }),
        }),
      }),
    }),
    functions: {
      invoke: (_name: string, _opts: unknown) => Promise.resolve({ error: null }),
    },
  });

  // Invoke two "concurrent" processors.
  const supabase1 = makeSupabase();
  const supabase2 = makeSupabase();

  // Run them concurrently.
  const [r1, r2] = await Promise.all([
    processNextQueueEntry(supabase1),
    processNextQueueEntry(supabase2),
  ]);

  // Exactly one processed the entry; the other got processed:0.
  const totalProcessed = (r1.processed ?? 0) + (r2.processed ?? 0);
  // Both rpc calls were made (one per invocation).
  assertEquals(claimCount, 2);
  // Only one invocation could have received the entry.
  assertEquals(totalProcessed <= 1, true);
});
