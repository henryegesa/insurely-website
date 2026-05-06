import { GOLD, NAVY, CREAM, GRAY } from "../constants/theme";

const steps = [
  { num: "1", title: "Get a quote", desc: "Enter your vehicle details and get instant quotes from top carriers. Choose TPO, Third Party Plus, or Comprehensive cover." },
  { num: "2", title: "Pay directly via M-Pesa", desc: "Your premium is paid directly to the insurance company via M-Pesa STK push. No middlemen handling your money." },
  { num: "3", title: "Get covered instantly", desc: "Your policy is issued in real-time. Download your certificate and drive with confidence — immediately." },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: "80px 24px", maxWidth: 1120, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: 2, color: GOLD,
          textTransform: "uppercase", marginBottom: 12,
        }}>
          How it works
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: NAVY, letterSpacing: -0.8 }}>
          Covered in three simple steps
        </h2>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {steps.map((s, i) => (
          <div
            key={i}
            className={`fade-up delay-${i + 1}`}
            style={{
              flex: 1, minWidth: 260, padding: 32, borderRadius: 12,
              background: CREAM, border: "1px solid #E8E6E1",
            }}
          >
            <div style={{
              fontSize: 13, fontWeight: 700, color: GOLD,
              background: "rgba(201,165,92,0.1)", width: 36, height: 36,
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 16, letterSpacing: 0.5,
            }}>
              {s.num}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 10 }}>
              {s.title}
            </h3>
            <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.7 }}>
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
