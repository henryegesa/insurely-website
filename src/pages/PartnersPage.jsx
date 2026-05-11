import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useReveal } from "../hooks/useReveal";
import { useBreakpoint } from "../hooks/useBreakpoint";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const reasons = [
  {
    num: "01",
    title: "Digital distribution channel",
    copy: "Reach customers who search for, compare, and buy insurance online. Insurely handles the digital customer experience — quote request, premium collection, and certificate delivery.",
  },
  {
    num: "02",
    title: "Structured, typed integration",
    copy: "Our platform is built around a typed integration contract. Your policy API receives structured requests and returns structured responses. No ambiguity. No manual data entry.",
  },
  {
    num: "03",
    title: "Reconciliation and audit logs",
    copy: "Every transaction — quote, payment, policy creation, certificate issuance — is written to an immutable audit log. Reconciliation reports are available by integration and time period.",
  },
  {
    num: "04",
    title: "DMVIC-ready architecture",
    copy: "Our certificate issuance pipeline is designed for DMVIC integration. We issue motor insurance certificates through licensed insurers and plan to support electronic sticker issuance at launch.",
  },
  {
    num: "05",
    title: "IRA regulatory alignment",
    copy: "Insurely operates within the IRA framework. We do not underwrite — we distribute. Every policy and certificate is issued by you, the licensed insurer, with full audit trail.",
  },
  {
    num: "06",
    title: "Idempotent, retry-safe payments",
    copy: "M-Pesa and Airtel Money payments are handled with idempotency keys and reconciliation logging. Duplicate webhook delivery does not result in duplicate policy issuance.",
  },
];

const workflowSteps = [
  { num: "01", label: "Quote request", copy: "Customer submits quote request via Insurely. Platform sends structured request to insurer API with vehicle, customer, and cover details." },
  { num: "02", label: "Policy creation", copy: "Insurer API creates a policy and returns a policy reference and IRA license number. Insurely stores the policy reference and associates it with the payment." },
  { num: "03", label: "Payment confirmation", copy: "Customer pays via M-Pesa or Airtel Money. Payment webhook triggers certificate issuance queue. Only confirmed payments proceed — no silent issuance." },
  { num: "04", label: "Certificate issuance", copy: "Insurely calls the DMVIC-compatible certificate endpoint with the insurer's IRA license. Certificate is issued and delivered to the customer. Full audit trail written." },
  { num: "05", label: "Reconciliation", copy: "Every integration call — insurer API, DMVIC, payment processor, email delivery — is logged with request payload, response, and latency. Reconciliation reports available by integration." },
];

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

