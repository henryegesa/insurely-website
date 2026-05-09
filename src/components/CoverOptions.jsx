import { useReveal } from "../hooks/useReveal";
import { useBreakpoint } from "../hooks/useBreakpoint";

const cards = [
  {
    id: "tpo",
    code: "TPO",
    name: "Third Party Only",
    price: "From KES 3,200/yr",
    blurb: "The legal minimum. Covers damage you cause to others — required by law in Kenya.",
    featured: false,
    features: [
      "Third-party bodily injury",
      "Third-party property damage",
      "Legal liability cover",
      "Digital certificate",
    ],
  },
  {
    id: "tpp",
    code: "TPP",
    name: "Third Party Plus",
    price: "From KES 5,800/yr",
    blurb: "Go beyond the minimum. Adds fire and theft protection to your legal cover.",
    featured: false,
    features: [
      "Everything in TPO",
      "Theft protection",
      "Fire damage cover",
      "Digital certificate",
    ],
  },
  {
    id: "comp",
    code: "COMP",
    name: "Comprehensive",
    price: "From KES 12,400/yr",
    blurb: "The complete package. Full cover for your vehicle and everything around it.",
    featured: true,
    features: [
      "Everything in TPP",
      "Own vehicle damage",
      "Windscreen cover",
      "Personal accident benefit",
    ],
  },
];

export default function CoverOptions() {
  const { isMobile } = useBreakpoint();
  const ref0 = useReveal(0);

  return (
    <section style={{ background: "#0a0907", padding: isMobile ? "60px 24px" : "80px 48px", borderTop: "1px solid #2a2218" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div ref={ref0} className="reveal" style={{ textAlign: "center", marginBottom: isMobile ? 48 : 64 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>WHAT WE OFFER</span>
            <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 44 : 64, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.1, marginBottom: 20 }}>
            Private motor cover,{" "}
            <em style={{ color: "#c9a55c", fontStyle: "italic" }}>three ways.</em>
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#b8b1a3", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            Pick the level of cover that fits your needs and budget. All plans include a digital IRA certificate issued instantly on payment.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1.05fr 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              style={{
                border: card.featured ? "1px solid #c9a55c" : "1px solid #2a2218",
                background: card.featured ? "linear-gradient(180deg, #15110a 0%, #100d07 100%)" : "transparent",
                transform: card.featured && !isMobile ? "translateY(-12px)" : "none",
                boxShadow: card.featured ? "0 32px 80px rgba(201,165,92,0.08)" : "none",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {card.featured && (
                <div
                  style={{
                    background: "#c9a55c",
                    color: "#0a0907",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 10,
                    letterSpacing: 3,
                    fontWeight: 700,
                    padding: "8px 0",
                    textAlign: "center",
                  }}
                >
                  RECOMMENDED
                </div>
              )}
              <div style={{ padding: 32 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, letterSpacing: 6, color: "#c9a55c", marginBottom: 12 }}>
                  {card.code}
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 400, color: "#f5f1e8", marginBottom: 8, lineHeight: 1.1 }}>
                  {card.name}
                </h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#9b9485", marginBottom: 20 }}>{card.price}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#b8b1a3", lineHeight: 1.7, marginBottom: 24 }}>{card.blurb}</p>

                <div style={{ borderTop: "1px solid #2a2218", paddingTop: 24, marginBottom: 24 }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", marginBottom: 16 }}>WHAT'S COVERED</p>
                  <ul style={{ listStyle: "none" }}>
                    {card.features.map((f) => (
                      <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                        <span style={{ color: "#c9a55c", fontSize: 13, marginTop: 1 }}>✓</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#b8b1a3" }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  style={{
                    width: "100%",
                    padding: "14px 0",
                    background: card.featured ? "#c9a55c" : "transparent",
                    color: card.featured ? "#0a0907" : "#c9a55c",
                    border: card.featured ? "none" : "1px solid #c9a55c",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    letterSpacing: 3,
                    fontWeight: 700,
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  Join Waitlist →
                </button>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7a7261", textAlign: "center", marginTop: 40, lineHeight: 1.7 }}>
          Prices are indicative and may vary based on your vehicle, age, and usage. Final quotes displayed at launch.
        </p>
      </div>
    </section>
  );
}
