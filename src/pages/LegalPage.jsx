import { useBreakpoint } from "../hooks/useBreakpoint";

const privacySections = [
  {
    num: "01",
    title: "Who we are",
    body: "Insurely is a licensed insurance agency operating in Kenya. We help customers discover and compare motor insurance through licensed insurance partners. Our registered address is Nairobi, Kenya. You can reach us at hello@insurely.co.ke.",
  },
  {
    num: "02",
    title: "What data we collect",
    body: "Currently, we only collect your email address when you join the waitlist. We use this to send you product updates, launch announcements, and early access invitations. We do not collect payment data, vehicle information, or identity documents at this stage.",
  },
  {
    num: "03",
    title: "How we use your data",
    body: "We use your email address to: send you waitlist updates and early access notifications, inform you about the Insurely product before launch, and communicate any material changes to our service. We do not sell your data to third parties.",
  },
  {
    num: "04",
    title: "Data sharing",
    body: "We do not share your email address with insurers, payment processors, or any third parties at this stage. When the product launches, our privacy policy will be updated to reflect any data sharing required for insurance distribution.",
  },
  {
    num: "05",
    title: "Data retention",
    body: "Waitlist email addresses are retained until you unsubscribe or request deletion. You can unsubscribe at any time using the link in any email we send, or by emailing hello@insurely.co.ke.",
  },
  {
    num: "06",
    title: "Your rights",
    body: "You have the right to access, correct, or delete your personal data. To exercise these rights, email hello@insurely.co.ke. We will respond within 30 days.",
  },
  {
    num: "07",
    title: "Cookies and analytics",
    body: "We use minimal, privacy-respecting analytics to understand how visitors use our site. We do not use advertising cookies or cross-site tracking. You can disable cookies in your browser without affecting core site functionality.",
  },
  {
    num: "08",
    title: "Changes to this policy",
    body: "We may update this Privacy Policy as the product develops. We will notify waitlist members of material changes by email. The current policy applies to waitlist data collection only.",
  },
];

const termsSections = [
  {
    num: "01",
    title: "Acceptance of terms",
    body: "By accessing the Insurely website or joining the waitlist, you agree to these Terms of Service. If you do not agree, please do not use our website.",
  },
  {
    num: "02",
    title: "Nature of our service",
    body: "Insurely is a licensed insurance agency. This website is a pre-launch waitlist and information site. We are not currently selling, binding, or issuing insurance policies through this website. Any insurance products described are planned for future launch and subject to final partner agreements.",
  },
  {
    num: "03",
    title: "Waitlist",
    body: "Joining the waitlist does not guarantee access to the platform at launch, constitute a binding insurance contract, or entitle you to any specific pricing. We reserve the right to modify waitlist terms at any time.",
  },
  {
    num: "04",
    title: "Accuracy of information",
    body: "Cover types, indicative prices, and process descriptions on this website are for informational purposes only. Final premium, terms, and availability will be confirmed at launch in partnership with IRA-licensed insurers.",
  },
  {
    num: "05",
    title: "Limitation of liability",
    body: "Insurely's liability to you in connection with this waitlist website is limited to the information provided herein. We make no guarantee of availability, pricing, or product features at launch.",
  },
  {
    num: "06",
    title: "Intellectual property",
    body: "All content, trademarks, and materials on this website are owned by or licensed to Insurely. You may not copy, modify, or distribute our content without written permission.",
  },
  {
    num: "07",
    title: "Governing law",
    body: "These Terms are governed by the laws of Kenya. Any disputes shall be subject to the exclusive jurisdiction of the courts of Nairobi, Kenya.",
  },
  {
    num: "08",
    title: "Contact",
    body: "For any questions about these Terms, contact us at hello@insurely.co.ke or write to our registered address in Nairobi, Kenya.",
  },
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
