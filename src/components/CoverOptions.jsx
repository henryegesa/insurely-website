import { GOLD, NAVY, NAVY_LIGHT, NAVY_MID } from "../constants/theme";

const plans = [
  {
    name: "Third Party Only",
    tag: "TPO",
    desc: "Essential legal cover for third-party damage and liability. Kenya's minimum legal requirement to drive.",
    features: ["Third-party bodily injury", "Third-party property damage", "Legal liability cover", "Digital certificate"],
  },
  {
    name: "Third Party Plus",
    tag: "TPP",
    desc: "TPO cover enhanced with own-vehicle protection against theft and fire. The smart middle ground.",
    features: ["Everything in TPO", "Theft protection", "Fire damage cover", "Digital certificate"],
  },
  {
    name: "Comprehensive",
    tag: "FULL",
    desc: "Complete protection for your vehicle and third parties. Covers theft, accidents, fire, and more.",
    features: ["Everything in TPP", "Own vehicle damage", "Windscreen cover", "Personal accident benefit"],
    featured: true,
  },
];

export default function CoverOptions() {
  return (
    <section style={{ padding: "80px 24px", background: NAVY }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 2, color: GOLD,
            textTransform: "uppercase", marginBottom: 12,
          }}>
            What we offer
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: -0.8 }}>
            Private motor cover, three ways
          </h2>
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          {plans.map((p, i) => (
            <div
              key={i}
              style={{
                flex: 1, minWidth: 260, maxWidth: 380, padding: 32, borderRadius: 14,
                background: p.featured
                  ? `linear-gradient(160deg, ${NAVY_LIGHT}, ${NAVY_MID})`
                  : "rgba(255,255,255,0.04)",
                border: p.featured
                  ? `1.5px solid ${GOLD}`
                  : "1px solid rgba(255,255,255,0.08)",
                position: "relative",
              }}
            >
              {p.featured && (
                <div style={{
                  position: "absolute", top: -12, left: 28,
                  background: GOLD, color: NAVY, fontSize: 10, fontWeight: 700,
                  padding: "4px 12px", borderRadius: 4, letterSpacing: 1, textTransform: "uppercase",
                }}>
                  Recommended
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: GOLD,
                  background: "rgba(201,165,92,0.12)", padding: "4px 10px", borderRadius: 4,
                  letterSpacing: 1,
                }}>
                  {p.tag}
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{p.name}</h3>
              </div>

              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 24 }}>
                {p.desc}
              </p>

              {p.features.map((f, fi) => (
                <div
                  key={fi}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 0",
                    borderTop: fi === 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="7" fill="rgba(201,165,92,0.15)" />
                    <path d="M5 8l2 2 4-4" stroke={GOLD} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{f}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
