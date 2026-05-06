import { useReveal } from "../hooks/useReveal";

const steps = [
  {
    num: "01",
    title: "Get a quote",
    desc: "Enter your vehicle details and receive instant quotes from top Kenyan carriers. Choose TPO, Third Party Plus, or Comprehensive cover — side by side.",
  },
  {
    num: "02",
    title: "Pay via M-Pesa",
    desc: "Your premium goes directly to the insurance company via M-Pesa STK push. No middlemen hold your money. The insurer receives it immediately.",
  },
  {
    num: "03",
    title: "Drive, covered",
    desc: "Your policy is issued in real-time the moment payment is confirmed. Download your certificate and drive with confidence — right away.",
  },
];

function Step({ s, i }) {
  const ref = useReveal(i * 120);
  return (
    <div
      ref={ref}
      className="reveal"
      style={{
        display: "flex", gap: 40, alignItems: "flex-start",
        padding: "52px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Large numeral */}
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(64px, 8vw, 96px)",
        fontWeight: 600, lineHeight: 1,
        color: "transparent",
        WebkitTextStroke: "1px rgba(212,168,83,0.25)",
        minWidth: 100,
        userSelect: "none",
        flexShrink: 0,
        marginTop: -8,
      }}>
        {s.num}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(28px, 3.5vw, 40px)",
          fontWeight: 600, lineHeight: 1.1,
          color: "var(--text)", marginBottom: 16,
          letterSpacing: -0.5,
        }}>
          {s.title}
        </h3>
        <p style={{
          fontSize: 14, color: "var(--text-muted)",
          lineHeight: 1.85, maxWidth: 480,
        }}>
          {s.desc}
        </p>
      </div>

      {/* Accent dot */}
      <div style={{
        width: 8, height: 8, borderRadius: "50%",
        background: "var(--gold)", opacity: 0.5,
        flexShrink: 0, marginTop: 8,
      }} />
    </div>
  );
}

export default function HowItWorks() {
  const headerRef = useReveal();

  return (
    <section style={{ padding: "140px 32px", background: "var(--dark)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Section header */}
        <div
          ref={headerRef}
          className="reveal"
          style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            flexWrap: "wrap", gap: 32,
            paddingBottom: 0, marginBottom: 0,
          }}
        >
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 3,
              textTransform: "uppercase", color: "var(--gold)", marginBottom: 20,
            }}>
              How it works
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(38px, 5vw, 60px)",
              fontWeight: 600, color: "var(--text)",
              lineHeight: 1.05, letterSpacing: -1,
            }}>
              Covered in three<br />simple steps.
            </h2>
          </div>

          <p style={{
            maxWidth: 280, fontSize: 13, color: "var(--text-muted)",
            lineHeight: 1.85, fontWeight: 400, marginBottom: 4,
          }}>
            From quote to certificate in under three minutes. No agents, no paperwork, no queues.
          </p>
        </div>

        {/* Steps */}
        <div style={{ borderTop: "1px solid var(--border)", marginTop: 60 }}>
          {steps.map((s, i) => <Step key={i} s={s} i={i} />)}
        </div>

      </div>
    </section>
  );
}