function FocusTextarea({ placeholder, value, onChange, rows = 4 }) {
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

export default function PartnersPage({ setPage }) {
  const { isSmall, isMobile, isTablet } = useBreakpoint();
  const ref0 = useReveal(0);
  const ref1 = useReveal(100);
  const ref2 = useReveal(150);
  const ref3 = useReveal(200);

  const [form, setForm] = useState({ name: "", org: "", email: "", phone: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return;
    if (!form.name || !form.org || !form.email || !form.email.includes("@")) return;
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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isSmall ? "48px 16px 60px" : isMobile ? "60px 20px 72px" : "80px 48px 96px" }}>
        <div ref={ref0} className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 28, height: 1, background: "#c9a55c" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 9 : 11, letterSpacing: isSmall ? 2 : 4, color: "#c9a55c", fontWeight: 600 }}>
              INSURER & PARTNER PROGRAMME
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
              maxWidth: 820,
            }}
          >
            Distribute insurance{" "}
            <em style={{ color: "#c9a55c", fontStyle: "italic" }}>digitally.</em>
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 15 : 17, color: "#b8b1a3", lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
            Insurely is building Kenya's digital insurance distribution layer.
            We connect customers to licensed insurers through a structured, auditable, and DMVIC-ready platform.
            Partner with us to reach digital-first Kenyan drivers.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a
              href="#partner-form"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                letterSpacing: 3,
                fontWeight: 700,
                color: "#0a0907",
                background: "#c9a55c",
                padding: isSmall ? "14px 24px" : "16px 32px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              GET IN TOUCH →
            </a>
            <a
              href="mailto:hello@insurely.co.ke"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                letterSpacing: 2,
                color: "#9b9485",
                border: "1px solid #2a2218",
                padding: isSmall ? "14px 20px" : "16px 28px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              hello@insurely.co.ke
            </a>
          </div>
        </div>
      </div>

      {/* Why partner */}
      <div style={{ borderTop: "1px solid #2a2218" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: isSmall ? "48px 16px" : isMobile ? "60px 20px" : "80px 48px" }}>
          <div ref={ref1} className="reveal">
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1, background: "#c9a55c" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>WHY PARTNER WITH INSURELY</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isSmall ? 36 : isMobile ? 44 : 56, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.1, marginBottom: 48 }}>
              Built for <em style={{ color: "#c9a55c", fontStyle: "italic" }}>insurer operations.</em>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "repeat(3, 1fr)", gap: 0 }}>
              {reasons.map((r, i) => (
                <div
                  key={r.num}
                  style={{
                    padding: isSmall ? "28px 0" : "32px",
                    borderTop: "1px solid #2a2218",
                    borderLeft: !isTablet && i % 3 > 0 ? "1px solid #2a2218" : "none",
                    borderBottom: !isTablet && i < 3 ? "1px solid #2a2218" : isTablet ? "1px solid #2a2218" : "none",
                  }}
                >
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: 4, color: "#c9a55c", marginBottom: 16 }}>{r.num}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.2, marginBottom: 12 }}>{r.title}</h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#9b9485", lineHeight: 1.7 }}>{r.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Workflow */}
      <div style={{ borderTop: "1px solid #2a2218" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: isSmall ? "48px 16px" : isMobile ? "60px 20px" : "80px 48px" }}>
          <div ref={ref2} className="reveal">
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1, background: "#c9a55c" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>QUOTE-TO-CERTIFICATE WORKFLOW</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isSmall ? 36 : isMobile ? 44 : 56, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.1, marginBottom: 48 }}>
              How the <em style={{ color: "#c9a55c", fontStyle: "italic" }}>pipeline works.</em>
            </h2>
            <div style={{ position: "relative" }}>
              {workflowSteps.map((s, i) => (
                <div
                  key={s.num}
                  style={{
                    display: "grid",
                    gridTemplateColumns: isSmall ? "1fr" : "100px 1fr",
                    gap: isSmall ? 12 : 48,
                    padding: "28px 0",
                    borderTop: "1px solid #2a2218",
                    borderBottom: i === workflowSteps.length - 1 ? "1px solid #2a2218" : "none",
                    alignItems: "start",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, letterSpacing: 4, color: "#c9a55c", fontStyle: "italic" }}>{s.num}</span>
                    {isSmall && (
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: "#f5f1e8" }}>{s.label}</h3>
                    )}
                  </div>
                  <div>
                    {!isSmall && (
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: "#f5f1e8", marginBottom: 8 }}>{s.label}</h3>
                    )}
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#9b9485", lineHeight: 1.7 }}>{s.copy}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: "12px 16px", border: "1px solid #2a2218", display: "inline-flex", gap: 10, alignItems: "center" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a55c", flexShrink: 0 }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#7a7261" }}>
                DMVIC integration is planned for Q3 2026 launch. Integration design is available to confirmed partners under NDA.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Partner inquiry form */}
      <div id="partner-form" style={{ borderTop: "1px solid #2a2218" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: isSmall ? "48px 16px 60px" : isMobile ? "60px 20px 72px" : "80px 48px 100px" }}>
          <div ref={ref3} className="reveal">
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1, background: "#c9a55c" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>START A CONVERSATION</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isSmall ? 36 : 52, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.1, marginBottom: 12 }}>
              Partner <em style={{ color: "#c9a55c", fontStyle: "italic" }}>inquiry.</em>
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#9b9485", lineHeight: 1.7, marginBottom: 36 }}>
              Whether you're an IRA-licensed insurer, a technology integrator, or an ecosystem partner —
              we'd like to hear from you. Fill in the form or email us directly at{" "}
              <a href="mailto:hello@insurely.co.ke" style={{ color: "#c9a55c" }}>hello@insurely.co.ke</a>.
            </p>

            {status === "success" ? (
              <div style={{ padding: "32px 28px", border: "1px solid rgba(126,196,140,0.2)", background: "rgba(126,196,140,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7ec48c" }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 2, color: "#7ec48c", fontWeight: 600 }}>INQUIRY RECEIVED</span>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#b8b1a3", lineHeight: 1.7 }}>
                  Thank you, <strong style={{ color: "#f5f1e8" }}>{form.name}</strong>.
                  We'll be in touch at <strong style={{ color: "#f5f1e8" }}>{form.email}</strong> within 2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", display: "block", marginBottom: 8, fontWeight: 600 }}>
                      FULL NAME *
                    </label>
                    <FocusInput placeholder="Your name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", display: "block", marginBottom: 8, fontWeight: 600 }}>
                      ORGANISATION *
                    </label>
                    <FocusInput placeholder="Your company or insurer" value={form.org} onChange={(e) => setForm((f) => ({ ...f, org: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", display: "block", marginBottom: 8, fontWeight: 600 }}>
                      EMAIL *
                    </label>
                    <FocusInput type="email" placeholder="work@example.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", display: "block", marginBottom: 8, fontWeight: 600 }}>
                      PHONE
                    </label>
                    <FocusInput type="tel" placeholder="07XX XXX XXX" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", display: "block", marginBottom: 8, fontWeight: 600 }}>
                    HOW CAN WE WORK TOGETHER?
                  </label>
                  <FocusTextarea
                    placeholder="Tell us about your organisation and what you're looking to do with Insurely."
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  />
                </div>
                <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: "none" }} tabIndex={-1} />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    letterSpacing: 3,
                    fontWeight: 700,
                    color: "#0a0907",
                    background: "#c9a55c",
                    border: "none",
                    padding: "16px 32px",
                    cursor: status === "loading" ? "wait" : "pointer",
                  }}
                >
                  {status === "loading" ? "SENDING..." : "SEND INQUIRY →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
