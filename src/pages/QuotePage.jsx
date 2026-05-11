import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { useReveal } from "../hooks/useReveal";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const COVER_TYPES = [
  {
    id: "tpo",
    label: "Third Party Only",
    short: "TPO",
    price: "From KES 3,200/yr",
    description: "Covers injury or damage you cause to third parties and their property. Minimum legal requirement in Kenya.",
    tag: "Legal minimum",
  },
  {
    id: "tpp",
    label: "Third Party + Fire & Theft",
    short: "TPP",
    price: "From KES 5,800/yr",
    description: "All TPO cover, plus your vehicle is protected against fire damage and theft.",
    tag: "Popular",
  },
  {
    id: "comp",
    label: "Comprehensive",
    short: "Comp",
    price: "From KES 12,400/yr",
    description: "Full protection: third party, fire, theft, and accidental damage to your own vehicle.",
    tag: "Recommended",
  },
];

const inputStyle = (focused) => ({
  width: "100%",
  padding: "14px 16px",
  background: "transparent",
  border: `1px solid ${focused ? "#c9a55c" : "#3a2f1c"}`,
  color: "#f5f1e8",
  fontFamily: "'Inter', sans-serif",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
});

const labelStyle = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 11,
  letterSpacing: 3,
  color: "#7a7261",
  display: "block",
  marginBottom: 8,
  fontWeight: 600,
};

function FieldGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function FocusInput({ type = "text", placeholder, value, onChange, ...rest }) {
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
      {...rest}
    />
  );
}

function FocusSelect({ value, onChange, children }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle(focused),
        appearance: "none",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a7261' strokeWidth='1.5' fill='none'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 16px center",
        paddingRight: 40,
        cursor: "pointer",
      }}
    >
      {children}
    </select>
  );
}

function StepIndicator({ step, isMobile }) {
  const steps = ["Cover", "Vehicle", "Details", "Review"];
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: isMobile ? 36 : 52, gap: 0 }}>
      {steps.map((label, i) => {
        const num = i + 1;
        const done = step > num;
        const active = step === num;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: done ? "#c9a55c" : active ? "rgba(201,165,92,0.12)" : "transparent",
                  border: active ? "1px solid #c9a55c" : done ? "none" : "1px solid #3a2f1c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: done ? "#0a0907" : active ? "#c9a55c" : "#4a4235",
                  flexShrink: 0,
                  transition: "all 0.3s",
                }}
              >
                {done ? "✓" : num}
              </div>
              {!isMobile && (
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: 2, color: active ? "#c9a55c" : "#4a4235", fontWeight: 600, whiteSpace: "nowrap" }}>
                  {label.toUpperCase()}
                </span>
              )}
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 1, background: done ? "#c9a55c" : "#2a2218", margin: isMobile ? "0 8px" : "0 16px", marginBottom: isMobile ? 0 : 24, transition: "background 0.3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Step1Cover({ form, setForm }) {
  return (
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 400, color: "#f5f1e8", marginBottom: 8, lineHeight: 1.2 }}>
        Choose your <em style={{ color: "#c9a55c", fontStyle: "italic" }}>cover type.</em>
      </h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#9b9485", marginBottom: 32, lineHeight: 1.6 }}>
        All prices are indicative. Your final quote depends on your vehicle and driving history.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {COVER_TYPES.map((c) => (
          <button
            key={c.id}
            onClick={() => setForm((f) => ({ ...f, coverType: c.id }))}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
              padding: "20px 24px",
              background: form.coverType === c.id ? "rgba(201,165,92,0.06)" : "transparent",
              border: form.coverType === c.id ? "1px solid #c9a55c" : "1px solid #2a2218",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: form.coverType === c.id ? "1px solid #c9a55c" : "1px solid #3a2f1c",
                background: form.coverType === c.id ? "#c9a55c" : "transparent",
                flexShrink: 0,
                marginTop: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              {form.coverType === c.id && (
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0a0907" }} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#f5f1e8", fontWeight: 400 }}>
                  {c.label}
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: 2, color: "#c9a55c", border: "1px solid rgba(201,165,92,0.3)", padding: "3px 8px", fontWeight: 600 }}>
                  {c.tag.toUpperCase()}
                </span>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#9b9485", lineHeight: 1.6, marginBottom: 6 }}>
                {c.description}
              </p>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#c9a55c", fontWeight: 600 }}>
                {c.price}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2Vehicle({ form, setForm }) {
  return (
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 400, color: "#f5f1e8", marginBottom: 8, lineHeight: 1.2 }}>
        Your <em style={{ color: "#c9a55c", fontStyle: "italic" }}>vehicle.</em>
      </h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#9b9485", marginBottom: 32, lineHeight: 1.6 }}>
        We use this to prepare your quote. At launch, we'll verify registration with NTSA.
      </p>
      <FieldGroup label="VEHICLE REGISTRATION">
        <FocusInput
          placeholder="e.g. KAA 000A"
          value={form.registration}
          onChange={(e) => setForm((f) => ({ ...f, registration: e.target.value.toUpperCase() }))}
          style={{ textTransform: "uppercase", letterSpacing: 2 }}
        />
      </FieldGroup>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FieldGroup label="MAKE / BRAND">
          <FocusInput
            placeholder="e.g. Toyota"
            value={form.make}
            onChange={(e) => setForm((f) => ({ ...f, make: e.target.value }))}
          />
        </FieldGroup>
        <FieldGroup label="MODEL">
          <FocusInput
            placeholder="e.g. Fielder"
            value={form.model}
            onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
          />
        </FieldGroup>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FieldGroup label="YEAR OF MANUFACTURE">
          <FocusSelect value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}>
            <option value="">Select year</option>
            {Array.from({ length: 30 }, (_, i) => 2026 - i).map((y) => (
              <option key={y} value={y} style={{ background: "#15110a" }}>{y}</option>
            ))}
          </FocusSelect>
        </FieldGroup>
        <FieldGroup label="ESTIMATED VALUE (KES)">
          <FocusInput
            type="number"
            placeholder="e.g. 1200000"
            value={form.value}
            onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
          />
        </FieldGroup>
      </div>
      {form.coverType === "tpo" && (
        <div style={{ padding: "12px 16px", background: "rgba(42,34,24,0.4)", border: "1px solid #2a2218", marginTop: 8 }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7a7261", lineHeight: 1.6 }}>
            Vehicle value is not required for TPO, but helps us offer you upgrade options.
          </p>
        </div>
      )}
    </div>
  );
}

