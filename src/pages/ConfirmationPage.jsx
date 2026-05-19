import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { useBreakpoint } from "../hooks/useBreakpoint";

const ConcentricCircles = () => (
  <svg
    width="900"
    height="900"
    viewBox="0 0 900 900"
    fill="none"
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      opacity: 0.06,
      pointerEvents: "none",
    }}
  >
    {[80, 160, 240, 320, 400].map((r) => (
      <circle key={r} cx="450" cy="450" r={r} stroke="#c9a55c" strokeWidth="1" />
    ))}
  </svg>
);

const REFERRAL_URL = "insurely.co.ke";

function fireConfetti() {
  const gold = "#c9a55c";
  const cream = "#f5f1e8";
  const green = "#7ec48c";

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.55, x: 0.4 },
    colors: [gold, cream, green],
    disableForReducedMotion: true,
  });
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.55, x: 0.6 },
      colors: [gold, cream, green],
      disableForReducedMotion: true,
    });
  }, 200);
}

export default function ConfirmationPage() {
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(fireConfetti, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(REFERRAL_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const joinedDate = new Date().toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ background: "#0a0907", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <ConcentricCircles />

      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 20px" : "0 48px", height: 64, borderBottom: "1px solid #2a2218", position: "relative", zIndex: 10 }}>
        <span
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 18 : 22, letterSpacing: 6, color: "#c9a55c", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          INSURELY
        </span>
        <button
          onClick={() => navigate("/")}
          style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 2, color: "#9b9485", background: "none", border: "none", cursor: "pointer" }}
        >
          ← BACK TO HOME
        </button>
      </nav>

      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: isMobile ? "48px 20px" : "72px 48px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            border: "1px solid #c9a55c",
            background: "rgba(201,165,92,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
            <path d="M14 24 L21 31 L34 17" stroke="#c9a55c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ width: 32, height: 1, background: "#c9a55c" }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>YOU'RE ON THE LIST</span>
          <div style={{ width: 32, height: 1, background: "#c9a55c" }} />
        </div>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 48 : 76, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.05, marginBottom: 24 }}>
          Welcome to{" "}
          <em style={{ color: "#c9a55c", fontStyle: "italic" }}>Insurely.</em>
        </h1>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 15 : 16, color: "#b8b1a3", lineHeight: 1.75, marginBottom: 36 }}>
          You're on the early access list. When we launch in Q3 2026, you'll be among the first to know.
        </p>

        <div style={{ border: "1px solid #2a2218", padding: isMobile ? 20 : 28, marginBottom: 40, textAlign: "left" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 3, color: "#7a7261", marginBottom: 14 }}>SPREAD THE WORD</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#b8b1a3", lineHeight: 1.65, marginBottom: 18 }}>
            Know someone who needs motor insurance? Share Insurely:
          </p>
          <div style={{ display: "flex", marginBottom: 16 }}>
            <div
              style={{
                flex: 1,
                padding: "11px 14px",
                border: "1px solid #3a2f1c",
                borderRight: "none",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: "#7a7261",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}
            >
              {REFERRAL_URL}
            </div>
            <button
              onClick={handleCopy}
              style={{
                padding: "11px 18px",
                background: "#c9a55c",
                color: "#0a0907",
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                letterSpacing: 2,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {copied ? "COPIED!" : "COPY"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "WHATSAPP", href: `https://wa.me/?text=I%20just%20joined%20the%20Insurely%20waitlist%20%E2%80%94%20motor%20insurance%20in%20Kenya%2C%20simplified%3A%20https%3A%2F%2F${REFERRAL_URL}` },
              { label: "X / TWITTER", href: `https://x.com/intent/tweet?text=I%20just%20joined%20the%20%40insurelyke%20waitlist.%20Motor%20insurance%20in%20Kenya%2C%20simplified%3A%20https%3A%2F%2F${REFERRAL_URL}` },
              { label: "EMAIL", href: `mailto:?subject=Join%20the%20Insurely%20waitlist&body=I%20just%20joined%20Insurely%20%E2%80%94%20check%20it%20out%3A%20https%3A%2F%2F${REFERRAL_URL}` },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 2, color: "#9b9485", border: "1px solid #3a2f1c", padding: "10px 14px" }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 28 }}>
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", marginBottom: 6 }}>WAVE 1 OPENS</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#f5f1e8" }}>Q3 2026</p>
          </div>
          <div style={{ width: 1, height: 40, background: "#2a2218" }} />
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", marginBottom: 6 }}>JOINED</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#f5f1e8" }}>{joinedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
