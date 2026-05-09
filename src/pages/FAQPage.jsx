import { useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { useBreakpoint } from "../hooks/useBreakpoint";

const faqs = [
  {
    q: "When does Insurely launch?",
    a: "We're targeting Q3 2026 for our public launch in Kenya. Waitlist members will get early access before anyone else, along with a first-mover pricing advantage.",
  },
  {
    q: "Is Insurely regulated by the IRA?",
    a: "Yes. Insurely operates under the Insurance Regulatory Authority of Kenya. Every insurer on our platform is IRA-licensed. Your policy is legally binding and fully compliant.",
  },
  {
    q: "How does payment work?",
    a: "You pay via M-Pesa or Airtel Money. We send an STK push to your phone — you enter your PIN and the payment goes direct to the insurer. Insurely never holds your money.",
  },
  {
    q: "How quickly do I get my certificate?",
    a: "Instantly. The moment your M-Pesa payment confirms, your IRA-compliant certificate of insurance is generated and delivered to your email and phone. No waiting.",
  },
  {
    q: "Which insurance companies do you work with?",
    a: "We partner exclusively with IRA-licensed insurers rated A or above for financial strength. At launch, we'll have multiple carriers available so you can compare prices and choose.",
  },
  {
    q: "What vehicles can I insure?",
    a: "At launch, we're focused on private passenger vehicles registered in Kenya. We plan to expand to commercial and fleet vehicles in 2027.",
  },
  {
    q: "Do you store my payment information?",
    a: "No. We never store your M-Pesa PIN or payment credentials. All transactions are processed through Safaricom's and Airtel's secure payment infrastructure.",
  },
  {
    q: "What if I need to make a claim?",
    a: "You'll deal directly with your insurer for claims — the same process as any other policy. We'll give you all the carrier contact details in your policy documents, and we're building a claims-tracking feature for 2027.",
  },
];

export default function FAQPage() {
  const { isMobile } = useBreakpoint();
  const ref0 = useReveal(0);
  const [open, setOpen] = useState(null);

  return (
    <div style={{ background: "#0a0907", minHeight: "100vh", paddingTop: 72 }}>
      {/* Hero */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "60px 24px 48px" : "80px 48px 60px", textAlign: "center" }}>
        <div ref={ref0} className="reveal">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>FAQ</span>
            <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 52 : 80, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.1, marginBottom: 24 }}>
            Questions,{" "}
            <em style={{ color: "#c9a55c", fontStyle: "italic" }}>answered.</em>
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: "#b8b1a3", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
            The honest answers to what most people ask before they sign up.
          </p>
        </div>
      </div>

      {/* Accordion */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "0 24px 80px" : "0 48px 100px" }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderTop: "1px solid #2a2218" }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "28px 0",
                background: open === i ? "linear-gradient(180deg, rgba(21,17,10,0.6) 0%, transparent 100%)" : "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, letterSpacing: 3, color: "#c9a55c", minWidth: 28, fontStyle: "italic" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ flex: 1, fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 20 : 24, color: "#f5f1e8", fontWeight: 400 }}>
                {faq.q}
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 28,
                  color: "#c9a55c",
                  lineHeight: 1,
                  transform: open === i ? "rotate(45deg)" : "none",
                  transition: "transform 0.3s ease",
                  display: "inline-block",
                  minWidth: 28,
                  textAlign: "center",
                }}
              >
                +
              </span>
            </button>
            <div className={`faq-answer${open === i ? " open" : ""}`}>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  color: "#b8b1a3",
                  lineHeight: 1.75,
                  paddingLeft: isMobile ? 0 : 70,
                  paddingBottom: 28,
                }}
              >
                {faq.a}
              </p>
            </div>
          </div>
        ))}
        <div style={{ borderTop: "1px solid #2a2218" }} />

        {/* Footer row */}
        <div style={{ paddingTop: 48, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#9b9485" }}>Still have a question?</span>
          <a
            href="mailto:hello@insurely.co.ke"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#c9a55c", textDecoration: "none" }}
          >
            Email us at hello@insurely.co.ke →
          </a>
        </div>
      </div>
    </div>
  );
}
