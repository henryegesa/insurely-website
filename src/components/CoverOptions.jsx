import { useReveal } from "../hooks/useReveal";
import { useBreakpoint } from "../hooks/useBreakpoint";

const plans = [
  {
    tag: "TPO",
    name: "Third Party Only",
    desc: "Kenya's legal minimum. Covers damage and liability to others — exactly what you need to drive lawfully.",
    features: ["Third-party bodily injury", "Third-party property damage", "Legal liability cover", "Digital certificate"],
  },
  {
    tag: "TPP",
    name: "Third Party Plus",
    desc: "The smart middle ground. All TPO protection, plus your own vehicle covered against theft and fire.",
    features: ["Everything in TPO", "Theft protection", "Fire damage cover", "Digital certificate"],
  },
  {
    tag: "FULL",
    name: "Comprehensive",
    desc: "Complete peace of mind. Full protection for you, your vehicle, and third parties — nothing left uncovered.",
    features: ["Everything in TPP", "Own vehicle damage", "Windscreen cover", "Personal accident benefit"],
    featured: true,
  },
];

function PlanCard({ p, i }) {
  const ref = useReveal(i * 100);
  const { isMobile } = useBreakpoint();

  return (
    <div
      ref={ref}
      className="reveal plan-card"
      style={{
        flex: 1,
        minWidth: isMobile ? "100%" : 260,
        maxWidth: isMobile ? "100%" : 380,
        padding: isMobile ? "32px 24px" : "40px 36px",
        background: p.featured
          ? "linear-gradient(160deg, #1C1A10 0%, #141210 100%)"
          : "rgba(255,255,255,0.02)",
        border: p.featured
          ? "1px solid rgba(212,168,83,0.35)"
          : "1px solid var(--border-soft)",
        position: "relative",
        boxShadow: p.featured ? "0 0 80px rgba(212,168,83,0.06)" : "none",
      }}
    >
      {p.featured && (
        <div style={{
          position: "absolute", top: -1, right: 32,
          background: "var(--gold)", color: "var(--dark)",
          fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
          textTransform: "uppercase",
          padding: "5px 14px",
        }}>
          Recommended
        </div>
      )}

      <div style={{
        fontSize: 9, fontWeight: 700, letterSpacing: 2,
        textTransform: "uppercase",
        color: "var(--gold)",
        border: "1px solid rgba(212,168,83,0.25)",
        padding: "5px 12px",
        display: "inline-block",
        marginBottom: 24,
      }}>
        {p.tag}
      </div>

      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 28, fontWeight: 600,
        color: "var(--text)", lineHeight: 1.1,
        marginBottom: 16, letterSpacing: -0.3,
      }}>
        {p.name}
      </h3>

      <p style={{
        fontSize: 13, color: "var(--text-muted)",
        lineHeight: 1.8, marginBottom: 32,
      }}>
        {p.desc}
      </p>

      <div style={{ height: 1, background: "var(--border)", marginBottom: 24 }} />

      {p.features.map((f, fi) => (
        <div key={fi} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "9px 0",
          borderBottom: fi < p.features.length - 1 ? "1px solid var(--border-soft)" : "none",
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6.5" stroke="rgba(212,168,83,0.3)" />
            <path d="M4.5 7l2 2 3-3" stroke="#D4A853" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 12, color: "rgba(250,250,248,0.65)", fontWeight: 500 }}>
            {f}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function CoverOptions() {
  const headerRef = useReveal();
  const { isMobile } = useBreakpoint();

  return (
    <section style={{ padding: isMobile ? "80px 20px" : "140px 32px", background: "var(--surface)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <div ref={headerRef} className="reveal" style={{ marginBottom: isMobile ? 48 : 72 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 3,
            textTransform: "uppercase", color: "var(--gold)", marginBottom: 20,
          }}>
            What we offer
          </div>
          <div style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "flex-end",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 16 : 24,
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? "clamp(32px, 8vw, 48px)" : "clamp(38px, 5vw, 60px)",
              fontWeight: 600, color: "var(--text)",
              lineHeight: 1.05, letterSpacing: -1,
            }}>
              Private motor cover,<br />three ways.
            </h2>
            <p style={{
              maxWidth: isMobile ? "100%" : 280,
              fontSize: 13, color: "var(--text-muted)",
              lineHeight: 1.85,
            }}>
              Every level of cover issued instantly through the app, paid directly to your insurer via M-Pesa.
            </p>
          </div>
        </div>

        <div style={{
          display: "flex", gap: 20,
          flexDirection: isMobile ? "column" : "row",
          flexWrap: isMobile ? "nowrap" : "wrap",
          justifyContent: "center",
        }}>
          {plans.map((p, i) => <PlanCard key={i} p={p} i={i} />)}
        </div>

      </div>
    </section>
  );
}
