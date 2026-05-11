# Insurely Constitution

**Version:** 1.0  
**Effective:** 2026-05-10  
**Owner:** Insurely Engineering & Product

---

## Purpose

This constitution defines the non-negotiable rules governing how Insurely is designed, built, integrated, tested, and operated. It applies to every engineer, product manager, designer, and contractor working on the platform.

Insurely is a regulated insurance technology platform. It handles premium collection, policy issuance, certificate generation, identity verification, and payment processing — all within the jurisdiction of the Insurance Regulatory Authority (IRA) of Kenya. The cost of a silent failure, an unlogged transaction, or an unauthorized certificate is not a bug; it is a compliance breach.

Rules in this constitution may not be overridden by sprint pressure, scope shortcuts, or individual judgement. They may only be amended through a formal review with documented rationale.

---

## Part I — Regulatory Compliance

### R1. Regulatory-First Development

Every product, data, API, and workflow decision must be evaluated against IRA licensing requirements, the Insurance Act (Cap. 487), and applicable data protection law (Kenya Data Protection Act 2019) before implementation begins.

- No feature that touches policy issuance, premium collection, certificate generation, or claims handling may be designed without first identifying the applicable regulatory obligation.
- If regulatory requirements are unclear, escalate to a compliance review before proceeding.
- Regulatory requirements belong in the **spec**, not discovered during implementation.

### R2. Licensing Boundaries

Insurely must not perform licensed insurance activities it is not authorized to perform. Specifically:

- Insurely may act as an intermediary (agent or broker) only within the scope of its IRA license.
- Insurely must not underwrite risk, set premium rates, or accept risk on its own account.
- Certificate issuance must be attributed to the licensed underwriter, not Insurely.

### R3. Customer Consent

No personal data may be collected, processed, or shared beyond what the customer explicitly consented to at the point of collection. Consent records must be stored with a timestamp, the consent version presented, and the channel through which it was obtained.

---

## Part II — Financial and Certificate Integrity

### R4. No Silent Money Movement

No premium collection, refund, reversal, or disbursement may execute without:

1. Explicit customer-initiated action (button press, API call with authenticated session).
2. A validated, idempotent transaction state before and after the operation.
3. A logged authorization record including: user ID, session ID, amount, currency, payment reference, timestamp, and system state.

Scheduled or automated payment retries must be explicitly disclosed to the customer at enrollment and must honor a customer-revocable mandate.

### R5. No Silent Certificate Issuance

No insurance certificate (IRA-format sticker, cover note, or policy schedule) may be generated, transmitted, or marked as issued without:

1. Confirmed premium receipt from the payment processor (not just a payment intent).
2. A validated response from the insurer's system confirming policy creation.
3. A logged certificate record including: policy reference, certificate number, insurer ID, vehicle registration, cover dates, premium paid, customer ID, issuance timestamp, and issuing system.

Certificate generation must be idempotent: the same payment reference must never produce two distinct certificates.

### R6. Idempotency Keys Required

All financial operations (payment initiation, refund, reconciliation) and all certificate operations (request, issuance, cancellation) must carry an idempotency key. The key must be:

- Generated server-side before the external call.
- Stored with the pending operation record.
- Checked before re-attempting any operation to prevent duplicate execution.

---

## Part III — Integration Safety

### R7. Typed Integration Contracts

Every third-party integration — insurers, DMVIC, payment processors (M-Pesa, card gateways), identity providers, SMS/email providers — must have:

- A typed request and response schema (TypeScript types or equivalent).
- Documented error codes and their handling behavior.
- A circuit breaker or timeout policy.
- A retry policy with exponential backoff and a max attempt limit.
- A reconciliation log entry for every call: request payload hash, response status, latency, timestamp, idempotency key.

No integration may call an external system without all of the above in place.

### R8. Reconciliation Logs

Every material call to an external system must produce a reconciliation log entry regardless of success or failure. Logs must be queryable by: date range, integration name, operation type, status, idempotency key, and related entity ID (policy, payment, certificate).

Reconciliation logs are append-only. They must not be deleted or mutated after creation.

### R9. Degraded-State Behavior

Every integration must define its degraded-state behavior explicitly:

- What happens when the insurer API is unreachable? (Queue, fail-open, fail-closed?)
- What happens when DMVIC is unavailable? (Block certificate or queue for async issuance?)
- What happens when the payment callback is delayed? (Hold certificate pending confirmation.)

Degraded-state behavior must be defined in the **spec** before implementation begins.

---

## Part IV — Auditability

### R10. Audit Trail for Material Events

Every material insurance event must produce an immutable audit record containing:

| Field | Required |
|---|---|
| Event type | Yes |
| Actor (user ID or system) | Yes |
| Customer ID | Yes |
| Timestamp (UTC, ISO 8601) | Yes |
| Session or request ID | Yes |
| Entity type and ID (policy, quote, certificate, payment) | Yes |
| Before state (serialized) | Yes |
| After state (serialized) | Yes |
| System version | Yes |
| IP address (for human-initiated events) | Yes |

