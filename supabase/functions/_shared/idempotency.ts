// supabase/functions/_shared/idempotency.ts

export function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}

export function scopedKey(scope: "policy" | "certificate" | "email", paymentReference: string): string {
  return `${scope}:${paymentReference}`;
}
