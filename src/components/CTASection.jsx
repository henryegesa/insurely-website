import { GOLD, NAVY, NAVY_MID } from "../constants/theme";

export default function CTASection() {
  return (
    <section style={{
      padding: "80px 24px",
      background: `linear-gradient(160deg, ${NAVY}, ${NAVY_MID})`,
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{
          fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: -0.8, marginBottom: 12,
        }}>
          Ready to get covered?
        </h2>
        <p style={{
          fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 32,
        }}>
          Join thousands of Kenyan drivers choosing smarter private motor
          insurance. Download the app or join our waitlist today.
        </p>

        <div style={{ display: "flex", gap: 0, justifyContent: "center", maxWidth: 420, margin: "0 auto" }}>
          <input
            type="email"
            placeholder="Enter your email"
            style={{
              flex: 1, padding: "16px 18px", fontSize: 14,
              border: "1px solid rgba(255,255,255,0.15)", borderRight: "none",
              borderRadius: "8px 0 0 8px", background: "rgba(255,255,255,0.06)",
              color: "#fff", outline: "none",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />
          <button style={{
            padding: "16px 24px", fontSize: 14, fontWeight: 600,
            background: GOLD, color: NAVY, border: "none", borderRadius: "0 8px 8px 0",
            cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
            whiteSpace: "nowrap",
          }}>
            Join waitlist
          </button>
        </div>
      </div>
    </section>
  );
}
