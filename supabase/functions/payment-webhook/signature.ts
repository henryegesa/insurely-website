// supabase/functions/payment-webhook/signature.ts
// HMAC-SHA256 webhook signature verification (R4, R6).
//
// Expected header: X-Webhook-Signature: sha256=<lowercase-hex>
// HMAC is computed over the raw request body bytes before any JSON parsing.
// crypto.subtle.verify is used for constant-time comparison.

export const SIGNATURE_HEADER = "x-webhook-signature";

export interface SignatureVerificationResult {
  valid: boolean;
  /** Safe-to-log reason string — contains no secret, payload, or PII. */
  error?: string;
  /** HTTP status to return when valid is false. */
  statusCode?: 401 | 500;
}

function hexToBytes(hex: string): Uint8Array | null {
  if (hex.length === 0 || hex.length % 2 !== 0) return null;
  if (!/^[0-9a-f]+$/.test(hex)) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Verify the HMAC-SHA256 signature of a raw webhook body.
 *
 * @param rawBody   Raw request body bytes — must be read before JSON.parse.
 * @param header    Value of the X-Webhook-Signature header (may be null).
 * @param secret    Value of PAYMENT_WEBHOOK_SECRET env var (may be null/empty).
 */
export async function verifyWebhookSignature(
  rawBody: Uint8Array,
  header: string | null,
  secret: string | null | undefined,
): Promise<SignatureVerificationResult> {
  if (!secret) {
    return {
      valid: false,
      error: "PAYMENT_WEBHOOK_SECRET not configured",
      statusCode: 500,
    };
  }

  if (!header) {
    return {
      valid: false,
      error: "X-Webhook-Signature header missing",
      statusCode: 401,
    };
  }

  // Accept "sha256=<hex>" — strip the prefix if present.
  const hexPart = header.startsWith("sha256=") ? header.slice(7) : header;
  const expectedBytes = hexToBytes(hexPart.toLowerCase());
  if (!expectedBytes || expectedBytes.length === 0) {
    return {
      valid: false,
      error: "X-Webhook-Signature header malformed",
      statusCode: 401,
    };
  }

  let key: CryptoKey;
  try {
    key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
  } catch {
    return {
      valid: false,
      error: "Failed to import HMAC key — PAYMENT_WEBHOOK_SECRET may be malformed",
      statusCode: 500,
    };
  }

  // crypto.subtle.verify with HMAC is constant-time by the Web Crypto spec.
  const valid = await crypto.subtle.verify("HMAC", key, expectedBytes, rawBody);

  if (!valid) {
    return {
      valid: false,
      error: "Signature mismatch",
      statusCode: 401,
    };
  }

  return { valid: true };
}
