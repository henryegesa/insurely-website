# Production Deployment Checklist — Certificate Issuance Pipeline

**Feature:** Regulated certificate issuance workflow with idempotency, audit, reconciliation, and queue safety  
**PR:** #1 — merged 2026-05-11  
**Branch:** feat/certificate-issuance-pipeline  
**Status:** NOT PRODUCTION-READY — do not deploy until all items below are checked

---

## 1. Migration Gate

- [ ] Apply `supabase/migrations/20260510000001_certificate_issuance.sql` to hosted Supabase project
- [ ] Verify all 6 tables created: `payments`, `policies`, `certificates`, `audit_events`, `reconciliation_logs`, `certificate_queue`
- [ ] Verify `claim_next_certificate_queue_entry()` function exists in hosted Supabase:
  ```sql
  SELECT routine_name FROM information_schema.routines
  WHERE routine_name = 'claim_next_certificate_queue_entry';
  ```
- [ ] Verify RPC return shape: function must return `setof certificate_queue` (id, payment_id, idempotency_key, status, attempts, last_attempted_at, next_attempt_at, error_detail, created_at)
- [ ] Verify `audit_events_no_update` and `audit_events_no_delete` rules exist on `audit_events`
- [ ] Verify all indexes created (confirm with `\d payments`, `\d audit_events`, etc.)

---

## 2. Environment Gate

- [ ] `SUPABASE_URL` — hosted project URL set in Edge Function secrets
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — service role key set (not anon key)
- [ ] `RESEND_API_KEY` — Resend API key for `hello@insurely.co.ke` sender domain
- [ ] Insurer adapter sandbox credentials configured (insurer-specific env vars)
- [ ] DMVIC sandbox credentials configured (DMVIC stub endpoint or real sandbox)
- [ ] Payment processor webhook secret configured for signature verification

---

## 3. Payment Webhook Gate

- [ ] `quote_id` is required in every webhook payload — missing `quote_id` returns HTTP 400 before any DB write
- [ ] `quote_id` is a valid UUID string — invalid format must be rejected
- [ ] Only `confirmed` and `failed` statuses are accepted — all other values rejected
- [ ] Duplicate `payment_reference` webhook is idempotent — second call returns 200 without creating a second payment row
- [ ] `ip_address` is NOT included in audit `after_state` (PII minimization)

---

## 4. Certificate Issuance Gate

- [ ] Insurer adapter sandbox response verified — response includes `insurer_ira_license` field
- [ ] `insurer_ira_license` present in `insurer_response` JSONB on the policy row before DMVIC call proceeds
- [ ] If `insurer_ira_license` is absent, issuance halts with `certificate_failed` audit event and reconciliation log entry — no DMVIC call is made
- [ ] DMVIC sandbox response verified — response includes `certificate_number`, `issued_at`, `download_url`
- [ ] Same `payment_id` cannot issue a duplicate certificate — second attempt returns existing certificate record
- [ ] Queue processor claims rows atomically via `claim_next_certificate_queue_entry()` RPC — concurrent invocations cannot claim the same row

---

## 5. Email Delivery Gate

- [ ] Resend sandbox/test email delivery verified for a real customer email address
- [ ] Email delivery failure does NOT fail certificate issuance — `issue-certificate` returns `{ success: true }` regardless of email outcome
- [ ] Email delivery failure is observable: failure written to `reconciliation_logs` with `response_status: 'error'` and `integration_name: 'resend'`
- [ ] Manual resend path documented: re-invoke `send-certificate-email` Edge Function with `certificate_id`, `customer_id`, `download_url`, `certificate_number`
- [ ] HTML email template uses escaped values for all customer/certificate fields (`escapeHtml` applied)

---

## 6. Audit and Reconciliation Gate

- [ ] Payment confirmed: `payment_confirmed` event logged in `audit_events`
- [ ] Payment failed: `payment_failed` event logged in `audit_events`
- [ ] Policy created: `policy_created` event logged in `audit_events`
- [ ] Policy failed: `policy_failed` event logged in `audit_events`
- [ ] Certificate issued: `certificate_issued` event logged in `audit_events`
- [ ] Certificate failed: `certificate_failed` event logged in `audit_events`
- [ ] Certificate email sent: `certificate_email_sent` event logged in `audit_events`
- [ ] Insurer API request/response logged in `reconciliation_logs` (`integration_name: 'insurer'`)
- [ ] DMVIC API request/response logged in `reconciliation_logs` (`integration_name: 'dmvic'`)
- [ ] Email delivery attempt logged in `reconciliation_logs` (`integration_name: 'resend'`)
- [ ] Confirm `audit_events` rows cannot be updated or deleted (rules enforced)

---

## 7. Final Sandbox End-to-End Test

Run the following flow in the sandbox environment. All steps must pass before production deployment is approved.

- [ ] Quote created — verify quote record exists and quote ID is valid
- [ ] Payment confirmed — POST to `payment-webhook` with `status: confirmed`; verify payment row created with `status: confirmed`
- [ ] Policy created — verify policy row created with `status: active`; verify `insurer_ira_license` present in `insurer_response`
- [ ] Certificate queued — verify `certificate_queue` row created with `status: pending`
- [ ] Certificate issued — run queue processor; verify `certificates` row created; verify queue row updated to `status: completed`
- [ ] Email sent — verify customer receives certificate email with download link
- [ ] Duplicate webhook — POST same `payment_reference` again; verify no duplicate payment or certificate row created
- [ ] Failed provider path — simulate insurer or DMVIC returning error; verify queue entry retries; verify `certificate_failed` audit event; verify reconciliation log entry; verify degraded state (no silent failure)

---

## Approval

**Do not mark production-ready until all checklist items above are checked.**

| Reviewer | Date | Sign-off |
|---|---|---|
| | | |

