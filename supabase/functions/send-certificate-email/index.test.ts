// supabase/functions/send-certificate-email/index.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { buildCertificateEmailHtml } from "./index.ts";

Deno.test("buildCertificateEmailHtml includes certificate number", () => {
  const html = buildCertificateEmailHtml({
    customerName: "John Kamau",
    certificateNumber: "DMVIC-KDA001A-ABC123",
    vehicleRegistration: "KDA 001A",
    coverStartDate: "2026-06-01",
    coverEndDate: "2027-05-31",
    downloadUrl: "https://dmvic-stub.insurely.co.ke/certificates/DMVIC-KDA001A-ABC123.pdf",
  });
  assertEquals(html.includes("DMVIC-KDA001A-ABC123"), true);
  assertEquals(html.includes("John Kamau"), true);
  assertEquals(html.includes("KDA 001A"), true);
  assertEquals(html.includes("https://dmvic-stub.insurely.co.ke"), true);
});
