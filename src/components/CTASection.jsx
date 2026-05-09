import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useReveal } from "../hooks/useReveal";
import { useBreakpoint } from "../hooks/useBreakpoint";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ConcentricCircles = () => (
  <svg
    width="1100"
    height="1100"
    viewBox="0 0 1100 1100"
    fill="none"
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      opacity: 0.5,
      pointerEvents: "none",
    }}
  >
    {[100, 180, 260, 340, 420, 500].map((r) => (
      <circle key={r} cx="550" cy="550" r={r} stroke="#c9a55c" strokeWidth="1" />
    ))}
  </svg>
);

export default function CTASection({ setPage }) {
  const { isMobile } = useBreakpoint();
  const ref0 = useReveal(0);
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

  return (
    <section
      style={{
        background: "#0a0907",
        padding: isMobile ? "80px 24px" : "100px 48px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid #2a2218",
      }}
    >
      <ConcentricCircles />
      <div ref={ref0} className="reveal" style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 28 }}>
          <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>
            JOIN THOUSANDS OF KENYAN DRIVERS
          </span>
          <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
        </div>

        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: isMobile ? 52 : 88,
            fontWeight: 400,
            color: "#f5f1e8",
            lineHeight: 1.05,
            marginBottom: 28,
          }}
        >
          Ready to{" "}
          <em style={{ color: "#c9a55c", fontStyle: "italic" }}>get covered?</em>
        </h2>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: "#b8b1a3", lineHeight: 1.7, marginBottom: 40 }}>
          Join the waitlist today and be among the first Kenyan drivers to experience insurance the way it should be — fast, fair, and fully digital.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 0, maxWidth: 520, margin: "0 auto" }}>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: 1,
              padding: "16px 20px",
              background: "transparent",
              border: "1px solid #3a2f1c",
              borderRight: isMobile ? "1px solid #3a2f1c" : "none",
              color: "#f5f1e8",
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "16px 28px",
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
            JOIN WAITLIST →
          </button>
        </form>
        <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: "none" }} tabIndex={-1} />

        {status === "success" && <p style={{ color: "#7ec48c", fontSize: 13, marginTop: 14 }}>You're on the list! Check your inbox.</p>}
        {status === "duplicate" && <p style={{ color: "#c9a55c", fontSize: 13, marginTop: 14 }}>That email is already on the waitlist.</p>}
        {status === "error" && <p style={{ color: "#b8b1a3", fontSize: 13, marginTop: 14 }}>Something went wrong. Please try again.</p>}

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7a7261", marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7ec48c", display: "inline-block" }} />
          No spam. Unsubscribe at any time. IRA regulated.
        </p>
      </div>
    </section>
  );
}
