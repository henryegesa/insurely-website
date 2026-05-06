import { GOLD, NAVY, NAVY_MID, CREAM, GRAY } from "../constants/theme";

const differentiators = [
  { title: "Instant bind", desc: "Your policy is issued in real-time the moment payment is confirmed. No waiting, no callbacks." },
  { title: "Pay directly to the insurer", desc: "Your premium goes straight to the insurance company via M-Pesa — we never handle your money." },
  { title: "Transparent pricing", desc: "See exactly what you're paying for. No hidden fees, no surprise charges." },
  { title: "Fully regulated", desc: "Licensed by the Insurance Regulatory Authority of Kenya. Your cover is legitimate and enforceable." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(170deg, ${NAVY} 0%, ${NAVY_MID} 100%)`,
        paddingTop: 130, paddingBottom: 80,
      }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
          <div className="fade-up" style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 2, color: GOLD,
            textTransform: "uppercase", marginBottom: 16,
          }}>
            About Insurely
          </div>
          <h1 className="fade-up delay-1" style={{
            fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: "#fff",
            lineHeight: 1.15, letterSpacing: -1, maxWidth: 560, marginBottom: 20,
          }}>
            We believe private motor insurance should be instant, fair, and effortless.
          </h1>
          <p className="fade-up delay-2" style={{
            fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 520,
          }}>
            For too long, getting motor insurance in Kenya has meant long queues,
            confusing paperwork, and opaque pricing. Insurely was built to change
            that — starting with private motor cover.
          </p>
        </div>
      </section>

      {/* Problem + Differentiators */}
      <section style={{ padding: "80px 24px", maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: 2, color: GOLD,
              textTransform: "uppercase", marginBottom: 12,
            }}>
              The problem
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: NAVY, letterSpacing: -0.5, marginBottom: 16 }}>
              Motor insurance in Kenya is broken
            </h2>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.8, marginBottom: 16 }}>
              Many Kenyan drivers go without adequate cover simply because the
              process of getting insured is too painful — long queues, confusing
              paperwork, and opaque pricing.
            </p>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.8 }}>
              Insurely is a licensed digital insurance agency that connects you
              directly with Kenya's leading insurance carriers for private motor
              cover. Your premiums are paid directly to the insurer — no
              middlemen, no markup, no mystery.
            </p>
          </div>

          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: 2, color: GOLD,
              textTransform: "uppercase", marginBottom: 12,
            }}>
              How we're different
            </div>
            {differentiators.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "16px 0",
                  borderBottom: i < 3 ? "1px solid #E8E6E1" : "none",
                }}
              >
                <h4 style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 4 }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory */}
      <section style={{ padding: "60px 24px 80px", background: CREAM }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 2, color: GOLD,
            textTransform: "uppercase", marginBottom: 12,
          }}>
            Regulatory compliance
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: NAVY, letterSpacing: -0.5, marginBottom: 16 }}>
            Your trust, backed by regulation
          </h2>
          <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.8, maxWidth: 560, margin: "0 auto 32px" }}>
            Insurely operates as a licensed digital insurance agency under the
            Insurance Regulatory Authority of Kenya (IRA). Every policy we issue
            is underwritten by a regulated carrier and fully compliant with
            Kenyan insurance law.
          </p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            background: "#fff", padding: "16px 28px", borderRadius: 10,
            border: "1px solid #E8E6E1",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l8 4v6c0 5.5-3.8 10-8 11-4.2-1-8-5.5-8-11V6l8-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>IRA Licensed</div>
              <div style={{ fontSize: 12, color: GRAY }}>Insurance Regulatory Authority of Kenya</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
