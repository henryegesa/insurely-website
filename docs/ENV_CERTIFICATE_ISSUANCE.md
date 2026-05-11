# Environment Variables — Certificate Issuance Pipeline

All variables below must be present and correctly valued before any Edge Function in the certificate issuance pipeline can operate. Missing or incorrect values will cause silent failures or hard errors at runtime.

Set these in the Supabase dashboard under **Project Settings → Edge Functions → Secrets**, or via the Supabase CLI:

```bash
supabase secrets set VAR_NAME=value
```

> **Security rule:** Never commit secret values to source control. Never log secret values. If a secret is accidentally exposed, rotate it immediately and audit the reconciliation logs for unexpected calls.

---

## Core Supabase Variables

### `SUPABASE_URL`

| Field | Value |
|---|---|
| **Purpose** | Base URL for the Supabase JS client inside Edge Functions |
| **Required in** | All Edge Functions: `payment-webhook`, `issue-certificate`, `process-certificate-queue`, `send-certificate-email` |
| **Format** | `https://<project-ref>.supabase.co` |
| **Sandbox value** | Your sandbox project URL |
| **Production value** | Your production project URL |
| **Automatically set?** | Yes — Supabase injects this automatically into Edge Functions. Only override if using a custom domain. |
| **Sensitivity** | Low — this is a public URL, not a secret |

---

### `SUPABASE_SERVICE_ROLE_KEY`

| Field | Value |
|---|---|
| **Purpose** | Service role JWT used by Edge Functions to bypass Row Level Security for internal writes (audit events, reconciliation logs, certificate records) |
| **Required in** | All Edge Functions |
| **Format** | JWT string beginning with `eyJ...` |
| **Sandbox value** | Sandbox project service role key (Settings → API) |
| **Production value** | Production project service role key |
| **Automatically set?** | Yes — Supabase injects this automatically into Edge Functions. |
| **Sensitivity** | **CRITICAL** — grants full database access with no RLS restriction. Treat as a root password. Never expose to the browser or client-side code. |

---

## Email Delivery

### `RESEND_API_KEY`

| Field | Value |
|---|---|
| **Purpose** | API key for Resend transactional email service. Used by `send-certificate-email` to deliver the certificate PDF link to the customer. |
| **Required in** | `send-certificate-email` Edge Function |
| **Format** | `re_...` (Resend API key format) |
| **Sandbox value** | Resend test mode key or sandbox key — sends to test addresses only |
| **Production value** | Resend live key scoped to the `insurely.co.ke` sender domain |
| **Where to obtain** | Resend dashboard → API Keys |
| **Sensitivity** | **HIGH** — allows sending email from `hello@insurely.co.ke`. A leaked key enables phishing using the Insurely domain. Rotate immediately if exposed. |
| **Email failure behavior** | If this key is missing or invalid, email delivery fails silently. Certificate issuance succeeds regardless. Failure is recorded in `reconciliation_logs` with `response_status: 'error'` and `integration_name: 'resend'`. |

---

## Insurer Integration

### Insurer Adapter Credentials

The insurer adapter variables are insurer-specific. The names below are placeholders — confirm the exact variable names with the insurer integration team before deployment.

| Variable | Purpose | Required in | Sensitivity |
|---|---|---|---|
| `INSURER_API_URL` | Base URL for the insurer's policy creation API | `issue-certificate` (insurer adapter call) | Low — URL only |
| `INSURER_API_KEY` | API key or bearer token for authenticating calls to the insurer API | `issue-certificate` | **HIGH** — grants ability to create policies on behalf of Insurely. Rotate if exposed. |
| `INSURER_CLIENT_ID` | Client identifier issued by the insurer (if OAuth/client credentials flow) | `issue-certificate` | Medium |
| `INSURER_CLIENT_SECRET` | Client secret for insurer OAuth flow (if applicable) | `issue-certificate` | **HIGH** |

**Sandbox vs production:**
- Use the insurer's sandbox endpoint and sandbox credentials for all pre-production testing.
- The insurer sandbox must return a valid `insurer_ira_license` in its response — this is required for DMVIC issuance to proceed.
- Confirm with the insurer that sandbox responses are realistic (same field shape as production).

---

## DMVIC Integration

### DMVIC Adapter Credentials

| Variable | Purpose | Required in | Sensitivity |
|---|---|---|---|
| `DMVIC_API_URL` | Base URL for the DMVIC certificate issuance API | `issue-certificate` (DMVIC adapter call) | Low — URL only |
| `DMVIC_API_KEY` | API key or bearer token for DMVIC API authentication | `issue-certificate` | **HIGH** — grants ability to issue government-backed motor insurance certificates. Rotate immediately if exposed. |
| `DMVIC_INSURER_CODE` | Insurely's registered code in the DMVIC system (required in every certificate issuance request) | `issue-certificate` | Medium |

**Sandbox vs production:**
- Use the DMVIC sandbox endpoint and test credentials for all pre-production verification.
- Confirm that sandbox `certificate_number` values are clearly marked as test (e.g., prefix `TEST-`) so they cannot be confused with real certificates.
- DMVIC production credentials must not be used outside production. A certificate issued against the live DMVIC system is a legally binding insurance document.

---

## Payment Processor

### Payment Webhook Secret

| Variable | Purpose | Required in | Sensitivity |
|---|---|---|---|
| `PAYMENT_WEBHOOK_SECRET` | HMAC secret or bearer token used to verify that incoming payment webhook payloads are genuinely from the payment processor (M-Pesa, card processor) and have not been tampered with | `payment-webhook` Edge Function (signature verification layer) | **HIGH** — without this, any caller can forge a payment confirmation. |

**Note:** The current `payment-webhook` implementation does not yet include HMAC signature verification code. Before production:
1. Implement signature verification at the top of the handler using this secret.
2. Return HTTP 401 immediately if the signature is absent or invalid.
3. This is a **production blocker** — see Production Blockers section.

---

## Production Blockers Related to Environment Variables

| Blocker | Variable | Status |
|---|---|---|
| HMAC webhook signature verification not yet implemented | `PAYMENT_WEBHOOK_SECRET` | **OPEN** — code change required before production |
| Insurer adapter variable names must be confirmed with insurer integration team | `INSURER_*` | **OPEN** — names are placeholders |
| DMVIC sandbox credentials must be provisioned | `DMVIC_*` | **OPEN** — requires DMVIC onboarding |
| Resend sender domain `insurely.co.ke` must be verified in Resend dashboard | `RESEND_API_KEY` | **OPEN** — requires DNS verification |

---

## Verification Checklist

Before any deployment, confirm all secrets are set:

```bash
supabase secrets list
```

- [ ] `SUPABASE_URL` present (auto-injected — verify project URL matches target environment)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` present (auto-injected — verify it matches target environment)
- [ ] `RESEND_API_KEY` present and scoped to correct Resend account
- [ ] `INSURER_API_URL` present and pointing to correct environment (sandbox vs production)
- [ ] `INSURER_API_KEY` present and valid for target environment
- [ ] `DMVIC_API_URL` present and pointing to correct environment
- [ ] `DMVIC_API_KEY` present and valid for target environment
- [ ] `PAYMENT_WEBHOOK_SECRET` present (once webhook signature verification is implemented)
