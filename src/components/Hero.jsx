import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useBreakpoint } from "../hooks/useBreakpoint";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const STATS = [
  { num: "3 min",  label: "Average time to get covered" },
  { num: "100%",   label: "Payments directly to the insurer" },
  { num: "IRA",    label: "Licensed & regulated" },
];

export default function Hero() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [honeypot, setHoneypot] = useState("");
  const { isMobile, isTablet } = useBreakpoint();

  async function handleWaitlist() {
    // Silent bot rejection
    if (honeypot) { setStatus("success"); return; }
    // Stricter email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return;
    setStatus("loading");
    const { error } = await supabase.from("pending_verifications").insert({ email });
    if (!error) {
      setStatus("success");
      setEmail("");
    } else if (error.code === "23505") {
      setStatus("duplicate");
    } else {
      setStatus("error");
    }
  }

  return (
    <section style={{
      minHeight: "100vh",
      background: "var(--dark)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      paddingTop: 72,
    }}>

      {/* Radial glow */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "60%", height: "100%",
        background: "radial-gradient(ellipse 80% 70% at 80% 30%, rgba(212,168,83,0.055) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Geometric arc */}
      {!isMobile && (
        <svg
          aria-hidden="true"
          style={{
            position: "absolute", right: "-4vw", top: "50%",
            transform: "translateY(-50%)",
            width: "46vw", height: "78vh",
            opacity: 0.07,
            pointerEvents: "none",
          }}
          viewBox="0 0 460 580" fill="none"
        >
          <circle cx="460" cy="290" r="260" stroke="#D4A853" strokeWidth="0.8" />
          <circle cx="460" cy="290" r="190" stroke="#D4A853" strokeWidth="0.5" />
          <circle cx="460" cy="290" r="330" stroke="#D4A853" strokeWidth="0.4" />
          <line x1="0" y1="290" x2="460" y2="290" stroke="#D4A853" strokeWidth="0.5" />
          <line x1="460" y1="0" x2="460" y2="580" stroke="#D4A853" strokeWidth="0.5" />
          <line x1="90" y1="30" x2="460" y2="290" stroke="#D4A853" strokeWidth="0.3" />
          <line x1="90" y1="550" x2="460" y2="290" stroke="#D4A853" strokeWidth="0.3" />
        </svg>
      )}

      {/* Ghost headline */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", bottom: -24, left: -8,
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(80px,16vw,210px)",
          fontWeight: 700,
          color: "transparent",
          WebkitTextStroke: "1px rgba(212,168,83,0.045)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          letterSpacing: -4,
          whiteSpace: "nowrap",
        }}
      >
        INSURELY
      </div>

      {/* Main content */}
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: isMobile ? "40px 20px" : "0 32px",
        width: "100%", position: "relative",
      }}>
        <div style={{ maxWidth: 680 }}>

          {/* Eyebrow */}
          <div className="fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 14,
            marginBottom: isMobile ? 24 : 36,
          }}>
            <div style={{ width: 36, height: 1, background: "var(--gold)", opacity: 0.5 }} />
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 3,
              textTransform: "uppercase", color: "var(--gold)",
            }}>
              IRA regulated · Trusted carriers
            </span>
          </div>

          {/* Headline */}
          <h1 className="fade-up delay-1" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(44px, 7vw, 90px)",
            fontWeight: 600, lineHeight: 1.05,
            letterSpacing: -2, color: "var(--text)",
            marginBottom: isMobile ? 20 : 32,
          }}>
            Private motor<br />
            <span style={{ whiteSpace: "nowrap" }}>insurance, <em style={{ color: "var(--gold)", fontStyle: "italic" }}>reimagined</em></span>
          </h1>

          {/* Subheading */}
          <p className="fade-up delay-2" style={{
            fontSize: isMobile ? 14 : 15, lineHeight: 1.85,
            color: "var(--text-muted)",
            maxWidth: isMobile ? "100%" : 420,
            marginBottom: isMobile ? 36 : 52,
            fontWeight: 400,
          }}>
            Get covered in minutes with instant policy issuance, transparent
            pricing, and payments made directly to the insurer via M-Pesa or Airtel Money.
          </p>

          {/* Waitlist CTA */}
          <div className="fade-up delay-3" style={{ position: "relative" }}>
            {/* Honeypot — hidden from humans, traps bots */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-9999px",
                width: 1,
                height: 1,
                opacity: 0,
                pointerEvents: "none",
              }}
            />
            {status === "success" ? (
              <div style={{
                padding: "15px 22px", fontSize: 12, fontWeight: 600,
                color: "var(--gold)", border: "1px solid rgba(212,168,83,0.2)",
                letterSpacing: 0.5, display: "inline-block",
              }}>
                Check your inbox — we sent you a confirmation link.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 0 : 0,
                }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                    onKeyDown={(e) => e.key === "Enter" && handleWaitlist()}
                    placeholder="Your email address"
                    style={{
                      padding: "15px 18px", fontSize: 13,
                      border: "1px solid rgba(212,168,83,0.2)",
                      borderRight: isMobile ? "1px solid rgba(212,168,83,0.2)" : "none",
                      borderBottom: isMobile ? "none" : "1px solid rgba(212,168,83,0.2)",
                      background: "rgba(212,168,83,0.04)",
                      color: "var(--text)", outline: "none",
                      width: isMobile ? "100%" : 230,
                    }}
                  />
                  <button
                    className="waitlist-btn"
                    onClick={handleWaitlist}
                    disabled={status === "loading"}
                    style={{
                      padding: "15px 22px", fontSize: 10, fontWeight: 700,
                      letterSpacing: 1.5, textTransform: "uppercase",
                      background: "transparent",
                      color: "var(--gold)",
                      border: "1px solid rgba(212,168,83,0.2)",
                      whiteSpace: "nowrap",
                      cursor: status === "loading" ? "wait" : "pointer",
                      width: isMobile ? "100%" : "auto",
                    }}
                  >
                    {status === "loading" ? "..." : "Join waitlist"}
                  </button>
                </div>
                {status === "duplicate" && (
                  <span style={{ fontSize: 11, color: "var(--gold)", opacity: 0.7 }}>
                    Check your inbox — you should have a confirmation link.
                  </span>
                )}
                {status === "error" && (
                  <span style={{ fontSize: 11, color: "#e57373" }}>
                    Something went wrong. Please try again.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="fade-up delay-4" style={{
          marginTop: isMobile ? 56 : 100,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 0,
          borderTop: "1px solid var(--border)",
          paddingTop: isMobile ? 32 : 40,
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              flex: 1,
              paddingLeft: isMobile ? 0 : (i > 0 ? 40 : 0),
              paddingRight: isMobile ? 0 : (i < 2 ? 40 : 0),
              paddingTop: isMobile && i > 0 ? 24 : 0,
              paddingBottom: isMobile && i < 2 ? 24 : 0,
              borderRight: !isMobile && i < 2 ? "1px solid var(--border)" : "none",
              borderBottom: isMobile && i < 2 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: isMobile ? 36 : 42, fontWeight: 600,
                color: "var(--gold)", lineHeight: 1, marginBottom: 8,
              }}>
                {s.num}
              </div>
              <div style={{
                fontSize: 11, color: "var(--text-muted)",
                fontWeight: 500, letterSpacing: 0.3,
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
