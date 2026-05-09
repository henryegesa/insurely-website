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
    copy: "Your certificate is issued the moment your M-Pesa payment clears. No waiting, no callbacks, no paperwork.",
  },
];

export default function Trust() {
  const { isMobile } = useBreakpoint();
  const ref0 = useReveal(0);
  const ref1 = useReveal(150);

  return (
    <section style={{ background: "#0a0907", padding: isMobile ? "60px 24px" : "80px 48px", borderTop: "1px solid #2a2218" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div ref={ref0} className="reveal" style={{ textAlign: "center", marginBottom: isMobile ? 48 : 64 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>WHY TRUST INSURELY</span>
            <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 44 : 64, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.1, marginBottom: 20 }}>
            Built on trust,{" "}
            <em style={{ color: "#c9a55c", fontStyle: "italic" }}>powered by technology.</em>
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#b8b1a3", maxWidth: 720, margin: "0 auto", lineHeight: 1.7 }}>
            Every decision we've made — from our carrier partners to our payment flow — is designed to give you confidence.
          </p>
        </div>

        {/* Pillars grid */}
        <div
          ref={ref1}
          className="reveal"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
            borderTop: "1px solid #2a2218",
          }}
        >
          {pillars.map((p, i) => (
            <div
              key={p.index}
              style={{
                padding: isMobile ? "32px 20px" : "40px 32px",
                borderRight: i < pillars.length - 1 ? "1px solid #2a2218" : "none",
                position: "relative",
              }}
            >
              {/* Index top right */}
              <div style={{ position: "absolute", top: 20, right: 20, fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 2, color: "#3a2f1c" }}>
                {p.index}
              </div>

              {/* Ring */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  border: "1px solid #c9a55c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                }}
              >
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#c9a55c", letterSpacing: 1 }}>{p.mark}</span>
              </div>

              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: "#f5f1e8", marginBottom: 12, lineHeight: 1.2 }}>
                {p.title}
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#9b9485", lineHeight: 1.7 }}>{p.copy}</p>
            </div>
          ))}
        </div>

        {/* Proof strip */}
        <div
          style={{
            marginTop: 48,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? 20 : 40,
            padding: "24px 0",
            borderTop: "1px solid #2a2218",
            borderBottom: "1px solid #2a2218",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261" }}>REGULATOR</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#b8b1a3", marginLeft: 12 }}>Insurance Regulatory Authority of Kenya</span>
          </div>
          <div style={{ width: 1, height: 24, background: "#2a2218" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261" }}>LICENSE STATUS</span>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7ec48c", display: "inline-block", boxShadow: "0 0 8px #7ec48c" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#b8b1a3" }}>Licensed by IRA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
