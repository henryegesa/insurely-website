import { useBreakpoint } from "../hooks/useBreakpoint";

export default function Footer({ setPage }) {
  const { isSmall, isMobile } = useBreakpoint();

  const linkStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: isSmall ? 12 : 13,
    color: "#9b9485",
    cursor: "pointer",
    display: "block",
    marginBottom: 12,
    transition: "color 0.2s",
  };

  const labelStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 10,
    letterSpacing: 3,
    color: "#7a7261",
    marginBottom: 16,
    display: "block",
  };

  return (
    <footer style={{ background: "#0d0a05", borderTop: "1px solid #2a2218" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isSmall ? "36px 16px" : isMobile ? "48px 20px" : "64px 48px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isSmall ? "1fr" : isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr",
            gap: isSmall ? 32 : isMobile ? 36 : 48,
            marginBottom: 40,
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: isMobile && !isSmall ? "1 / -1" : "auto" }}>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isSmall ? 18 : 22,
                letterSpacing: 6,
                color: "#c9a55c",
                display: "block",
                marginBottom: 14,
                cursor: "pointer",
              }}
              onClick={() => setPage("Home")}
            >
              INSURELY
            </span>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 13 : 14, color: "#7a7261", lineHeight: 1.7, maxWidth: 280 }}>
              Kenya's digital insurance distribution platform. Compare cover from IRA-licensed insurers, pay via M-Pesa, and receive your certificate digitally.
            </p>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7ec48c", display: "inline-block" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#4a4235" }}>Launching Q3 2026</span>
            </div>
          </div>

          {/* Products */}
          <div>
            <span style={labelStyle}>PRODUCTS</span>
            <span style={linkStyle} onClick={() => setPage("Motor")}>Motor Insurance</span>
            <span style={linkStyle} onClick={() => setPage("Quote")}>Get a Quote</span>
          </div>

          {/* Company */}
          <div>
            <span style={labelStyle}>COMPANY</span>
            <span style={linkStyle} onClick={() => setPage("About")}>About</span>
            <span style={linkStyle} onClick={() => setPage("Partners")}>Partners</span>
            <span style={linkStyle} onClick={() => setPage("FAQ")}>FAQ</span>
            <span style={linkStyle} onClick={() => setPage("Contact")}>Contact</span>
          </div>

          {/* Legal */}
          <div>
            <span style={labelStyle}>LEGAL</span>
            <span style={linkStyle} onClick={() => setPage("Privacy")}>Privacy Policy</span>
            <span style={linkStyle} onClick={() => setPage("Terms")}>Terms of Service</span>
            <a href="mailto:hello@insurely.co.ke" style={{ ...linkStyle, textDecoration: "none" }}>hello@insurely.co.ke</a>
            <span style={{ ...linkStyle, cursor: "default" }}>Nairobi, Kenya</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid #2a2218",
            paddingTop: 24,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 11 : 12, color: "#7a7261" }}>
            © {new Date().getFullYear()} Insurely. All rights reserved.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a55c", display: "inline-block" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 11 : 12, color: "#7a7261" }}>Licensed by IRA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
