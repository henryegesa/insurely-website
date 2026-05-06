import { GOLD, NAVY, GRAY } from "../constants/theme";

const badges = [
  { icon: "shield", label: "IRA regulated", sub: "Licensed digital insurance agency" },
  { icon: "lock", label: "Bank-grade security", sub: "256-bit encryption on all data" },
  { icon: "users", label: "Top-rated carriers", sub: "Partnered with Kenya's leading insurers" },
  { icon: "zap", label: "Instant bind", sub: "Real-time policy issuance" },
];

function Icon({ name }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {name === "shield" && <path d="M12 2l8 4v6c0 5.5-3.8 10-8 11-4.2-1-8-5.5-8-11V6l8-4z" />}
      {name === "lock" && (
        <>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 018 0v4" />
        </>
      )}
      {name === "users" && (
        <>
          <circle cx="9" cy="7" r="3" />
          <circle cx="17" cy="7" r="2.5" />
          <path d="M2 21v-2a5 5 0 0110 0v2" />
          <path d="M14 21v-2a4 4 0 016 0v2" />
        </>
      )}
      {name === "zap" && <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />}
    </svg>
  );
}

export default function Trust() {
  return (
    <section style={{ padding: "80px 24px", maxWidth: 1120, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: 2, color: GOLD,
          textTransform: "uppercase", marginBottom: 12,
        }}>
          Why trust Insurely
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: NAVY, letterSpacing: -0.8 }}>
          Built on trust, powered by technology
        </h2>
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {badges.map((b, i) => (
          <div
            key={i}
            style={{
              flex: 1, minWidth: 220, textAlign: "center", padding: "32px 20px",
              borderRadius: 12, border: "1px solid #E8E6E1",
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 12, background: "rgba(201,165,92,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <Icon name={b.icon} />
            </div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 4 }}>
              {b.label}
            </h4>
            <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.5 }}>{b.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
