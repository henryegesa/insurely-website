import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { useReveal } from "../hooks/useReveal";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const COVERS = [
  { id: "tpo", label: "TPO", price: "KES 3,200/yr" },
  { id: "tpp", label: "TPP", price: "KES 5,800/yr" },
  { id: "comp", label: "Comprehensive", price: "KES 12,400/yr" },
];

const ConcentricCircles = () => (
  <svg
    width="600"
    height="600"
    viewBox="0 0 600 600"
    fill="none"
    style={{ position: "absolute", right: -80, top: "50%", transform: "translateY(-50%)", opacity: 0.07, pointerEvents: "none" }}
  >
    {[60, 120, 180, 240, 300].map((r) => (
      <circle key={r} cx="300" cy="300" r={r} stroke="#c9a55c" strokeWidth="1" />
    ))}
  </svg>
);

export default function Hero({ setPage }) {
  const { isSmall, isMobile, isTablet } = useBreakpoint();
  const ref1 = useReveal(0);
  const ref2 = useReveal(150);

  const [cover, setCover] = useState("comp");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return;
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const { error } = await supabase.from("pending_verifications").insert([{ email }]);
      if (error) {
        setStatus(error.code === "23505" ? "duplicate" : "error");
      } else {
        setStatus("success");
        setEmail("");
        if (setPage) setPage("Confirmation");
      }
    } catch {
      setStatus("error");
    }
  };

  const avatars = [
    { initials: "WK", bg: "#c9a55c" },
    { initials: "JM", bg: "#7ec48c" },
    { initials: "AN", bg: "#a08fd4" },
  ];

  const h1Size = isSmall ? 40 : isMobile ? 52 : isTablet ? 68 : 88;
  const padH = isSmall ? "0 16px" : isMobile ? "0 20px" : "0 48px";

  return (
    <section
      style={{
        minHeight: "100vh",
        background: "#0a0907",
        paddingTop: 64,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <ConcentricCircles />

      {/* Main grid */}
      <div
        style={{
          flex: 1,
          maxWidth: 1200,
          margin: "0 auto",
          padding: isSmall ? "40px 16px 110px" : isMobile ? "52px 20px 110px" : isTablet ? "60px 32px 110px" : "80px 48px 110px",
          display: "grid",
          gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr",
          gap: isTablet ? 40 : 80,
          alignItems: "center",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Left column */}
        <div ref={ref1} className="reveal">
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: isSmall ? 20 : 28 }}>
            <div style={{ width: 28, height: 1, background: "#c9a55c", flexShrink: 0 }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 9 : 11, letterSpacing: isSmall ? 2 : 4, color: "#c9a55c", fontWeight: 600 }}>
              LAUNCHING IN KENYA · Q3 2026
            </span>
          </div>

          {/* H1 */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: h1Size,
              fontWeight: 400,
              lineHeight: 1.05,
              color: "#f5f1e8",
              marginBottom: isSmall ? 20 : 28,
            }}
          >
            Private motor insurance,{" "}
            <em style={{ color: "#c9a55c", fontStyle: "italic" }}>reimagined</em>
          </h1>

          {/* Lede */}
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 14 : 16, lineHeight: 1.7, color: "#b8b1a3", marginBottom: isSmall ? 24 : 36, maxWidth: 480 }}>
            Kenya's digital insurance distribution platform. Compare cover from IRA-licensed insurers, request a quote online, and get your certificate delivered digitally — without the paperwork.
          </p>

          {/* Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: isSmall ? 8 : 12, marginBottom: isSmall ? 24 : 36 }}>
            {[
              { dot: "#7ec48c", label: "PAY VIA M-PESA OR AIRTEL MONEY" },
              { dot: "#c9a55c", label: "IRA REGULATED" },
            ].map(({ dot, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, padding: isSmall ? "8px 12px" : "10px 16px", border: "1px solid #2a2218" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot, display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 9 : 11, letterSpacing: isSmall ? 1 : 3, color: "#b8b1a3", fontWeight: 600 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex" }}>
              {avatars.map((a, i) => (
                <div
                  key={i}
                  style={{
                    width: isSmall ? 28 : 34,
                    height: isSmall ? 28 : 34,
                    borderRadius: "50%",
                    background: a.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: isSmall ? 10 : 12,
                    fontWeight: 700,
                    color: "#0a0907",
                    marginLeft: i > 0 ? -8 : 0,
                    border: "2px solid #0a0907",
                    flexShrink: 0,
                  }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 11 : 13, color: "#9b9485" }}>
              1,247 drivers on the list · Q3 2026
            </span>
          </div>

          {/* Email form — shown on mobile/tablet */}
          {isTablet && (
            <form onSubmit={handleSubmit} style={{ marginTop: isSmall ? 28 : 36 }}>
              <div style={{ display: "flex", flexDirection: isSmall ? "column" : "row" }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: isSmall ? "12px 14px" : "14px 16px",
                    background: "transparent",
                    border: "1px solid #3a2f1c",
                    borderBottom: isSmall ? "none" : undefined,
                    borderRight: isSmall ? "1px solid #3a2f1c" : "none",
                    color: "#f5f1e8",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    minWidth: 0,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: isSmall ? "12px 0" : "14px 20px",
                    background: "#c9a55c",
                    color: "#0a0907",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: isSmall ? 11 : 12,
                    letterSpacing: 2,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    width: isSmall ? "100%" : "auto",
                  }}
                >
                  SEND ME MORE INFO →
                </button>
              </div>
              <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: "none" }} tabIndex={-1} />
              {status === "success"   && <p style={{ color: "#7ec48c", fontSize: 13, marginTop: 10 }}>You're on the list! Check your inbox.</p>}
              {status === "duplicate" && <p style={{ color: "#c9a55c", fontSize: 13, marginTop: 10 }}>That email is already on the waitlist.</p>}
              {status === "error"     && <p style={{ color: "#b8b1a3", fontSize: 13, marginTop: 10 }}>Something went wrong. Please try again.</p>}
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#7a7261", marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7ec48c", display: "inline-block", flexShrink: 0 }} />
                No spam. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>

        {/* Right column — desktop only */}
        {!isTablet && (
          <div ref={ref2} className="reveal delay-2">
            {/* Quote card */}
            <div
              style={{
                background: "linear-gradient(180deg, #15110a 0%, #100d07 100%)",
                border: "1px solid #2a2218",
                padding: 32,
                marginBottom: 16,
              }}
            >
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 3, color: "#7a7261", marginBottom: 16 }}>
                GET A QUOTE IN 60 SECONDS
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#9b9485", marginBottom: 20 }}>
                This is what early-access members will see.
              </p>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 3, color: "#7a7261", display: "block", marginBottom: 8 }}>
                  VEHICLE REGISTRATION
                </label>
                <input
                  readOnly
                  value="KZZ 005F"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "transparent",
                    border: "1px solid #3a2f1c",
                    color: "#7a7261",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 16,
                    letterSpacing: 2,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 3, color: "#7a7261", display: "block", marginBottom: 8 }}>
                  COVER TYPE
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {COVERS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCover(c.id)}
                      style={{
                        flex: 1,
                        padding: "12px 4px",
                        background: cover === c.id ? "rgba(201,165,92,0.06)" : "transparent",
                        border: cover === c.id ? "1px solid #c9a55c" : "1px solid #3a2f1c",
                        color: cover === c.id ? "#c9a55c" : "#9b9485",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11,
                        letterSpacing: 1,
                        fontWeight: 600,
                        cursor: "pointer",
                        textAlign: "center",
                        minWidth: 0,
                      }}
                    >
                      <div>{c.label}</div>
                      <div style={{ fontSize: 10, color: "#7a7261", marginTop: 4, fontWeight: 400 }}>{c.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: "12px 16px", background: "rgba(42,34,24,0.4)", border: "1px solid #2a2218" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7a7261", lineHeight: 1.6 }}>
                  🔒 Quotes go live at launch. Join the waitlist below to be first in.
                </p>
              </div>
            </div>

            {/* Desktop email form */}
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex" }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "14px 16px",
                    background: "transparent",
                    border: "1px solid #3a2f1c",
                    borderRight: "none",
                    color: "#f5f1e8",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    outline: "none",
                    minWidth: 0,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "14px 20px",
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
                  SEND ME MORE INFO →
                </button>
              </div>
              <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: "none" }} tabIndex={-1} />
              {status === "success"   && <p style={{ color: "#7ec48c", fontSize: 13, marginTop: 10 }}>You're on the list! Check your inbox.</p>}
              {status === "duplicate" && <p style={{ color: "#c9a55c", fontSize: 13, marginTop: 10 }}>That email is already on the waitlist.</p>}
              {status === "error"     && <p style={{ color: "#b8b1a3", fontSize: 13, marginTop: 10 }}>Something went wrong. Please try again.</p>}
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#7a7261", marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7ec48c", display: "inline-block", flexShrink: 0 }} />
                No spam. Unsubscribe at any time. IRA regulated.
              </p>
            </form>
          </div>
        )}
      </div>

      {/* Carriers strip */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: "1px solid #2a2218",
          background: "rgba(10,9,7,0.9)",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", padding: isSmall ? "10px 16px 4px" : isMobile ? "12px 20px 4px" : "16px 48px 4px", gap: isSmall ? 12 : 20 }}>
          {!isSmall && (
            <>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 9,
                  letterSpacing: 2,
                  color: "#4a4235",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  fontWeight: 600,
                }}
              >
                {isMobile ? "INSURER PARTNERS" : "PARTNERING WITH KENYA'S LEADING CARRIERS"}
              </span>
              <div style={{ width: 1, height: 16, background: "#2a2218", flexShrink: 0 }} />
            </>
          )}
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div className="carriers-track">
              {["BRITAM", "JUBILEE", "CIC", "APA", "HERITAGE", "MADISON", "OLD MUTUAL",
                "BRITAM", "JUBILEE", "CIC", "APA", "HERITAGE", "MADISON", "OLD MUTUAL"].map((name, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: isSmall ? 11 : isMobile ? 13 : 15,
                    letterSpacing: isSmall ? 2 : 4,
                    color: "#6a5e4a",
                    whiteSpace: "nowrap",
                    padding: isSmall ? "0 16px" : "0 28px",
                    display: "inline-block",
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* Carrier disclaimer */}
        <div style={{ padding: isSmall ? "4px 16px 10px" : isMobile ? "4px 20px 12px" : "4px 48px 14px" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#3a2f1c" }}>
            Insurer partnerships subject to agreement. All insurers on the platform will be IRA-licensed.
          </span>
        </div>
      </div>
    </section>
  );
}
