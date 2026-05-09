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
    width="700"
    height="700"
    viewBox="0 0 700 700"
    fill="none"
    style={{ position: "absolute", right: -100, top: "50%", transform: "translateY(-50%)", opacity: 0.07, pointerEvents: "none" }}
  >
    {[80, 150, 220, 290, 360].map((r) => (
      <circle key={r} cx="350" cy="350" r={r} stroke="#c9a55c" strokeWidth="1" />
    ))}
  </svg>
);

export default function Hero({ setPage }) {
  const { isMobile } = useBreakpoint();
  const ref1 = useReveal(0);
  const ref2 = useReveal(150);
  const ref3 = useReveal(300);

  const [cover, setCover] = useState("comp");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState(null); // null | "success" | "duplicate" | "error" | "loading"

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return;
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const { error } = await supabase.from("pending_verifications").insert([{ email }]);
      if (error) {
        if (error.code === "23505") {
          setStatus("duplicate");
        } else {
          setStatus("error");
        }
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

  return (
    <section
      style={{
        minHeight: "100vh",
        background: "#0a0907",
        paddingTop: 72,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <ConcentricCircles />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isMobile ? "60px 24px" : "80px 48px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 48 : 80,
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Left column */}
        <div ref={ref1} className="reveal">
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>
              LAUNCHING IN KENYA · Q3 2026
            </span>
          </div>

          {/* H1 */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: isMobile ? 56 : 88,
              fontWeight: 400,
              lineHeight: 1.05,
              color: "#f5f1e8",
              marginBottom: 32,
            }}
          >
            Private motor insurance,{" "}
            <em style={{ color: "#c9a55c", fontStyle: "italic" }}>reimagined</em>
          </h1>

          {/* Lede */}
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, lineHeight: 1.7, color: "#b8b1a3", marginBottom: 40, maxWidth: 480 }}>
            We're building the fastest way to insure your car in Kenya. Quote, pay via M-Pesa or Airtel Money, drive covered — in under 3 minutes.
          </p>

          {/* Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", border: "1px solid #2a2218" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7ec48c", display: "inline-block" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 3, color: "#b8b1a3", fontWeight: 600 }}>
                PAY VIA M-PESA OR AIRTEL MONEY
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", border: "1px solid #2a2218" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#c9a55c", display: "inline-block" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 3, color: "#b8b1a3", fontWeight: 600 }}>
                IRA REGULATED
              </span>
            </div>
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex" }}>
              {avatars.map((a, i) => (
                <div
                  key={i}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: a.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#0a0907",
                    marginLeft: i > 0 ? -10 : 0,
                    border: "2px solid #0a0907",
                  }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#9b9485" }}>
              1,247 drivers already on the list · spots opening Q3 2026
            </span>
          </div>

          {/* Mobile email form */}
          {isMobile && (
            <form onSubmit={handleSubmit} style={{ marginTop: 40 }}>
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
                  }}
                >
                  RESERVE MY SPOT →
                </button>
              </div>
              <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: "none" }} tabIndex={-1} />
              {status === "success" && <p style={{ color: "#7ec48c", fontSize: 13, marginTop: 10 }}>You're on the list! Check your inbox.</p>}
              {status === "duplicate" && <p style={{ color: "#c9a55c", fontSize: 13, marginTop: 10 }}>That email is already on the waitlist.</p>}
              {status === "error" && <p style={{ color: "#b8b1a3", fontSize: 13, marginTop: 10 }}>Something went wrong. Please try again.</p>}
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#7a7261", marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7ec48c", display: "inline-block" }} />
                No spam. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>

        {/* Right column — hidden on mobile */}
        {!isMobile && (
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
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 3, color: "#7a7261", marginBottom: 24 }}>
                GET A QUOTE IN 60 SECONDS
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#9b9485", marginBottom: 20 }}>
                This is what early-access members will see.
              </p>

              {/* Registration input */}
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
                  }}
                />
              </div>

              {/* Cover type */}
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
                        padding: "12px 8px",
                        background: cover === c.id ? "rgba(201,165,92,0.06)" : "transparent",
                        border: cover === c.id ? "1px solid #c9a55c" : "1px solid #3a2f1c",
                        color: cover === c.id ? "#c9a55c" : "#9b9485",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11,
                        letterSpacing: 1,
                        fontWeight: 600,
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <div>{c.label}</div>
                      <div style={{ fontSize: 10, color: "#7a7261", marginTop: 4, fontWeight: 400 }}>{c.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Locked note */}
              <div style={{ padding: "12px 16px", background: "rgba(42,34,24,0.4)", border: "1px solid #2a2218" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7a7261", lineHeight: 1.6 }}>
                  🔒 Quotes go live at launch. Join the waitlist below to be first in.
                </p>
              </div>
            </div>

            {/* Email form */}
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
                  }}
                >
                  RESERVE MY SPOT →
                </button>
              </div>
              <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: "none" }} tabIndex={-1} />
              {status === "success" && <p style={{ color: "#7ec48c", fontSize: 13, marginTop: 10 }}>You're on the list! Check your inbox.</p>}
              {status === "duplicate" && <p style={{ color: "#c9a55c", fontSize: 13, marginTop: 10 }}>That email is already on the waitlist.</p>}
              {status === "error" && <p style={{ color: "#b8b1a3", fontSize: 13, marginTop: 10 }}>Something went wrong. Please try again.</p>}
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#7a7261", marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7ec48c", display: "inline-block" }} />
                No spam. Unsubscribe at any time. IRA regulated.
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
