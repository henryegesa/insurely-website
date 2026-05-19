import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { useReveal } from "../hooks/useReveal";
import { useBreakpoint } from "../hooks/useBreakpoint";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
      opacity: 0.4,
      pointerEvents: "none",
    }}
  >
    {[80, 150, 220, 300, 380, 460].map((r) => (
      <circle key={r} cx="450" cy="450" r={r} stroke="#c9a55c" strokeWidth="1" />
    ))}
  </svg>
);

export default function CTASection() {
  const { isSmall, isMobile, isTablet } = useBreakpoint();
  const navigate = useNavigate();
  const ref0 = useReveal(0);
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return;
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) return;
    setStatus("loading");
    try {
      const { error } = await supabase.from("pending_verifications").insert([{ email: trimmed }]);
      if (error) {
        setStatus(error.code === "23505" ? "duplicate" : "error");
      } else {
        navigate("/confirmation");
      }
    } catch {
      setStatus("error");
    }
  };

  const sectionPad = isSmall ? "64px 16px" : isMobile ? "80px 20px" : isTablet ? "80px 32px" : "100px 48px";

  return (
    <section
      style={{
        background: "#0a0907",
        padding: sectionPad,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid #2a2218",
      }}
    >
      <ConcentricCircles />
      <div ref={ref0} className="reveal" style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 28, height: 1, background: "#c9a55c" }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 9 : 11, letterSpacing: isSmall ? 2 : 4, color: "#c9a55c", fontWeight: 600 }}>
            {isSmall ? "JOIN THE LIST" : "JOIN THE EARLY ACCESS LIST"}
          </span>
          <div style={{ width: 28, height: 1, background: "#c9a55c" }} />
        </div>

        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: isSmall ? 44 : isMobile ? 56 : isTablet ? 68 : 88,
            fontWeight: 400,
            color: "#f5f1e8",
            lineHeight: 1.05,
            marginBottom: 20,
          }}
        >
          Be first{" "}
          <em style={{ color: "#c9a55c", fontStyle: "italic" }}>at launch.</em>
        </h2>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 14 : 16, color: "#b8b1a3", lineHeight: 1.7, marginBottom: 36 }}>
          Join the waitlist for early access to motor insurance through licensed insurance partners — faster, clearer, and fully digital.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: isSmall || isMobile ? "column" : "row",
            gap: 0,
            maxWidth: 500,
            margin: "0 auto",
          }}
        >
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            style={{
              flex: 1,
              padding: isSmall ? "13px 14px" : "15px 18px",
              background: "transparent",
              border: "1px solid #3a2f1c",
              borderBottom: (isSmall || isMobile) ? "none" : undefined,
              borderRight: !(isSmall || isMobile) ? "none" : undefined,
              color: "#f5f1e8",
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              outline: "none",
              boxSizing: "border-box",
              width: "100%",
              opacity: status === "loading" ? 0.6 : 1,
            }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              padding: isSmall ? "13px 0" : "15px 24px",
              background: "#c9a55c",
              color: "#0a0907",
              fontFamily: "'Inter', sans-serif",
              fontSize: isSmall ? 11 : 12,
              letterSpacing: 2,
              fontWeight: 700,
              border: "none",
              cursor: status === "loading" ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              width: (isSmall || isMobile) ? "100%" : "auto",
              flexShrink: 0,
              opacity: status === "loading" ? 0.7 : 1,
            }}
          >
            {status === "loading" ? "JOINING..." : "JOIN THE WAITLIST →"}
          </button>
        </form>
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: "none" }}
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
        />

        {status === "duplicate" && <p style={{ color: "#c9a55c", fontSize: 13, marginTop: 14 }}>That email is already on the waitlist.</p>}
        {status === "error" && <p style={{ color: "#b8b1a3", fontSize: 13, marginTop: 14 }}>Something went wrong. Please try again.</p>}

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 11 : 12, color: "#7a7261", marginTop: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7ec48c", display: "inline-block", flexShrink: 0 }} />
          No spam. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