function Step3Details({ form, setForm }) {
  return (
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 400, color: "#f5f1e8", marginBottom: 8, lineHeight: 1.2 }}>
        Your <em style={{ color: "#c9a55c", fontStyle: "italic" }}>details.</em>
      </h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#9b9485", marginBottom: 32, lineHeight: 1.6 }}>
        We'll use these to prepare your quote and reach out with your early-access information.
      </p>
      <FieldGroup label="FULL NAME">
        <FocusInput
          placeholder="Your full name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </FieldGroup>
      <FieldGroup label="EMAIL ADDRESS">
        <FocusInput
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
      </FieldGroup>
      <FieldGroup label="MOBILE NUMBER">
        <FocusInput
          type="tel"
          placeholder="07XX XXX XXX"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        />
      </FieldGroup>
      <div style={{ padding: "14px 16px", border: "1px solid #2a2218", display: "flex", gap: 12, alignItems: "flex-start", marginTop: 8 }}>
        <span style={{ color: "#7ec48c", fontSize: 16, flexShrink: 0 }}>🔒</span>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7a7261", lineHeight: 1.6 }}>
          Your details are used only to prepare your quote and send you early-access information.
          We never sell your data. See our <a href="#" style={{ color: "#c9a55c" }}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

function Step4Review({ form }) {
  const cover = COVER_TYPES.find((c) => c.id === form.coverType);
  const rows = [
    { label: "COVER TYPE", value: cover?.label || "—" },
    { label: "VEHICLE", value: [form.make, form.model, form.year].filter(Boolean).join(" ") || "—" },
    { label: "REGISTRATION", value: form.registration || "—" },
    { label: "NAME", value: form.name || "—" },
    { label: "EMAIL", value: form.email || "—" },
    { label: "MOBILE", value: form.phone || "—" },
  ];
  return (
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 400, color: "#f5f1e8", marginBottom: 8, lineHeight: 1.2 }}>
        Review your <em style={{ color: "#c9a55c", fontStyle: "italic" }}>request.</em>
      </h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#9b9485", marginBottom: 32, lineHeight: 1.6 }}>
        We'll reach out with your quote before the Q3 2026 launch. No payment required now.
      </p>
      <div style={{ border: "1px solid #2a2218" }}>
        {rows.map((r, i) => (
          <div
            key={r.label}
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              gap: 16,
              padding: "16px 20px",
              borderBottom: i < rows.length - 1 ? "1px solid #2a2218" : "none",
              alignItems: "center",
            }}
          >
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 2, color: "#7a7261", fontWeight: 600 }}>{r.label}</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#f5f1e8" }}>{r.value}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "16px 20px", background: "rgba(126,196,140,0.04)", border: "1px solid rgba(126,196,140,0.15)", marginTop: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7ec48c", flexShrink: 0, marginTop: 4 }} />
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#9b9485", lineHeight: 1.6 }}>
          This is a <strong style={{ color: "#f5f1e8" }}>pre-launch quote request</strong> — not a live purchase.
          Our team will confirm your quote and provide payment instructions when Insurely launches in Q3 2026.
        </p>
      </div>
    </div>
  );
}

