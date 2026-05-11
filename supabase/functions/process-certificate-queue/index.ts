// supabase/functions/process-certificate-queue/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { issueCertificateForPayment } from "../issue-certificate/index.ts";

const MAX_ATTEMPTS = 5;

export function shouldRetry(attempts: number): boolean {
  return attempts < MAX_ATTEMPTS;
}

export function computeNextAttemptAt(): string {
  return new Date(Date.now() + 60_000).toISOString();
}

// deno-lint-ignore no-explicit-any
export async function processNextQueueEntry(supabase: any): Promise<{ ok: boolean; processed: number; failed?: number }> {
  // Atomically claim one pending entry using FOR UPDATE SKIP LOCKED — prevents
  // concurrent invocations from processing the same row (Fix 1).
  const { data: entries } = await supabase.rpc("claim_next_certificate_queue_entry");
  const entry = entries?.[0];
  if (!entry) return { ok: true, processed: 0 };

  const requestId = crypto.randomUUID();
  const result = await issueCertificateForPayment(supabase, entry.payment_id, requestId);

  if (result.success) {
    await supabase
      .from("certificate_queue")
      .update({ status: "completed" })
      .eq("id", entry.id);
    return { ok: true, processed: 1 };
  } else {
    const newAttempts = entry.attempts + 1;
    if (!shouldRetry(newAttempts)) {
      await supabase
        .from("certificate_queue")
        .update({
          status: "failed",
          attempts: newAttempts,
          error_detail: result.error ?? "Unknown error",
        })
        .eq("id", entry.id);
      console.error(`Certificate queue entry ${entry.id} exhausted retries:`, result.error);
      return { ok: true, processed: 0, failed: 1 };
    } else {
      await supabase
        .from("certificate_queue")
        .update({
          status: "pending",
          attempts: newAttempts,
          next_attempt_at: computeNextAttemptAt(),
          error_detail: result.error ?? null,
        })
        .eq("id", entry.id);
      return { ok: true, processed: 0 };
    }
  }
}

if (import.meta.main) Deno.serve(async (_req: Request) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const result = await processNextQueueEntry(supabase);
  return new Response(JSON.stringify(result), { status: 200 });
});
