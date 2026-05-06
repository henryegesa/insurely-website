import { GOLD, NAVY, NAVY_LIGHT, NAVY_MID } from "../constants/theme";

export default function Hero() {
  return (
    <section style={{
      background: `linear-gradient(170deg, ${NAVY} 0%, ${NAVY_LIGHT} 50%, ${NAVY_MID} 100%)`,
      paddingTop: 140, paddingBottom: 100, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -120, right: -120, width: 400, height: 400,
        borderRadius: "50%", background: "rgba(201,165,92,0.04)",
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: -80, width: 300, height: 300,
        borderRadius: "50%", background: "rgba(201,165,92,0.03)",
      }} />

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", position: "relative" }}>
        <div className="fade-up" style={{
          display: "inline-block", fontSize: 11, fontWeight: 600, letterSpacing: 2,
          color: GOLD, textTransform: "uppercase", marginBottom: 20,
          background: "rgba(201,165,92,0.1)", padding: "6px 14px", borderRadius: 4,
        }}>
          IRA regulated · Trusted carriers
        </div>

        <h1 className="fade-up delay-1" style={{
          fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, color: "#fff",
          lineHeight: 1.1, letterSpacing: -1.5, maxWidth: 620, marginBottom: 20,
        }}>
          Private motor insurance,{" "}
          <span style={{ color: GOLD }}>reimagined</span> for Kenya.
        </h1>

        <p className="fade-up delay-2" style={{
          fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.7,
          maxWidth: 480, marginBottom: 36,
        }}>
          Get covered in minutes with instant policy issuance, transparent
          pricing, and payments made directly to the insurer via M-Pesa.
        </p>

        <div className="fade-up delay-3" style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <a href="#" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#fff", color: NAVY, padding: "14px 28px", borderRadius: 8,
            fontWeight: 600, fontSize: 14,
          }}>
            <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
              <path d="M1 1.6L11.2 11 1 20.4V1.6z" fill={NAVY} stroke={NAVY} strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M11.2 11L15.8 6.8 4 1l7.2 10z" fill={NAVY} opacity="0.7"/>
              <path d="M11.2 11L4 21l11.8-5.8-4.6-4.2z" fill={NAVY} opacity="0.5"/>
              <path d="M15.8 6.8L18.2 9.5a1.8 1.8 0 010 3L15.8 15.2 11.2 11l4.6-4.2z" fill={NAVY} opacity="0.85"/>
            </svg>
            Get on Google Play
          </a>

          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>or</span>

          <div style={{ display: "flex", gap: 0 }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                padding: "14px 16px", fontSize: 14,
                border: "1px solid rgba(255,255,255,0.15)", borderRight: "none",
                borderRadius: "8px 0 0 8px", background: "rgba(255,255,255,0.06)",
                color: "#fff", outline: "none", width: 220,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            />
            <button style={{
              padding: "14px 20px", fontSize: 13, fontWeight: 600,
              background: GOLD, color: NAVY, border: "none", borderRadius: "0 8px 8px 0",
              cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.3,
            }}>
              Join waitlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
