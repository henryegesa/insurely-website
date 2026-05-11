// supabase/functions/_shared/insurer-adapter.ts
import type { CreatePolicyRequest, CreatePolicyResponse } from "./types.ts";

export interface InsurerAdapter {
  createPolicy(req: CreatePolicyRequest): Promise<CreatePolicyResponse>;
}

export class InsurerStub implements InsurerAdapter {
  private readonly store = new Map<string, CreatePolicyResponse>();

  async createPolicy(req: CreatePolicyRequest): Promise<CreatePolicyResponse> {
    if (this.store.has(req.idempotency_key)) {
      return this.store.get(req.idempotency_key)!;
    }
    await new Promise((r) => setTimeout(r, 200));
    const response: CreatePolicyResponse = {
      policy_reference: `POL-STUB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      insurer_id: "INSURER-STUB-001",
      insurer_ira_license: "IRA/STUB/2026/001",
      status: "active",
      issued_at: new Date().toISOString(),
    };
    this.store.set(req.idempotency_key, response);
    return response;
  }
}
