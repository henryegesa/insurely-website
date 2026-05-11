// supabase/functions/_shared/audit.ts
import type { AuditEventInput } from "./types.ts";

export interface AuditEventRecord extends AuditEventInput {
  occurred_at: string;
}

export function buildAuditEvent(input: AuditEventInput): AuditEventRecord {
  return {
    ...input,
    occurred_at: new Date().toISOString(),
  };
}

export async function writeAuditEvent(
  supabase: { from: (t: string) => { insert: (r: unknown) => Promise<{ error: unknown }> } },
  input: AuditEventInput,
): Promise<void> {
  const record = buildAuditEvent(input);
  const { error } = await supabase.from("audit_events").insert(record);
  if (error) {
    throw new Error(`Audit write failed: ${JSON.stringify(error)}`);
  }
}
