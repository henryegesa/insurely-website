import { useReveal } from "../hooks/useReveal";
import { useBreakpoint } from "../hooks/useBreakpoint";

const steps = [
  {
    num: "01",
    title: "Get a quote",
    desc: "Enter your vehicle details and receive instant quotes from top Kenyan carriers. Choose TPO, Third Party Plus, or Comprehensive cover — side by side.",
  },
  {
    num: "02",
    title: "Via Mobile Money",
    desc: "Your premium goes directly to the insurance company. No middlemen hold your money. The insurer receives it immediately.",
  },
  {
    num: "03",
    title: "Drive, covered",
    desc: "Your policy is issued in real-time the moment payment is confirmed. Download your certificate and drive with confidence — right away.",
  },
];

function Step({ s, i }) {
  const ref = useReveal(i * 120);
  const { isMobile } = useBreakpoint();
  return (
    <div
      ref={ref}
      className="reveal"
      style={{
        display: "flex",
        gap: isMobile ? 20 : 40,
        alignItems: "flex-start",
        padding: isMobile ? "36px 0" : "52px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Large numeral */}
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: isMobile ? "clamp(48px, 12vw, 72px)" : "clamp(64px, 8vw, 96px)",
        fontWeight: 600, lineHeight: 1,
        color: "transparent",
        WebkitTextStroke: "1px rgba(212,168,83,0.25)",
        minWidth: isMobile ? 64 : 100,
        userSelect: "none",
        flexShrink: 0,
        marginTop: -8,
      }}>
        {s.num}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: isMobile ? "clamp(22px, 5vw, 32px)" : "clamp(28px, 3.5vw, 40px)",
          fontWeight: 600, lineHeight: 1.1,
          color: "var(--text)", marginBottom: 12,
          letterSpacing: -0.5,
        }}>
          {s.title}
        </h3>
        <p style={{
          fontSize: isMobile ? 13 : 14, color: "var(--text-muted)",
          lineHeight: 1.85, maxWidth: 480,
        }}>
          {s.desc}
        </p>
      </div>

      {/* Accent dot — hide on mobile */}
      {!isMobile && (
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "var(--gold)", opacity: 0.5,
          flexShrink: 0, marginTop: 8,
        }} />
      )}
    </div>
  );
}

export default function HowItWorks() {
  const headerRef = useReveal();
  const { isMobile } = useBreakpoint();

  return (
    <section style={{ padding: isMobile ? "80px 20px" : "140px 32px", background: "var(--dark)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Section header */}
        <div
          ref={headerRef}
          className="reveal"
          style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "flex-end",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 16 : 32,
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
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? "clamp(32px, 8vw, 48px)" : "clamp(38px, 5vw, 60px)",
              fontWeight: 600, color: "var(--text)",
              lineHeight: 1.05, letterSpacing: -1,
            }}>
              Covered in three<br />simple steps.
            </h2>
          </div>

          <p style={{
            maxWidth: isMobile ? "100%" : 280,
            fontSize: 13, color: "var(--text-muted)",
            lineHeight: 1.85, fontWeight: 400, marginBottom: 4,
          }}>
            From quote to certificate in under three minutes. No agents, no paperwork, no queues.
          </p>
        </div>

        {/* Steps */}
        <div style={{ borderTop: "1px solid var(--border)", marginTop: isMobile ? 40 : 60 }}>
          {steps.map((s, i) => <Step key={i} s={s} i={i} />)}
        </div>

      </div>
    </section>
  );
}
