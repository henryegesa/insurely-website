import { useReveal } from "../hooks/useReveal";
import { useBreakpoint } from "../hooks/useBreakpoint";

const badges = [
  {
    icon: "shield",
    label: "IRA regulated",
    sub: "Licensed digital insurance agency under the Insurance Regulatory Authority of Kenya.",
  },
  {
    icon: "lock",
    label: "Bank-grade security",
    sub: "256-bit encryption on all data. Your information is never sold or shared.",
  },
  {
    icon: "users",
    label: "Top-rated carriers",
    sub: "Partnered with Kenya's leading, fully licensed insurance companies.",
  },
  {
    icon: "zap",
    label: "Instant bind",
    sub: "Real-time policy issuance the moment your M-Pesa payment is confirmed.",
  },
];

function TrustIcon({ name }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {name === "shield" && <><path d="M12 2l8 4v6c0 5.5-3.8 10-8 11-4.2-1-8-5.5-8-11V6l8-4z"/><path d="M9 12l2 2 4-4"/></>}
      {name === "lock"  && <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></>}
      {name === "users" && <><circle cx="9" cy="7" r="3"/><circle cx="17" cy="7" r="2.5"/><path d="M2 21v-2a5 5 0 0110 0v2"/><path d="M14 21v-2a4 4 0 016 0v2"/></>}
      {name === "zap"   && <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>}
    </svg>
  );
}

function Badge({ b, i }) {
  const ref = useReveal(i * 80);
  const { isMobile, isTablet } = useBreakpoint();

  // On mobile: 1 col, on tablet: 2 col, on desktop: 4 col
  const isLastInRow = isMobile
    ? true
    : isTablet
      ? i % 2 === 1
      : i === 3;
  const isLast = i === badges.length - 1;

  return (
    <div ref={ref} className="reveal" style={{
      flex: isMobile ? "1 1 100%" : isTablet ? "1 1 calc(50% - 1px)" : 1,
      minWidth: isMobile ? "100%" : isTablet ? "calc(50% - 1px)" : 220,
      padding: isMobile ? "32px 20px" : "40px 32px",
      background: "var(--cream)",
      borderRight: isLastInRow ? "none" : "1px solid rgba(26,22,18,0.1)",
      borderBottom: isLast ? "none" : (isMobile || (isTablet && i >= 2)) ? "none" : isTablet && i < 2 ? "1px solid rgba(26,22,18,0.1)" : "none",
    }}>
      <div style={{
        width: 48, height: 48,
        background: "rgba(212,168,83,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20,
      }}>
        <TrustIcon name={b.icon} />
      </div>
      <h4 style={{
        fontSize: 15, fontWeight: 700,
        color: "var(--on-cream)", marginBottom: 10,
        fontFamily: "'Cabin', sans-serif",
      }}>
        {b.label}
      </h4>
      <p style={{
        fontSize: 12, color: "var(--on-cream-muted)",
        lineHeight: 1.75,
      }}>
        {b.sub}
      </p>
    </div>
  );
}

export default function Trust() {
  const headerRef = useReveal();
  const { isMobile } = useBreakpoint();

  return (
    <section style={{ background: "var(--cream)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "60px 20px 40px" : "100px 32px 60px" }}>
        <div ref={headerRef} className="reveal" style={{
          display: "flex",
          alignItems: isMobile ? "flex-start" : "flex-end",
          justifyContent: "space-between",
          flexDirection: isMobile ? "column" : "row",
          flexWrap: "wrap", gap: isMobile ? 16 : 24,
        }}>
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 3,
              textTransform: "uppercase", color: "var(--on-cream)", opacity: 0.5, marginBottom: 20,
            }}>
              Why trust Insurely
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? "clamp(32px, 8vw, 48px)" : "clamp(38px, 5vw, 58px)",
              fontWeight: 600, color: "var(--on-cream)",
              lineHeight: 1.05, letterSpacing: -1,
            }}>
              Built on trust,<br />powered by technology.
            </h2>
          </div>
          <p style={{
            maxWidth: isMobile ? "100%" : 260,
            fontSize: 13, color: "var(--on-cream-muted)",
            lineHeight: 1.85, marginBottom: 4,
          }}>
            Every policy issued through Insurely is underwritten by a regulated carrier and fully compliant with Kenyan insurance law.
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", flexWrap: "wrap",
        borderTop: "1px solid rgba(26,22,18,0.1)",
      }}>
        {badges.map((b, i) => <Badge key={i} b={b} i={i} />)}
      </div>

      <div style={{ height: isMobile ? 60 : 100 }} />
    </section>
  );
}
