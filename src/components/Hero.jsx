import { useState } from "react";

const STATS = [
  { num: "3 min",  label: "Average time to get covered" },
  { num: "100%",   label: "Direct M-Pesa to insurer" },
  { num: "IRA",    label: "Licensed & regulated" },
];

export default function Hero() {
  const [email, setEmail] = useState("");

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

      {/* Geometric arc — right side decoration */}
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

      {/* Ghost headline — decorative */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", bottom: -24, left: -8,
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(100px,16vw,210px)",
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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", width: "100%", position: "relative" }}>
        <div style={{ maxWidth: 680 }}>

          {/* Eyebrow */}
          <div className="fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 36,
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
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(50px, 7vw, 90px)",
            fontWeight: 600, lineHeight: 1.03,
            letterSpacing: -2, color: "var(--text)",
            marginBottom: 32,
          }}>
            Private motor<br />
            insurance,{" "}
            <em style={{ color: "var(--gold)", fontStyle: "italic" }}>reimagined</em>
            <br />for Kenya.
          </h1>

          {/* Subheading */}
          <p className="fade-up delay-2" style={{
            fontSize: 15, lineHeight: 1.85,
            color: "var(--text-muted)",
            maxWidth: 420, marginBottom: 52,
            fontWeight: 400,
          }}>
            Get covered in minutes with instant policy issuance, transparent
            pricing, and payments made directly to the insurer via M-Pesa.
          </p>

          {/* CTAs */}
          <div className="fade-up delay-3" style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "stretch" }}>

            {/* Google Play */}
            <a
              href="#"
              className="play-btn"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "var(--gold)", color: "var(--dark)",
                padding: "15px 28px",
                fontWeight: 700, fontSize: 11, letterSpacing: 1.5,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              <svg width="18" height="20" viewBox="0 0 20 22" fill="none">
                <path d="M1 1.6L11.2 11 1 20.4V1.6z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                <path d="M11.2 11L15.8 6.8 4 1l7.2 10z" fill="currentColor" opacity="0.7"/>
                <path d="M11.2 11L4 21l11.8-5.8-4.6-4.2z" fill="currentColor" opacity="0.5"/>
                <path d="M15.8 6.8L18.2 9.5a1.8 1.8 0 010 3L15.8 15.2 11.2 11l4.6-4.2z" fill="currentColor" opacity="0.85"/>
              </svg>
              Google Play
            </a>

            {/* Waitlist */}
            <div style={{ display: "flex" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                style={{
                  padding: "15px 18px", fontSize: 13,
                  border: "1px solid rgba(212,168,83,0.2)", borderRight: "none",
                  background: "rgba(212,168,83,0.04)",
                  color: "var(--text)", outline: "none", width: 210,
                }}
              />
              <button
                className="waitlist-btn"
                style={{
                  padding: "15px 22px", fontSize: 10, fontWeight: 700,
                  letterSpacing: 1.5, textTransform: "uppercase",
                  background: "transparent",
                  color: "var(--gold)",
                  border: "1px solid rgba(212,168,83,0.2)",
                  whiteSpace: "nowrap",
                }}
              >
                Join waitlist
              </button>
            </div>

          </div>
        </div>

        {/* Stats row */}
        <div className="fade-up delay-4" style={{
          marginTop: 100,
          display: "flex", gap: 0,
          borderTop: "1px solid var(--border)",
          paddingTop: 40,
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              flex: 1,
              paddingLeft: i > 0 ? 40 : 0,
              paddingRight: i < 2 ? 40 : 0,
              borderRight: i < 2 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 42, fontWeight: 600,
                color: "var(--gold)", lineHeight: 1, marginBottom: 10,
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