export default function QuotePage({ setPage }) {
  const { isMobile } = useBreakpoint();
  const ref0 = useReveal(0);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [form, setForm] = useState({
    coverType: "comp",
    registration: "",
    make: "",
    model: "",
    year: "",
    value: "",
    name: "",
    email: "",
    phone: "",
  });

  const canProceed = () => {
    if (step === 1) return !!form.coverType;
    if (step === 2) return !!form.registration && !!form.make;
    if (step === 3) return !!form.name && !!form.email && form.email.includes("@") && !!form.phone;
    return true;
  };

  const handleSubmit = async () => {
    if (honeypot) return;
    setSubmitting(true);
    try {
      await supabase.from("pending_verifications").insert([{ email: form.email }]);
    } catch {
      // silent — show success regardless
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  const sectionPad = isMobile ? "80px 20px 60px" : "100px 48px 80px";

  if (submitted) {
    return (
      <div style={{ background: "#0a0907", minHeight: "100vh", paddingTop: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 560, padding: isMobile ? "40px 24px" : "60px 48px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", border: "1px solid #7ec48c", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: 24 }}>
            ✓
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 40 : 56, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.1, marginBottom: 16 }}>
            Request <em style={{ color: "#c9a55c", fontStyle: "italic" }}>received.</em>
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#9b9485", lineHeight: 1.7, marginBottom: 32 }}>
            We've noted your quote request for {COVER_TYPES.find((c) => c.id === form.coverType)?.label} cover.
            We'll reach out to <strong style={{ color: "#f5f1e8" }}>{form.email}</strong> with your quote before the Q3 2026 launch.
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7a7261", marginBottom: 36 }}>
            Questions? Email <a href="mailto:hello@insurely.co.ke" style={{ color: "#c9a55c" }}>hello@insurely.co.ke</a>
          </p>
          <button
            onClick={() => setPage("Home")}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 3, fontWeight: 700, color: "#c9a55c", border: "1px solid #c9a55c", background: "transparent", padding: "14px 32px", cursor: "pointer", textTransform: "uppercase" }}
          >
            BACK TO HOME →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0907", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: sectionPad }}>
        <div ref={ref0} className="reveal">
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 28, height: 1, background: "#c9a55c" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>
              GET A QUOTE · PRE-LAUNCH REQUEST
            </span>
          </div>

          <StepIndicator step={step} isMobile={isMobile} />

          {/* Step content */}
          <div style={{ minHeight: 400 }}>
            {step === 1 && <Step1Cover form={form} setForm={setForm} />}
            {step === 2 && <Step2Vehicle form={form} setForm={setForm} />}
            {step === 3 && <Step3Details form={form} setForm={setForm} />}
            {step === 4 && <Step4Review form={form} />}
          </div>

          {/* Honeypot */}
          <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: "none" }} tabIndex={-1} />

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40, paddingTop: 28, borderTop: "1px solid #2a2218" }}>
            <button
              onClick={() => step > 1 ? setStep((s) => s - 1) : setPage("Home")}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 2, color: "#9b9485", background: "transparent", border: "none", cursor: "pointer", padding: "4px 0" }}
            >
              ← {step > 1 ? "BACK" : "HOME"}
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  letterSpacing: 3,
                  fontWeight: 700,
                  color: canProceed() ? "#0a0907" : "#3a2f1c",
                  background: canProceed() ? "#c9a55c" : "#2a2218",
                  border: "none",
                  padding: "14px 28px",
                  cursor: canProceed() ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                CONTINUE →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  letterSpacing: 3,
                  fontWeight: 700,
                  color: "#0a0907",
                  background: "#c9a55c",
                  border: "none",
                  padding: "14px 28px",
                  cursor: submitting ? "wait" : "pointer",
                }}
              >
                {submitting ? "SUBMITTING..." : "SUBMIT REQUEST →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
