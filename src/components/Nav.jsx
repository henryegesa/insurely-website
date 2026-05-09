import { useState, useEffect } from "react";
import { useBreakpoint } from "../hooks/useBreakpoint";

export default function Nav({ page, setPage }) {
  const { isMobile } = useBreakpoint();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isMobile ? "0 20px" : "0 48px",
    height: 72,
    background: scrolled ? "rgba(10,9,7,0.96)" : "transparent",
    backdropFilter: scrolled ? "blur(24px)" : "none",
    borderBottom: scrolled ? "1px solid #2a2218" : "1px solid transparent",
    transition: "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
  };

  const logoStyle = {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 22,
    letterSpacing: 6,
    color: "#c9a55c",
    cursor: "pointer",
    fontWeight: 400,
  };

  const links = ["Home", "About", "FAQ"];

  return (
    <>
      <nav style={navStyle}>
        <span style={logoStyle} onClick={() => setPage("Home")}>INSURELY</span>

        {isMobile ? (
          <button
            onClick={() => setMenuOpen(true)}
            style={{ color: "#f5f1e8", fontSize: 24, background: "none", border: "none", cursor: "pointer" }}
          >
            ☰
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
            {links.map((l) => (
              <span
                key={l}
                onClick={() => setPage(l)}
                className="nav-link"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  letterSpacing: 3,
                  fontWeight: 500,
                  color: page === l ? "#c9a55c" : "#f5f1e8",
                  textTransform: "uppercase",
                }}
              >
                {l}
              </span>
            ))}
            <button
              onClick={() => setPage("Home")}
              className="nav-cta"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                letterSpacing: 3,
                fontWeight: 500,
                color: "#c9a55c",
                border: "1px solid #c9a55c",
                background: "transparent",
                padding: "12px 24px",
                textTransform: "uppercase",
              }}
            >
              JOIN WAITLIST
            </button>
          </div>
        )}
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "rgba(10,9,7,0.98)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            style={{ position: "absolute", top: 24, right: 24, color: "#f5f1e8", fontSize: 28, background: "none", border: "none", cursor: "pointer" }}
          >
            ✕
          </button>
          <span style={logoStyle}>INSURELY</span>
          {links.map((l) => (
            <span
              key={l}
              onClick={() => { setPage(l); setMenuOpen(false); }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                letterSpacing: 4,
                fontWeight: 500,
                color: page === l ? "#c9a55c" : "#f5f1e8",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {l}
            </span>
          ))}
          <button
            onClick={() => { setPage("Home"); setMenuOpen(false); }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              letterSpacing: 3,
              fontWeight: 500,
              color: "#c9a55c",
              border: "1px solid #c9a55c",
              background: "transparent",
              padding: "14px 32px",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            JOIN WAITLIST
          </button>
        </div>
      )}
    </>
  );
}
