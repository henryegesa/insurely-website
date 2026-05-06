import { useReveal } from "../hooks/useReveal";

const differentiators = [
  { title: "Instant bind",                desc: "Your policy is issued in real-time the moment payment is confirmed. No waiting, no callbacks." },
  { title: "Pay directly to the insurer", desc: "Your premium goes straight to the insurance company via M-Pesa — we never handle your money." },
  { title: "Transparent pricing",         desc: "See exactly what you're paying for. No hidden fees, no surprise charges, no brokers in between." },
  { title: "Fully regulated",             desc: "Licensed by the Insurance Regulatory Authority of Kenya. Your cover is legitimate and enforceable." },
];

function DiffItem({ item, i }) {
  const ref = useReveal(i * 80);
  return (
    <div ref={ref} className="reveal" style={{
      padding: "24px 0",
      borderBottom: i < differentiators.length - 1 ? "1px solid var(--border)" : "none",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "var(--gold)", marginTop: 8, flexShrink: 0,
        }} />
        <div>
          <h4 style={{
            fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 6,
          }}>
            {item.title}
          </h4>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.8 }}>
            {item.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const heroRef  = useReveal();
  const bodyRef  = useReveal();
  const regRef   = useReveal();

  return (
    <>
      {/* ─── Hero ─── */}
      <section style={{
        background: "var(--dark)",
        paddingTop: 160, paddingBottom: 120,
        position: "relative", overflow: "hidden",
      }}>
        {/* Glow */}
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
              About Insurely
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(44px, 6vw, 78px)",
              fontWeight: 600, color: "var(--text)",
              lineHeight: 1.03, letterSpacing: -2,
              maxWidth: 680, marginBottom: 32,
            }}>
              We believe motor insurance should be instant, fair, and effortless.
            </h1>
            <p style={{
              fontSize: 15, color: "var(--text-muted)",
              lineHeight: 1.85, maxWidth: 480,
            }}>
              For too long, getting motor insurance in Kenya has meant long queues,
              confusing paperwork, and opaque pricing. Insurely was built to change
              that — starting with private motor cover.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Problem + Differentiators ─── */}
      <section style={{ padding: "120px 32px", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div ref={bodyRef} className="reveal" style={{ display: "flex", gap: 80, flexWrap: "wrap" }}>

            {/* Problem */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 3,
                textTransform: "uppercase", color: "var(--gold)", marginBottom: 24,
              }}>
                The problem
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 3.5vw, 42px)",
                fontWeight: 600, color: "var(--text)",
                letterSpacing: -0.8, marginBottom: 24, lineHeight: 1.1,
              }}>
                Motor insurance in Kenya is broken.
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.85, marginBottom: 20 }}>
                Many Kenyan drivers go without adequate cover simply because the
                process of getting insured is too painful — long queues, confusing
                paperwork, and opaque pricing.
              </p>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.85 }}>
                Insurely is a licensed digital insurance agency that connects you
                directly with Kenya's leading insurance carriers for private motor
                cover. Your premiums are paid directly to the insurer — no
                middlemen, no markup, no mystery.
              </p>
            </div>

            {/* Differentiators */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 3,
                textTransform: "uppercase", color: "var(--gold)", marginBottom: 24,
              }}>
                How we're different
              </div>
              <div style={{ borderTop: "1px solid var(--border)" }}>
                {differentiators.map((item, i) => (
                  <DiffItem key={i} item={item} i={i} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Regulatory ─── */}
      <section style={{ padding: "120px 32px", background: "var(--cream)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div ref={regRef} className="reveal" style={{
            display: "flex", gap: 80, alignItems: "center", flexWrap: "wrap",
          }}>

            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 3,
                textTransform: "uppercase", color: "var(--on-cream)", opacity: 0.5, marginBottom: 24,
              }}>
                Regulatory compliance
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 3.5vw, 48px)",
                fontWeight: 600, color: "var(--on-cream)",
                letterSpacing: -0.8, marginBottom: 24, lineHeight: 1.1,
              }}>
                Your trust, backed by regulation.
              </h2>
              <p style={{
                fontSize: 14, color: "var(--on-cream-muted)",
                lineHeight: 1.85,
              }}>
                Insurely operates as a licensed digital insurance agency under the
                Insurance Regulatory Authority of Kenya (IRA). Every policy we issue
                is underwritten by a regulated carrier and fully compliant with
                Kenyan insurance law.
              </p>
            </div>

            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 24,
                padding: "40px 36px",
                background: "#fff",
                border: "1px solid rgba(26,22,18,0.1)",
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l8 4v6c0 5.5-3.8 10-8 11-4.2-1-8-5.5-8-11V6l8-4z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                <div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 22, fontWeight: 600, color: "var(--on-cream)", marginBottom: 4,
                  }}>
                    IRA Licensed
                  </div>
                  <div style={{ fontSize: 12, color: "var(--on-cream-muted)" }}>
                    Insurance Regulatory Authority of Kenya
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
