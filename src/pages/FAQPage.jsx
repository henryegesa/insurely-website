import { useState } from "react";
import { useReveal } from "../hooks/useReveal";

const faqs = [
  {
    cat: "Coverage",
    items: [
      { q: "What types of private motor cover do you offer?", a: "We offer three levels of cover: Third Party Only (TPO) — the legal minimum covering damage to others; Third Party Plus (TPP) — TPO enhanced with theft and fire protection for your own vehicle; and Comprehensive — full protection including own-vehicle accident damage, windscreen, and personal accident benefit." },
      { q: "What's Third Party Plus and who is it for?", a: "Third Party Plus (TPP) is the smart middle ground between TPO and Comprehensive. It covers everything TPO does, plus it protects your own vehicle against theft and fire. It's ideal if you want more than the legal minimum but don't need full comprehensive cover." },
      { q: "Does my cover start immediately?", a: "Yes. Once your M-Pesa payment is confirmed by the insurer, your policy is issued instantly. You can download your digital certificate right away and you're legally covered to drive." },
      { q: "Can I upgrade my cover later?", a: "Yes, you can upgrade from TPO to Third Party Plus or Comprehensive at any time through the app. The pricing will be adjusted based on your remaining policy period." },
    ],
  },
  {
    cat: "Payments",
    items: [
      { q: "How do I pay for my insurance?", a: "Your premium is paid directly to the insurance company via M-Pesa STK push. When you're ready to pay, we'll trigger an STK push to your phone — just enter your M-Pesa PIN to confirm. The money goes straight to the insurer, not to Insurely." },
      { q: "Why does my payment go directly to the insurer?", a: "For your protection. By paying the insurance company directly, you can be confident your premium is received by the underwriter immediately. There's no middleman holding your funds — your cover is activated the moment the insurer confirms payment." },
      { q: "Can I pay in installments?", a: "We're working on flexible payment plans. For now, premiums are paid in full at the time of purchase. Join our waitlist to be the first to know when installment options become available." },
      { q: "Is my payment information secure?", a: "Absolutely. All transactions are processed through Safaricom's M-Pesa infrastructure with bank-grade encryption. We never store your M-Pesa PIN or sensitive payment details." },
    ],
  },
  {
    cat: "Claims",
    items: [
      { q: "How do I file a claim?", a: "You can initiate a claim directly through the Insurely app. We'll guide you through the process step by step, including uploading photos and documentation. Claims are handled by your insurance carrier." },
      { q: "How long does a claim take to process?", a: "Claim processing times depend on the carrier and complexity of the claim. We work closely with our carrier partners to ensure claims are handled as quickly as possible, and you can track your claim status in the app." },
    ],
  },
  {
    cat: "Trust & regulation",
    items: [
      { q: "Is Insurely a real insurance company?", a: "Insurely is a licensed digital insurance agency — not an insurance company. We connect you with regulated insurance carriers who underwrite and back your policy. Think of us as the smartest, fastest way to buy legitimate motor insurance." },
      { q: "Is Insurely regulated?", a: "Yes. We operate under the oversight of the Insurance Regulatory Authority of Kenya (IRA). Every policy issued through Insurely is fully compliant with Kenyan insurance regulations." },
    ],
  },
];

function FAQItem({ item, globalIndex }) {
  const [open, setOpen] = useState(false);
  const ref = useReveal(globalIndex * 40);

  return (
    <div
      ref={ref}
      className="reveal"
      style={{
        borderBottom: "1px solid var(--border)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", textAlign: "left",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "24px 0",
          background: "none", border: "none", color: "var(--text)",
          gap: 20,
        }}
      >
        <span style={{
          fontSize: 15, fontWeight: 600, lineHeight: 1.4,
          fontFamily: "'Cabin', sans-serif",
        }}>
          {item.q}
        </span>
        <span style={{
          flexShrink: 0, width: 28, height: 28,
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.3s ease, background 0.2s",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          background: open ? "var(--gold)" : "transparent",
          color: open ? "var(--dark)" : "var(--gold)",
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="5" y="0" width="2" height="12" rx="1"/>
            <rect x="0" y="5" width="12" height="2" rx="1"/>
          </svg>
        </span>
      </button>

      <div className={`faq-answer ${open ? "open" : ""}`}>
        <p style={{
          fontSize: 13, color: "var(--text-muted)",
          lineHeight: 1.85, paddingBottom: 24, paddingRight: 48,
        }}>
          {item.a}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const heroRef = useReveal();
  let globalIndex = 0;

  return (
    <>
      {/* ─── Hero ─── */}
      <section style={{
        background: "var(--dark)",
        paddingTop: 160, paddingBottom: 100,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: "50%", height: "100%",
          background: "radial-gradient(ellipse 70% 70% at 80% 30%, rgba(212,168,83,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div ref={heroRef} className="reveal">
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 3,
              textTransform: "uppercase", color: "var(--gold)", marginBottom: 28,
            }}>
              FAQ
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(44px, 6vw, 78px)",
              fontWeight: 600, color: "var(--text)",
              lineHeight: 1.03, letterSpacing: -2,
              maxWidth: 560,
            }}>
              Got questions?<br />
              <em style={{ color: "var(--gold)", fontStyle: "italic" }}>We've got answers.</em>
            </h1>
          </div>
        </div>
      </section>

      {/* ─── Questions ─── */}
      <section style={{ padding: "80px 32px 140px", background: "var(--surface)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          {faqs.map((cat, ci) => (
            <div key={ci} style={{ marginBottom: 64 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 3,
                textTransform: "uppercase", color: "var(--gold)",
                marginBottom: 8, paddingBottom: 20,
                borderBottom: "1px solid var(--border)",
              }}>
                {cat.cat}
              </div>
              {cat.items.map((item, ii) => {
                const idx = globalIndex++;
                return <FAQItem key={ii} item={item} globalIndex={idx} />;
              })}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
