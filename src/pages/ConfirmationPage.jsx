import { useState } from "react";
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

const REFERRAL_URL = "insurely.co.ke/?r=KDA482M";

export default function ConfirmationPage({ setPage }) {
  const { isMobile } = useBreakpoint();
  const [copied, setCopied] = useState(false);

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

      {/* Minimal nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 24px" : "0 48px", height: 72, borderBottom: "1px solid #2a2218", position: "relative", zIndex: 10 }}>
        <span
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, letterSpacing: 6, color: "#c9a55c", cursor: "pointer" }}
          onClick={() => setPage("Home")}
        >
          INSURELY
        </span>
        <button
          onClick={() => setPage("Home")}
          style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 2, color: "#9b9485", background: "none", border: "none", cursor: "pointer" }}
        >
          ← BACK TO HOME
        </button>
      </nav>

      {/* Content */}
      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: isMobile ? "60px 24px" : "80px 48px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Gold check ring */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            border: "1px solid #c9a55c",
            background: "rgba(201,165,92,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 36px",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M14 24 L21 31 L34 17" stroke="#c9a55c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>YOU'RE ON THE LIST</span>
          <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
        </div>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 52 : 80, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.05, marginBottom: 28 }}>
          Welcome to{" "}
          <em style={{ color: "#c9a55c", fontStyle: "italic" }}>Insurely.</em>
        </h1>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#b8b1a3", lineHeight: 1.75, marginBottom: 48 }}>
          We've sent a confirmation to your inbox. You're driver #1,248 on the waitlist. When Wave 1 opens in Q3 2026, you'll be among the first to know.
        </p>

        {/* Referral box */}
        <div style={{ border: "1px solid #2a2218", padding: isMobile ? 24 : 32, marginBottom: 48, textAlign: "left" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 3, color: "#7a7261", marginBottom: 16 }}>JUMP THE QUEUE</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#b8b1a3", lineHeight: 1.65, marginBottom: 20 }}>
            Refer a friend and move up the list. Share your unique link:
          </p>
          <div style={{ display: "flex", gap: 0, marginBottom: 20 }}>
            <div
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid #3a2f1c",
                borderRight: "none",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: "#7a7261",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {REFERRAL_URL}
            </div>
            <button
              onClick={handleCopy}
              style={{
                padding: "12px 20px",
                background: "#c9a55c",
                color: "#0a0907",
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                letterSpacing: 2,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {copied ? "COPIED!" : "COPY"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a
              href={`https://wa.me/?text=I%20just%20joined%20the%20Insurely%20waitlist%20%E2%80%94%20insure%20your%20car%20in%20Kenya%20in%20under%203%20minutes%3A%20https%3A%2F%2F${REFERRAL_URL}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 2, color: "#9b9485", border: "1px solid #3a2f1c", padding: "10px 16px" }}
            >
              WHATSAPP
            </a>
            <a
              href={`https://x.com/intent/tweet?text=I%20just%20joined%20the%20%40insurelyke%20waitlist.%20Private%20motor%20insurance%20in%20Kenya%2C%20reimagined%3A%20https%3A%2F%2F${REFERRAL_URL}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 2, color: "#9b9485", border: "1px solid #3a2f1c", padding: "10px 16px" }}
            >
              X / TWITTER
            </a>
            <a
              href={`mailto:?subject=Join%20the%20Insurely%20waitlist&body=I%20just%20joined%20Insurely%20%E2%80%94%20check%20it%20out%3A%20https%3A%2F%2F${REFERRAL_URL}`}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 2, color: "#9b9485", border: "1px solid #3a2f1c", padding: "10px 16px" }}
            >
              EMAIL
            </a>
          </div>
        </div>

        {/* Meta */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 32 }}>
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
