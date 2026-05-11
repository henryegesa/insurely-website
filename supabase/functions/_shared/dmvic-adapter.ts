// supabase/functions/_shared/dmvic-adapter.ts
import type { IssueCertificateRequest, IssueCertificateResponse } from "./types.ts";

export interface DmvicAdapter {
  issueCertificate(req: IssueCertificateRequest): Promise<IssueCertificateResponse>;
}

export class DmvicStub implements DmvicAdapter {
  private readonly store = new Map<string, IssueCertificateResponse>();

  async issueCertificate(req: IssueCertificateRequest): Promise<IssueCertificateResponse> {
    if (this.store.has(req.idempotency_key)) {
      return this.store.get(req.idempotency_key)!;
    }
    await new Promise((r) => setTimeout(r, 300));
    const certNumber = `DMVIC-${req.vehicle_registration.replace(/\s/g, "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const response: IssueCertificateResponse = {
      certificate_number: certNumber,
      issued_at: new Date().toISOString(),
      download_url: `https://dmvic-stub.insurely.co.ke/certificates/${certNumber}.pdf`,
    };
    this.store.set(req.idempotency_key, response);
    return response;
  }
}
