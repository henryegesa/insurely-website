import { GOLD, NAVY } from "../constants/theme";

export default function Nav({ page, setPage }) {
  const links = ["Home", "About", "FAQ"];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(11,26,46,0.95)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(201,165,92,0.1)"
    }}>
      <div style={{
        maxWidth: 1120, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 64
      }}>
        <div
          onClick={() => setPage("Home")}
          style={{
            fontWeight: 700, fontSize: 20, color: GOLD,
            cursor: "pointer", letterSpacing: 0.5
          }}
        >
          insurely
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {links.map((l) => (
            <span
              key={l}
              onClick={() => setPage(l)}
              style={{
                fontSize: 13,
                fontWeight: page === l ? 600 : 400,
                letterSpacing: 0.3,
                color: page === l ? GOLD : "rgba(255,255,255,0.55)",
                cursor: "pointer",
                transition: "color 0.2s",
                borderBottom: page === l ? `2px solid ${GOLD}` : "2px solid transparent",
                paddingBottom: 4,
              }}
            >
              {l}
            </span>
          ))}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setPage("Home"); }}
            style={{
              fontSize: 12, fontWeight: 600, background: GOLD, color: NAVY,
              padding: "8px 20px", borderRadius: 6, letterSpacing: 0.3,
            }}
          >
            Get the app
          </a>
        </div>
      </div>
    </nav>
  );
}
