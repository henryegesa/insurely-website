import { useState, useEffect } from "react";

export default function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const links = ["Home", "About", "FAQ"];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(12,11,9,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 72,
      }}>

        {/* Wordmark */}
        <div
          onClick={() => setPage("Home")}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
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

        {/* Links + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {links.map((l) => (
            <span
              key={l}
              onClick={() => setPage(l)}
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
            onClick={() => setPage("Home")}
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

      </div>
    </nav>
  );
}