Material events include: quote generated, quote accepted, payment initiated, payment confirmed, payment failed, certificate requested, certificate issued, certificate cancelled, policy endorsed, policy cancelled, refund initiated, refund confirmed, customer data updated, consent recorded, role changed, maker-checker approval/rejection.

### R11. Audit Logs Are Immutable

Audit logs must not be updated or deleted after creation. Corrections are recorded as new events referencing the original. Log storage must be separate from the operational database and must have retention of at least seven years (IRA requirement).

---

## Part V — Data Privacy

### R12. Data Minimization

Collect only the data required for underwriting, certificate issuance, payment, compliance, and customer support. For each data field collected, there must be a documented purpose. Fields without a documented purpose must not be stored.

### R13. Sensitive Data Handling

The following data classes are sensitive and must be encrypted at rest and in transit, with access logged:

- National ID / Passport number
- KRA PIN
- Vehicle identification numbers linked to an individual
- Payment card data (must not be stored — use tokenization)
- M-Pesa account identifiers
- Premium and claims amounts linked to an individual
- Medical or loss history

### R14. Data Retention and Deletion

Retention periods must be defined per data class. Data past its retention period must be purged or anonymized automatically. Customer deletion requests must be honored within the bounds of regulatory retention obligations (seven years for financial records).

---

## Part VI — Access Control

### R15. Role-Based Access Control

All internal tooling, admin interfaces, and API operations must enforce role-based access. Roles must be the minimum required for the job function. No wildcard or superadmin roles in production except for a break-glass account with mandatory alerting on use.

Defined role categories:

- **Customer** — self-service only, own data only.
- **Agent/Broker** — customer data scoped to their portfolio, no financial overrides.
- **Operations** — read access to policies and payments, limited write (status updates only).
- **Finance** — read access to payments and reconciliation, refund initiation (subject to maker-checker).
- **Engineering** — no production data access by default; access granted per incident with audit log.
- **Compliance** — read-only access to audit logs and reports.
- **Admin** — full access with maker-checker enforcement on destructive operations.

### R16. Maker-Checker for Sensitive Operations

The following operations require a second authorized actor to approve before execution:

- Refunds above KES 10,000
- Manual policy cancellations
- Manual certificate reissuance
- Role escalations
- Production database writes by engineering during incidents
- Bulk data exports
- Integration credential rotation

Maker and checker must be different individuals. Approval must be logged with the approver's identity and timestamp.

---

## Part VII — Testing

### R17. Mandatory Test Coverage Before Release

No production release is permitted without:

- **Unit tests** for all core business logic: premium calculation, eligibility rules, certificate validation, idempotency key generation.
- **Integration tests** for all external API calls: insurer APIs, DMVIC, payment processors, SMS/email providers. Tests must cover success, timeout, and error-response paths.
- **Authorization tests** verifying that each API endpoint enforces its role requirements and rejects unauthorized access.
- **Regression tests** covering the end-to-end quote-to-certificate flow: quote → payment → certificate issuance → audit log entry.

### R18. Staging Environment Parity

All releases must pass testing in a staging environment that mirrors production configuration, including integration endpoints (use sandbox/test credentials, not mocked responses). Mocked external calls are acceptable for unit tests only — not for integration or regression tests.

### R19. No Untested Financial or Certificate Logic in Production

Any code path that touches premium calculation, payment state transitions, or certificate generation must have a test that covers it before it ships. This is a hard gate, not a recommendation.

---

## Part VIII — Specification Process

### R20. Spec-Plan-Task Separation

All work on Insurely follows a three-layer separation:

| Layer | Produced by | Defines | Must NOT contain |
|---|---|---|---|
| **Spec** | Product / Compliance | What the feature does and why it is needed. Business rules, regulatory obligations, user flows, acceptance criteria, consent requirements. | Technical implementation details, database schemas, API signatures. |
| **Plan** | Engineering | How the feature will be implemented technically. Architecture decisions, database schema, API contracts, integration design, idempotency strategy, error handling design, test strategy. | Business justification, marketing copy, user-facing language. |
| **Task** | Engineering | Concrete execution steps. File changes, migration scripts, test cases to write, integration credentials to configure. | Architecture decisions (those belong in the plan). |

A spec must be approved before a plan is written. A plan must be approved before tasks are created. Tasks must not reopen spec or plan decisions — changes go back to the appropriate layer.

### R21. Compliance and Regulatory Items Belong in Specs

If a feature has a regulatory obligation — consent capture, IRA reporting, certificate attribution, data retention — that obligation must appear in the spec. It must not be discovered during implementation or added as a task after the plan is written.

### R22. Specs Must Define Degraded-State and Failure Behavior

Every spec that involves an external integration or financial flow must define what the correct behavior is when the integration fails, the payment is delayed, or the certificate cannot be issued. These are not implementation details — they are product decisions.

---

## Part IX — Amendments

This constitution may be amended only through a documented review including:

1. A written rationale for the change.
2. A review by at least one member of Engineering and one member of Compliance.
3. A version increment and effective date.
4. Communication to all active contributors before the effective date.

Amendments that weaken auditability, remove maker-checker controls, or reduce test requirements require explicit IRA compliance review before adoption.

---

*Insurely Constitution v1.0 — governing all product and engineering decisions from 2026-05-10.*
