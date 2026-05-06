import { useState, useEffect } from "react";
import { useBreakpoint } from "../hooks/useBreakpoint";

export default function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMobile } = useBreakpoint();
  const links = ["Home", "About", "FAQ"];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on nav
  function navigate(l) {
    setPage(l);
    setMenuOpen(false);
  }

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled || menuOpen ? "rgba(12,11,9,0.96)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "background 0.4s ease, border-color 0.4s ease",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 72,
        }}>
          {/* Wordmark */}
          <div
            onClick={() => navigate("Home")}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600, fontSize: 24,
              color: "var(--gold)",
              cursor: "pointer",
              letterSpacing: 3,
              textTransform: "uppercase",
              userSelect: "none",
            }}
          >
            Insurely
          </div>

          {/* Desktop links */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
              {links.map((l) => (
                <span
                  key={l}
                  onClick={() => navigate(l)}
                  className="nav-link"
                  style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: 2,
                    textTransform: "uppercase",
                    color: page === l ? "var(--gold)" : "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  {l}
                </span>
              ))}
              <button
                className="nav-cta"
                onClick={() => navigate("Home")}
                style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 2,
                  textTransform: "uppercase",
                  background: "transparent",
                  color: "var(--gold)",
                  border: "1px solid rgba(212,168,83,0.35)",
                  padding: "10px 22px",
                }}
              >
                Get the app
              </button>
            </div>
          )}

          {/* Hamburger */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                background: "transparent", border: "none",
                cursor: "pointer", padding: 8,
                display: "flex", flexDirection: "column",
                gap: 5, alignItems: "flex-end",
              }}
              aria-label="Toggle menu"
            >
              <span style={{
                display: "block", height: 1, background: "var(--gold)",
                width: menuOpen ? 24 : 24,
                transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none",
                transition: "transform 0.3s ease",
              }} />
              <span style={{
                display: "block", height: 1, background: "var(--gold)",
                width: 16,
                opacity: menuOpen ? 0 : 1,
                transition: "opacity 0.2s ease",
              }} />
              <span style={{
                display: "block", height: 1, background: "var(--gold)",
                width: 24,
                transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none",
                transition: "transform 0.3s ease",
              }} />
            </button>
          )}
        </div>

        {/* Mobile dropdown */}
        {isMobile && (
          <div style={{
            maxHeight: menuOpen ? 320 : 0,
            overflow: "hidden",
            transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
            borderTop: menuOpen ? "1px solid var(--border)" : "1px solid transparent",
          }}>
            <div style={{ padding: "24px 24px 32px", display: "flex", flexDirection: "column", gap: 0 }}>
              {links.map((l) => (
                <span
                  key={l}
                  onClick={() => navigate(l)}
                  style={{
                    fontSize: 13, fontWeight: 700, letterSpacing: 2,
                    textTransform: "uppercase",
                    color: page === l ? "var(--gold)" : "var(--text-muted)",
                    cursor: "pointer",
                    padding: "16px 0",
                    borderBottom: "1px solid var(--border)",
                    display: "block",
                  }}
                >
                  {l}
                </span>
              ))}
              <button
                onClick={() => navigate("Home")}
                style={{
                  marginTop: 20,
                  fontSize: 10, fontWeight: 700, letterSpacing: 2,
                  textTransform: "uppercase",
                  background: "var(--gold)", color: "var(--dark)",
                  border: "none", padding: "14px 0",
                  width: "100%", cursor: "pointer",
                }}
              >
                Get the app
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
