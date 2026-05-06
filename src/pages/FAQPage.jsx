import { useState } from "react";
import { GOLD, NAVY, NAVY_MID, GRAY } from "../constants/theme";

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

export default function FAQPage() {
  const [open, setOpen] = useState(null);

  const toggleFAQ = (id) => setOpen(open === id ? null : id);

  return (
    <>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(170deg, ${NAVY} 0%, ${NAVY_MID} 100%)`,
        paddingTop: 130, paddingBottom: 60,
      }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
          <div className="fade-up" style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 2, color: GOLD,
            textTransform: "uppercase", marginBottom: 16,
          }}>
            FAQ
          </div>
          <h1 className="fade-up delay-1" style={{
            fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: "#fff",
            lineHeight: 1.15, letterSpacing: -1, maxWidth: 480,
          }}>
            Got questions? We've got answers.
          </h1>
        </div>
      </section>

      {/* Questions */}
      <section style={{ padding: "60px 24px 80px", maxWidth: 800, margin: "0 auto" }}>
        {faqs.map((cat, ci) => (
          <div key={ci} style={{ marginBottom: 40 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: 2, color: GOLD,
              textTransform: "uppercase", marginBottom: 16,
            }}>
              {cat.cat}
            </div>
            {cat.items.map((item, ii) => {
              const id = `${ci}-${ii}`;
              const isOpen = open === id;
              return (
                <div
                  key={ii}
                  style={{ borderBottom: "1px solid #E8E6E1", padding: "16px 0", cursor: "pointer" }}
                  onClick={() => toggleFAQ(id)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ fontSize: 15, fontWeight: 600, color: NAVY, paddingRight: 16 }}>
                      {item.q}
                    </h4>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      style={{
                        flexShrink: 0, transition: "transform 0.2s",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      <line x1="9" y1="4" x2="9" y2="14" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="4" y1="9" x2="14" y2="9" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  {isOpen && (
                    <p className="fade-in" style={{
                      fontSize: 14, color: GRAY, lineHeight: 1.7, marginTop: 10, paddingRight: 40,
                    }}>
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </section>
    </>
  );
}
