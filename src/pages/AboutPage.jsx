import { useReveal } from "../hooks/useReveal";
import { useBreakpoint } from "../hooks/useBreakpoint";

const beliefs = [
  { num: "01", title: "Speed is a feature.", copy: "Every minute you spend filling forms is a minute we failed you. Our goal: quote to certificate in under 3 minutes, always." },
  { num: "02", title: "Money goes direct.", copy: "Your premium goes straight to the insurer via M-Pesa. We're a technology layer — not a financial intermediary." },
  { num: "03", title: "Honesty over upsell.", copy: "We show you all the options and let you choose. No hidden add-ons, no pressure tactics, no commissions inflating your price." },
  { num: "04", title: "Mobile-first, always.", copy: "70% of Kenyans access the internet on a phone. We built Insurely for the phone first, and everything else second." },
];

export default function AboutPage() {
  const { isMobile } = useBreakpoint();
  const ref0 = useReveal(0);
  const ref1 = useReveal(150);
  const ref2 = useReveal(200);

  return (
    <div style={{ background: "#0a0907", minHeight: "100vh", paddingTop: 72 }}>
      {/* Hero */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: isMobile ? "60px 24px 48px" : "80px 48px 60px", textAlign: "center" }}>
        <div ref={ref0} className="reveal">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>ABOUT INSURELY</span>
            <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 48 : 72, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.1, marginBottom: 32 }}>
            Insurance that{" "}
            <em style={{ color: "#c9a55c", fontStyle: "italic" }}>respects</em>{" "}
            your time and money.
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: "#b8b1a3", lineHeight: 1.75, maxWidth: 700, margin: "0 auto" }}>
            For too long, getting motor insurance in Kenya meant phone calls, PDFs emailed back and forth, cash deposits, and waiting days for a sticker. We're changing that — completely.
          </p>
        </div>
      </div>

      {/* What we believe */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "40px 24px" : "60px 48px", borderTop: "1px solid #2a2218" }}>
        <div ref={ref1} className="reveal">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600, marginBottom: 40 }}>WHAT WE BELIEVE</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
              gap: isMobile ? 40 : 0,
              borderTop: "1px solid #2a2218",
            }}
          >
            {beliefs.map((b, i) => (
              <div
                key={b.num}
                style={{
                  padding: isMobile ? "32px 0" : "40px 32px",
                  borderRight: !isMobile && i < beliefs.length - 1 ? "1px solid #2a2218" : "none",
                  borderBottom: isMobile && i < beliefs.length - 1 ? "1px solid #2a2218" : "none",
                }}
              >
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, letterSpacing: 4, color: "#3a2f1c", marginBottom: 16 }}>{b.num}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, color: "#f5f1e8", marginBottom: 16, lineHeight: 1.2 }}>
                  {b.title}
                </h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#9b9485", lineHeight: 1.7 }}>{b.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Facts strip */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 24px 80px" : "0 48px 100px" }}>
        <div
          ref={ref2}
          className="reveal"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: isMobile ? 20 : 0,
            borderTop: "1px solid #2a2218",
            borderBottom: "1px solid #2a2218",
            padding: "32px 0",
            justifyContent: isMobile ? "flex-start" : "space-around",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center", padding: "0 32px" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", marginBottom: 8 }}>FOUNDED</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#f5f1e8" }}>2025</p>
          </div>
          <div style={{ width: 1, height: 40, background: "#2a2218", display: isMobile ? "none" : "block" }} />
          <div style={{ textAlign: "center", padding: "0 32px" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", marginBottom: 8 }}>REGULATOR</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#f5f1e8" }}>IRA Kenya</p>
          </div>
          <div style={{ width: 1, height: 40, background: "#2a2218", display: isMobile ? "none" : "block" }} />
          <div style={{ textAlign: "center", padding: "0 32px" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", marginBottom: 8 }}>STATUS</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7ec48c", display: "inline-block", boxShadow: "0 0 8px #7ec48c" }} />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#f5f1e8" }}>Pre-launch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
