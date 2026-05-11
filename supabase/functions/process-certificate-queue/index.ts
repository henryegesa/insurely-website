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

if (import.meta.main) Deno.serve(async (_req: Request) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: entries, error } = await supabase
    .from("certificate_queue")
    .select("*")
    .eq("status", "pending")
    .lte("next_attempt_at", new Date().toISOString())
    .order("created_at", { ascending: true })
    .limit(20);

  if (error || !entries?.length) {
    return new Response(JSON.stringify({ processed: 0 }), { status: 200 });
  }

  let processed = 0;
  let failed = 0;

  for (const entry of entries) {
    await supabase
      .from("certificate_queue")
      .update({ status: "processing", last_attempted_at: new Date().toISOString() })
      .eq("id", entry.id);

    const requestId = crypto.randomUUID();
    const result = await issueCertificateForPayment(supabase, entry.payment_id, requestId);

    if (result.success) {
      await supabase
        .from("certificate_queue")
        .update({ status: "completed" })
        .eq("id", entry.id);
      processed++;
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
        failed++;
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
      }
    }
  }

  return new Response(JSON.stringify({ processed, failed }), { status: 200 });
});
