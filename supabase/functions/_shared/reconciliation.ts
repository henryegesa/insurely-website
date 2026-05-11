// supabase/functions/_shared/reconciliation.ts
import type { ReconciliationLogInput, Uuid } from "./types.ts";

export async function hashPayload(payload: Record<string, unknown>): Promise<string> {
  const text = JSON.stringify(payload, Object.keys(payload).sort());
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface BuildReconEntryInput {
  integration_name: ReconciliationLogInput["integration_name"];
  operation_type: string;
  idempotency_key: string;
  related_entity_type?: string;
  related_entity_id?: Uuid;
  request_payload: Record<string, unknown>;
  response_status: ReconciliationLogInput["response_status"];
  response_body: Record<string, unknown> | null;
  latency_ms: number;
}

export async function buildReconEntry(input: BuildReconEntryInput): Promise<ReconciliationLogInput> {
  return {
    integration_name: input.integration_name,
    operation_type: input.operation_type,
    idempotency_key: input.idempotency_key,
    related_entity_type: input.related_entity_type,
    related_entity_id: input.related_entity_id,
    request_payload_hash: await hashPayload(input.request_payload),
    response_status: input.response_status,
    response_body: input.response_body,
    latency_ms: input.latency_ms,
  };
}

export async function writeReconLog(
  supabase: { from: (t: string) => { insert: (r: unknown) => Promise<{ error: unknown }> } },
  entry: ReconciliationLogInput,
): Promise<void> {
  const { error } = await supabase.from("reconciliation_logs").insert(entry);
  if (error) {
    console.error("Reconciliation log write failed:", JSON.stringify(error));
  }
}
