# Insurely — Claude Code Instructions

## Active Constitution

The Insurely constitution is the binding governance document for all product and engineering work.

**Canonical path:** `.specify/memory/constitution.md`  
**Mirror (human-readable):** `CONSTITUTION.md` (root level, kept in sync)

Before writing any spec, plan, task, or implementation code, Claude must treat the constitution as binding. Specifically:

- Read `.specify/memory/constitution.md` when starting any work on specs, plans, tasks, or features that touch any of the following: insurance flows, payments, certificates, policy lifecycle, customer data, audit logging, access control, database migrations, or third-party integrations.
- Do not implement any feature that violates the constitution's rules without first flagging the conflict to the user.
- If a user instruction conflicts with the constitution, surface the conflict and ask for explicit override before proceeding.
- When implementing regulated, financial, certificate, or integration features, cite the specific constitution rule(s) being satisfied (e.g., "satisfies R4, R6") in the relevant plan, task, or code comment where non-obvious.
- When writing implementation code for any of the above domains, the constitution must be checked before writing any line of code — not only before writing specs or plans.

## Constitution Amendment Rule

Any amendment to the constitution must update **both** files:

1. `.specify/memory/constitution.md` (canonical)
2. `CONSTITUTION.md` (human-readable mirror)

Both files must be kept identical at all times. A version increment and effective date must be added per the amendment process defined in Part IX of the constitution.

## Constitution Compliance Check (mandatory)

For any implementation involving premiums, policies, certificates, refunds, customer identity, insurer integrations, DMVIC integrations, payment providers, audit logs, RBAC, maker-checker approval, or production deployment, Claude Code must produce a **Constitution Compliance Check** before finalizing the work.

The check must state:

| Field | Required content |
|---|---|
| **Relevant rules** | Which constitution rules apply (e.g., R4, R5, R6, R10) |
| **Compliance status** | Whether the change complies with each relevant rule |
| **Unresolved compliance risk** | Any rule the change does not yet fully satisfy, and what remains to be done |
| **Test and audit evidence** | Which tests were written or which audit log entries are produced that demonstrate compliance |

The check is part of the deliverable — it must appear in the plan, task output, or implementation summary. It must not be omitted on the grounds that the change is small or low-risk.

## Spec-Plan-Task Rules (from Constitution R20)

| Layer | What it defines | What it must NOT contain |
|---|---|---|
| **Spec** | What and why. Business rules, user flows, regulatory obligations, acceptance criteria. | Technical schemas, API signatures, implementation detail. |
| **Plan** | How. Architecture, database schema, API contracts, integration design, test strategy. | Business justification, marketing copy. |
| **Task** | Execution steps. File changes, migrations, test cases, credentials to configure. | Architecture decisions. |

A spec must exist before a plan. A plan must exist before tasks. Do not skip layers.

## Core Principles (summary — full text in constitution)

1. Regulatory-first development (IRA, Insurance Act Cap. 487, Kenya DPA 2019)
2. No silent money movement or certificate issuance
3. Typed integration contracts with retries, idempotency keys, reconciliation logs
4. Immutable audit trail for every material insurance event
5. Data minimization — collect only what is needed and documented
6. Role-based access; maker-checker for sensitive operations
7. Mandatory unit, integration, authorization, and regression tests before every release
8. Spec → Plan → Task separation enforced

## Project Stack

- React 18 + Vite 5 SPA (landing / waitlist)
- Supabase (Postgres + Edge Functions + Auth)
- Resend (transactional email)
- Vercel (hosting)
- canvas-confetti (confirmation page)
