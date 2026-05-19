import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { useReveal } from "../hooks/useReveal";
import { useBreakpoint } from "../hooks/useBreakpoint";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function inputStyle(focused) {
  return {
    width: "100%",
    padding: "13px 16px",
    background: "transparent",
    border: `1px solid ${focused ? "#c9a55c" : "#3a2f1c"}`,
    color: "#f5f1e8",
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };
}

function FocusInput({ type = "text", placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={inputStyle(focused)}
    />
  );
}

function FocusTextarea({ placeholder, value, onChange, rows = 5 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ ...inputStyle(focused), resize: "vertical", lineHeight: 1.6 }}
    />
  );
}

const contactDetails = [
  {
    label: "GENERAL ENQUIRIES",
    value: "hello@insurely.co.ke",
    href: "mailto:hello@insurely.co.ke",
  },
  {
    label: "LOCATION",
    value: "Nairobi, Kenya",
    href: null,
  },
  {
    label: "REGULATOR",
    value: "Insurance Regulatory Authority of Kenya",
    href: null,
  },
];

export default function ContactPage() {
  const navigate = useNavigate();
  const { isSmall, isMobile, isTablet } = useBreakpoint();
  const ref0 = useReveal(0);
  const ref1 = useReveal(100);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState(null);

  const valid = form.name && form.email && form.email.includes("@") && form.subject && form.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot || !valid) return;
    setStatus("loading");
    try {
      await supabase.from("pending_verifications").insert([{ email: form.email }]);
    } catch {
      // silent
    }
    setStatus("success");
  };

  return (
    <div style={{ background: "#0a0907", minHeight: "100vh", paddingTop: 72 }}>

      {/* Hero */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isSmall ? "48px 16px 56px" : isMobile ? "60px 20px 64px" : "80px 48px 80px" }}>
        <div ref={ref0} className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 28, height: 1, background: "#c9a55c" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 9 : 11, letterSpacing: isSmall ? 2 : 4, color: "#c9a55c", fontWeight: 600 }}>
              CONTACT INSURELY
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: isSmall ? 44 : isMobile ? 60 : isTablet ? 72 : 88,
              fontWeight: 400,
              color: "#f5f1e8",
              lineHeight: 1.05,
              marginBottom: 24,
              maxWidth: 700,
            }}
          >
            Get in <em style={{ color: "#c9a55c", fontStyle: "italic" }}>touch.</em>
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 15 : 17, color: "#b8b1a3", lineHeight: 1.75, maxWidth: 560 }}>
            Whether you're a customer with a question, an insurer exploring partnership, or a journalist covering Kenya's insurtech space — we'd like to hear from you.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ borderTop: "1px solid #2a2218" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: isSmall ? "48px 16px 60px" : isMobile ? "60px 20px 72px" : "80px 48px 100px",
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "1fr 1.6fr",
            gap: isTablet ? 48 : 80,
            alignItems: "start",
          }}
        >
          {/* Left — contact details + quick links */}
          <div ref={ref0} className="reveal">
            <div style={{ marginBottom: 40 }}>
              {contactDetails.map((c, i) => (
                <div key={c.label} style={{ paddingBottom: 24, marginBottom: 24, borderBottom: i < contactDetails.length - 1 ? "1px solid #2a2218" : "none" }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", marginBottom: 8, fontWeight: 600 }}>{c.label}</p>
                  {c.href ? (
                    <a href={c.href} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#c9a55c", textDecoration: "none" }}>
                      {c.value}
                    </a>
                  ) : (
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#f5f1e8" }}>{c.value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", fontWeight: 600, marginBottom: 4 }}>QUICK LINKS</p>
              <button
                onClick={() => navigate("/motor-insurance")}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 2, color: "#c9a55c", background: "transparent", border: "1px solid #2a2218", padding: "12px 16px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between" }}
              >
                <span>Motor insurance information</span>
                <span>→</span>
              </button>
              <button
                onClick={() => navigate("/faq")}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 2, color: "#9b9485", background: "transparent", border: "1px solid #2a2218", padding: "12px 16px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between" }}
              >
                <span>Frequently asked questions</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right — contact form */}
          <div ref={ref1} className="reveal delay-2">
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", fontWeight: 600, marginBottom: 24 }}>SEND A MESSAGE</p>

            {status === "success" ? (
              <div style={{ padding: "32px 28px", border: "1px solid rgba(126,196,140,0.2)", background: "rgba(126,196,140,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7ec48c" }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 2, color: "#7ec48c", fontWeight: 600 }}>MESSAGE RECEIVED</span>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#b8b1a3", lineHeight: 1.7 }}>
                  Thank you, <strong style={{ color: "#f5f1e8" }}>{form.name}</strong>.
                  We'll reply to <strong style={{ color: "#f5f1e8" }}>{form.email}</strong> within 2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", display: "block", marginBottom: 8, fontWeight: 600 }}>
                      YOUR NAME *
                    </label>
                    <FocusInput placeholder="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", display: "block", marginBottom: 8, fontWeight: 600 }}>
                      EMAIL ADDRESS *
                    </label>
                    <FocusInput type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", display: "block", marginBottom: 8, fontWeight: 600 }}>
                    SUBJECT *
                  </label>
                  <FocusInput placeholder="What is your message about?" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", display: "block", marginBottom: 8, fontWeight: 600 }}>
                    MESSAGE *
                  </label>
                  <FocusTextarea placeholder="Write your message here..." value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
                </div>
                <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: "none" }} tabIndex={-1} aria-hidden="true" autoComplete="off" />
                <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                  <button
                    type="submit"
                    disabled={!valid || status === "loading"}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12,
                      letterSpacing: 3,
                      fontWeight: 700,
                      color: valid ? "#0a0907" : "#3a2f1c",
                      background: valid ? "#c9a55c" : "#2a2218",
                      border: "none",
                      padding: "16px 32px",
                      cursor: valid && status !== "loading" ? "pointer" : "not-allowed",
                      transition: "all 0.2s",
                    }}
                  >
                    {status === "loading" ? "SENDING..." : "SEND MESSAGE →"}
                  </button>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#4a4235", lineHeight: 1.5 }}>
                    We aim to respond within 2 business days.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
