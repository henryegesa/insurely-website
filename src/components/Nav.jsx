import { useState, useEffect } from "react";
import { useBreakpoint } from "../hooks/useBreakpoint";

export default function Nav({ page, setPage }) {
  const { isTablet } = useBreakpoint();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Home", page: "Home" },
    { label: "Motor Insurance", page: "Motor" },
    { label: "Partners", page: "Partners" },
    { label: "About", page: "About" },
    { label: "FAQ", page: "FAQ" },
    { label: "Contact", page: "Contact" },
  ];

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isTablet ? "0 20px" : "0 48px",
          height: 64,
          background: scrolled ? "rgba(10,9,7,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid #2a2218" : "1px solid transparent",
          transition: "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: isTablet ? 18 : 22,
            letterSpacing: 6,
            color: "#c9a55c",
            cursor: "pointer",
            fontWeight: 400,
          }}
          onClick={() => setPage("Home")}
        >
          INSURELY
        </span>

        {isTablet ? (
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{ color: "#f5f1e8", fontSize: 24, background: "none", border: "none", cursor: "pointer", padding: "8px", lineHeight: 1 }}
          >
            ☰
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {links.map((l) => (
              <span
                key={l.page}
                onClick={() => setPage(l.page)}
                className="nav-link"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  letterSpacing: 2,
                  fontWeight: 500,
                  color: page === l.page ? "#c9a55c" : "#f5f1e8",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {l.label}
              </span>
            ))}
            <button
              onClick={() => setPage("Quote")}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                letterSpacing: 2,
                fontWeight: 700,
                color: "#0a0907",
                background: "#c9a55c",
                border: "none",
                padding: "10px 20px",
                cursor: "pointer",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              GET A QUOTE
            </button>
          </div>
        )}
      </nav>

      {/* Full-screen menu overlay */}
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
            gap: 36,
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{ position: "absolute", top: 20, right: 20, color: "#f5f1e8", fontSize: 28, background: "none", border: "none", cursor: "pointer", padding: "8px" }}
          >
            ✕
          </button>
          <span
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, letterSpacing: 6, color: "#c9a55c", cursor: "pointer" }}
            onClick={() => { setPage("Home"); setMenuOpen(false); }}
          >
            INSURELY
          </span>
          {links.map((l) => (
            <span
              key={l.page}
              onClick={() => { setPage(l.page); setMenuOpen(false); }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                letterSpacing: 4,
                fontWeight: 500,
                color: page === l.page ? "#c9a55c" : "#f5f1e8",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {l.label}
            </span>
          ))}
          <button
            onClick={() => { setPage("Quote"); setMenuOpen(false); }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              letterSpacing: 3,
              fontWeight: 700,
              color: "#0a0907",
              background: "#c9a55c",
              border: "none",
              padding: "14px 32px",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            GET A QUOTE
          </button>
        </div>
      )}
    </>
  );
}
