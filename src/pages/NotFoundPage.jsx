import { useNavigate } from "react-router-dom";
import { useBreakpoint } from "../hooks/useBreakpoint";

export default function NotFoundPage() {
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();

  return (
    <div style={{ background: "#0a0907", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 24px" : "0 48px", height: 72, borderBottom: "1px solid #2a2218" }}>
        <span
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, letterSpacing: 6, color: "#c9a55c", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          INSURELY
        </span>
        <button
          onClick={() => navigate("/")}
          style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 3, color: "#c9a55c", border: "1px solid #c9a55c", background: "transparent", padding: "10px 20px", cursor: "pointer" }}
        >
          JOIN WAITLIST
        </button>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "48px 24px 80px" : "60px 48px 100px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 120 : 200, color: "#3a2f1c", lineHeight: 1, marginBottom: -20, fontWeight: 400, userSelect: "none" }}>
          404
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>PAGE NOT FOUND</span>
          <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
        </div>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 40 : 64, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.15, marginBottom: 24 }}>
          Looks like this{" "}
          <em style={{ color: "#c9a55c", fontStyle: "italic" }}>route</em>{" "}
          isn't covered.
        </h1>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#b8b1a3", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 48px" }}>
          The page you're looking for doesn't exist. It may have moved, or you may have followed a broken link.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 40 }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "16px 32px",
              background: "#c9a55c",
              color: "#0a0907",
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              letterSpacing: 3,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            BACK TO HOME →
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7a7261", letterSpacing: 2 }}>OR JUMP TO</span>
          {[
            { label: "About", path: "/about" },
            { label: "FAQ", path: "/faq" },
            { label: "Contact", path: "/contact" },
          ].map((link, i) => (
            <span key={link.label}>
              {i > 0 && <span style={{ color: "#3a2f1c", margin: "0 4px" }}>·</span>}
              <button
                onClick={() => navigate(link.path)}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#c9a55c", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {link.label}
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
