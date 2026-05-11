import { useReveal } from "../hooks/useReveal";
import { useBreakpoint } from "../hooks/useBreakpoint";

const pillars = [
  {
    mark: "IRA",
    index: "01",
    title: "IRA Regulated",
    copy: "Insurely operates under the Insurance Regulatory Authority of Kenya. Every carrier on our platform is licensed. Your policy is real.",
  },
  {
    mark: "256",
    index: "02",
    title: "Bank-grade security",
    copy: "256-bit encryption protects every transaction. Your personal and payment data is never stored on our servers.",
  },
  {
    mark: "A+",
    index: "03",
    title: "Top-rated carriers",
    copy: "We only partner with IRA-licensed insurers rated A or above. No fringe underwriters — only institutions that pay claims.",
  },
  {
    mark: "0:00",
    index: "04",
    title: "Instant bind",
    copy: "At launch, your certificate will be issued the moment your M-Pesa payment clears — no waiting, no callbacks, no paperwork. Digital issuance is DMVIC-ready.",
  },
];

export default function Trust() {
  const { isSmall, isMobile, isTablet } = useBreakpoint();
  const ref0 = useReveal(0);
  const ref1 = useReveal(150);

  const sectionPad = isSmall ? "48px 16px" : isMobile ? "60px 20px" : isTablet ? "60px 32px" : "80px 48px";

  return (
    <section style={{ background: "#0a0907", padding: sectionPad, borderTop: "1px solid #2a2218" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div ref={ref0} className="reveal" style={{ textAlign: "center", marginBottom: isSmall ? 36 : 52 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 28, height: 1, background: "#c9a55c" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 9 : 11, letterSpacing: isSmall ? 2 : 4, color: "#c9a55c", fontWeight: 600 }}>WHY TRUST INSURELY</span>
            <div style={{ width: 28, height: 1, background: "#c9a55c" }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isSmall ? 36 : isMobile ? 44 : isTablet ? 52 : 64, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.1, marginBottom: 16 }}>
            Built on trust,{" "}
            <em style={{ color: "#c9a55c", fontStyle: "italic" }}>powered by technology.</em>
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 14 : 16, color: "#b8b1a3", maxWidth: 680, margin: "0 auto", lineHeight: 1.7 }}>
            Every decision we've made — from our carrier partners to our payment flow — is designed to give you confidence.
          </p>
        </div>

        {/* Pillars grid — 4-col on desktop, 2x2 on tablet/mobile, 1-col on tiny */}
        <div
          ref={ref1}
          className="reveal"
          style={{
            display: "grid",
            gridTemplateColumns: isSmall ? "1fr" : isTablet ? "1fr 1fr" : "repeat(4, 1fr)",
            borderTop: "1px solid #2a2218",
          }}
        >
          {pillars.map((p, i) => {
            const isLastCol = isSmall
              ? true
              : isTablet
              ? i % 2 === 1
              : i === pillars.length - 1;
            const isBottomRow = isTablet && !isSmall ? i >= 2 : false;

            return (
              <div
                key={p.index}
                style={{
                  padding: isSmall ? "28px 0" : isMobile ? "28px 20px" : "36px 28px",
                  borderRight: isLastCol ? "none" : "1px solid #2a2218",
                  borderBottom: isBottomRow ? "none" : isTablet && !isSmall && i < 2 ? "1px solid #2a2218" : "none",
                  position: "relative",
                }}
              >
                <div style={{ position: "absolute", top: 16, right: isSmall ? 0 : 16, fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 2, color: "#3a2f1c" }}>
                  {p.index}
                </div>

                <div
                  style={{
                    width: isSmall ? 52 : 60,
                    height: isSmall ? 52 : 60,
                    borderRadius: "50%",
                    border: "1px solid #c9a55c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isSmall ? 16 : 18, color: "#c9a55c", letterSpacing: 1 }}>{p.mark}</span>
                </div>

                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isSmall ? 24 : 28, fontWeight: 400, color: "#f5f1e8", marginBottom: 10, lineHeight: 1.2 }}>
                  {p.title}
                </h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 13 : 14, color: "#9b9485", lineHeight: 1.7 }}>{p.copy}</p>
              </div>
            );
          })}
        </div>

        {/* Proof strip */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: isSmall ? 12 : 32,
            padding: isSmall ? "20px 0" : "24px 0",
            borderTop: "1px solid #2a2218",
            borderBottom: "1px solid #2a2218",
          }}
        >
          <div style={{ textAlign: isSmall ? "center" : "left" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261" }}>REGULATOR </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 12 : 13, color: "#b8b1a3" }}>Insurance Regulatory Authority of Kenya</span>
          </div>
          {!isSmall && <div style={{ width: 1, height: 20, background: "#2a2218" }} />}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261" }}>LICENSE STATUS</span>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#7ec48c", display: "inline-block", boxShadow: "0 0 8px #7ec48c" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 12 : 13, color: "#b8b1a3" }}>Licensed by IRA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
