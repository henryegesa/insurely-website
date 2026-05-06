export default function Footer({ setPage }) {
  const links = [
    { heading: "Company", items: ["Home", "About", "FAQ"] },
    { heading: "Legal",   items: ["Privacy policy", "Terms of service"] },
    { heading: "Contact", items: ["hello@insurely.co.ke", "Nairobi, Kenya"] },
  ];

  return (
    <footer style={{
      background: "var(--surface)",
      borderTop: "1px solid var(--border)",
      padding: "72px 32px 40px",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", justifyContent: "space-between",
        flexWrap: "wrap", gap: 48,
      }}>

        {/* Brand */}
        <div style={{ maxWidth: 280 }}>
          <div
            onClick={() => setPage("Home")}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600, fontSize: 22,
              color: "var(--gold)",
              cursor: "pointer",
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Insurely
          </div>
          <p style={{
            fontSize: 12, color: "var(--text-dim)",
            lineHeight: 1.8,
          }}>
            Private motor insurance, instant and effortless. A licensed digital
            insurance agency regulated by the IRA.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
          {links.map((col) => (
            <div key={col.heading}>
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: 2,
                textTransform: "uppercase",
                color: "var(--text-dim)",
                marginBottom: 20,
              }}>
                {col.heading}
              </div>
              {col.items.map((item) => (
                <div
                  key={item}
                  onClick={col.heading === "Company" ? () => setPage(item) : undefined}
                  style={{
                    fontSize: 12, color: "var(--text-muted)",
                    marginBottom: 12,
                    cursor: col.heading === "Company" ? "pointer" : "default",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => { if (col.heading === "Company") e.target.style.color = "var(--gold)"; }}
                  onMouseLeave={(e) => { if (col.heading === "Company") e.target.style.color = "var(--text-muted)"; }}
                >
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: 1200, margin: "48px auto 0",
        paddingTop: 28,
        borderTop: "1px solid var(--border-soft)",
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        fontSize: 11, color: "var(--text-dim)",
      }}>
        <span>© 2026 Insurely Ltd. All rights reserved.</span>
        <span>Licensed by the Insurance Regulatory Authority of Kenya.</span>
      </div>
    </footer>
  );
}
