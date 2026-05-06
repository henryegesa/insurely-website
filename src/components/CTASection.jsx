import { useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { useBreakpoint } from "../hooks/useBreakpoint";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const ref = useReveal();
  const { isMobile } = useBreakpoint();

  return (
    <section style={{
      background: "var(--dark)",
      padding: isMobile ? "100px 20px" : "160px 32px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 400,
        background: "radial-gradient(ellipse at center, rgba(212,168,83,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute", top: 0, left: "10%", right: "10%",
        height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
        opacity: 0.2,
      }} />

      <div ref={ref} className="reveal" style={{
        maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative",
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 3,
          textTransform: "uppercase", color: "var(--gold)", marginBottom: 28,
        }}>
          Join thousands of Kenyan drivers
        </div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: isMobile ? "clamp(36px, 9vw, 56px)" : "clamp(44px, 6vw, 72px)",
          fontWeight: 600, color: "var(--text)",
          lineHeight: 1.03, letterSpacing: -1.5,
          marginBottom: 24,
        }}>
          Ready to get covered?
        </h2>

        <p style={{
          fontSize: 14, color: "var(--text-muted)",
          lineHeight: 1.85, marginBottom: 48,
          maxWidth: 400, margin: "0 auto 48px",
        }}>
          Download the app or join our waitlist today. Insurance that respects your time and your money.
        </p>

        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          maxWidth: 460, margin: "0 auto 24px",
        }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            style={{
              flex: 1, padding: "17px 20px", fontSize: 13,
              border: "1px solid rgba(212,168,83,0.2)",
              borderRight: isMobile ? "1px solid rgba(212,168,83,0.2)" : "none",
              borderBottom: isMobile ? "none" : undefined,
              background: "rgba(212,168,83,0.04)",
              color: "var(--text)", outline: "none",
              width: isMobile ? "100%" : "auto",
            }}
          />
          <button
            className="waitlist-btn"
            style={{
              padding: "17px 28px", fontSize: 10, fontWeight: 700,
              letterSpacing: 1.5, textTransform: "uppercase",
              background: "transparent",
              color: "var(--gold)",
              border: "1px solid rgba(212,168,83,0.2)",
              whiteSpace: "nowrap",
              width: isMobile ? "100%" : "auto",
            }}
          >
            Join waitlist
          </button>
        </div>

        <div style={{
          fontSize: 11, color: "var(--text-dim)",
          fontWeight: 500, letterSpacing: 0.3,
        }}>
          No spam, ever. Unsubscribe anytime.
        </div>
      </div>
    </section>
  );
}
