import { useBreakpoint } from "../hooks/useBreakpoint";

const privacySections = [
  { num: "01", title: "Who we are", body: "Insurely is a digital insurance distribution platform operated in Kenya. We connect you with IRA-licensed insurers and facilitate premium payments via M-Pesa and Airtel Money. Our registered address is Nairobi, Kenya. You can reach us at hello@insurely.co.ke." },
  { num: "02", title: "What data we collect", body: "We collect your email address when you join the waitlist. At launch, we'll also collect vehicle registration details (sourced from your input and NTSA), your mobile number for payment processing, and basic identity information required by IRA regulations." },
  { num: "03", title: "How we use your data", body: "We use your data to: process insurance quotes and policies, send your certificate of insurance, communicate product updates and your waitlist status, comply with IRA licensing requirements, and improve our platform. We do not sell your data to third parties." },
  { num: "04", title: "Payment data", body: "Insurely does not store your M-Pesa PIN or Airtel Money credentials. Payment transactions are processed through Safaricom's and Airtel's secure infrastructure. We store only the transaction reference and amount for policy records." },
  { num: "05", title: "Data sharing", body: "We share your data only with: the insurer you choose (required to issue your policy), Safaricom and Airtel (for payment processing), and the Insurance Regulatory Authority of Kenya (as required by law). We use no advertising networks." },
  { num: "06", title: "Data retention", body: "Waitlist email addresses are retained until you unsubscribe or request deletion. Policy data is retained for the duration required by IRA regulations (currently 7 years from policy expiry)." },
  { num: "07", title: "Your rights", body: "You have the right to access, correct, or delete your personal data. To exercise these rights, email hello@insurely.co.ke. We will respond within 30 days. You may also unsubscribe from waitlist communications at any time using the link in any email we send." },
  { num: "08", title: "Cookies and tracking", body: "We use minimal, privacy-respecting analytics to understand how visitors use our site. We do not use advertising cookies or cross-site tracking. You can disable cookies in your browser settings without affecting core site functionality." },
  { num: "09", title: "Changes to this policy", body: "We may update this Privacy Policy from time to time. We will notify waitlist members of material changes by email. Continued use of our platform after changes constitutes acceptance of the updated policy." },
];

const termsSections = [
  { num: "01", title: "Acceptance of terms", body: "By accessing or using Insurely's platform (including joining the waitlist), you agree to these Terms of Service. If you do not agree, please do not use our platform." },
  { num: "02", title: "Nature of our service", body: "Insurely is an insurance distribution platform, not an insurer. We facilitate the purchase of insurance products from IRA-licensed underwriters. Your insurance contract is between you and the insurer — not Insurely." },
  { num: "03", title: "Waitlist", body: "Joining the waitlist does not guarantee access to the platform at launch, constitute a binding insurance contract, or entitle you to any specific pricing. We reserve the right to modify waitlist terms at any time." },
  { num: "04", title: "Eligibility", body: "You must be at least 18 years old and a resident of Kenya to use Insurely. You must have a valid Kenyan driving licence and a vehicle registered with NTSA to purchase motor insurance through our platform." },
  { num: "05", title: "Accuracy of information", body: "You agree to provide accurate, complete, and current information when using our platform. Providing false information may void your insurance policy and may constitute insurance fraud under Kenyan law." },
  { num: "06", title: "Payments", body: "Premium payments are final and non-refundable once processed, except where the insurer's cooling-off period applies. Insurely does not hold insurance premiums — all payments go directly to the insurer via M-Pesa or Airtel Money." },
  { num: "07", title: "Limitation of liability", body: "Insurely's liability to you is limited to the fees paid to us (if any). We are not liable for insurer insolvency, claim disputes, or losses arising from your use of our platform beyond our direct control." },
  { num: "08", title: "Intellectual property", body: "All content, trademarks, and software on our platform are owned by or licensed to Insurely. You may not copy, modify, or distribute our content without written permission." },
  { num: "09", title: "Governing law", body: "These Terms are governed by the laws of Kenya. Any disputes shall be subject to the exclusive jurisdiction of the courts of Nairobi, Kenya." },
  { num: "10", title: "Contact", body: "For any questions about these Terms, contact us at hello@insurely.co.ke or write to our registered address in Nairobi, Kenya." },
];

function LegalLayout({ eyebrow, title, italic, sections }) {
  const { isMobile } = useBreakpoint();

  return (
    <div style={{ background: "#0a0907", minHeight: "100vh", paddingTop: 72 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: isMobile ? "60px 24px 80px" : "80px 48px 100px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>LEGAL</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 48 : 72, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.1, marginBottom: 16 }}>
          {title}{" "}
          <em style={{ color: "#c9a55c", fontStyle: "italic" }}>{italic}</em>
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#7a7261", marginBottom: 60 }}>
          Last updated: May 2026 · Insurely · Nairobi, Kenya
        </p>

        <div style={{ borderTop: "1px solid #2a2218" }}>
          {sections.map((s) => (
            <div
              key={s.num}
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "120px 1fr",
                gap: isMobile ? 12 : 48,
                padding: "40px 0",
                borderBottom: "1px solid #2a2218",
              }}
            >
              <div>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 48 : 72, color: "#2a2218", fontWeight: 400, lineHeight: 1 }}>
                  {s.num}
                </span>
              </div>
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: "#f5f1e8", marginBottom: 16, lineHeight: 1.2 }}>
                  {s.title}
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#b8b1a3", lineHeight: 1.75 }}>
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="LEGAL"
      title="Privacy"
      italic="Policy."
      sections={privacySections}
    />
  );
}

export function TermsPage() {
  return (
    <LegalLayout
      eyebrow="LEGAL"
      title="Terms of"
      italic="Service."
      sections={termsSections}
    />
  );
}
