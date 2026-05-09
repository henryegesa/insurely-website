import { useReveal } from "../hooks/useReveal";
import { useBreakpoint } from "../hooks/useBreakpoint";

const BrowserMockup = () => (
  <div style={{ border: "1px solid #2a2218", background: "#100d07" }}>
    <div style={{ padding: "10px 16px", borderBottom: "1px solid #2a2218", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3a2f1c", display: "inline-block" }} />
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3a2f1c", display: "inline-block" }} />
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3a2f1c", display: "inline-block" }} />
      <div style={{ flex: 1, background: "#1a1510", padding: "4px 12px", marginLeft: 8 }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#7a7261" }}>insurely.co.ke/quote/KDA482M</span>
      </div>
    </div>
    <div style={{ padding: 20 }}>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 3, color: "#7a7261", marginBottom: 16 }}>QUOTES FOR KZZ 005F</p>
      {[
        { carrier: "Britam", price: "KES 12,400", badge: "BEST PRICE" },
        { carrier: "APA Insurance", price: "KES 13,200", badge: null },
        { carrier: "CIC Group", price: "KES 14,100", badge: null },
      ].map((q) => (
        <div
          key={q.carrier}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            marginBottom: 8,
            border: q.badge ? "1px solid #c9a55c" : "1px solid #2a2218",
            background: q.badge ? "rgba(201,165,92,0.04)" : "transparent",
          }}
        >
          <div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#f5f1e8", fontWeight: 500 }}>{q.carrier}</div>
            {q.badge && (
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 2, color: "#c9a55c", marginTop: 2 }}>{q.badge}</div>
            )}
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: q.badge ? "#c9a55c" : "#9b9485" }}>{q.price}</div>
        </div>
      ))}
    </div>
  </div>
);

const PhoneMockup = ({ label, network, color }) => (
  <div
    style={{
      border: "1px solid #2a2218",
      background: "#100d07",
      padding: 20,
      flex: 1,
      minWidth: 0,
    }}
  >
    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 2, color: "#7a7261", marginBottom: 16 }}>{label}</div>
    <div style={{ padding: "16px", background: "#1a1510", border: "1px solid #2a2218", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, color: "#0a0907" }}>{network[0]}</span>
        </div>
        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#f5f1e8", fontWeight: 600 }}>{network}</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#7a7261" }}>Payment Request</div>
        </div>
      </div>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#b8b1a3", lineHeight: 1.6 }}>
        Enter PIN to pay <strong style={{ color: "#f5f1e8" }}>KES 12,400</strong> to Britam Insurance
      </p>
    </div>
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {["●", "●", "●", "●"].map((d, i) => (
        <span key={i} style={{ color: color, fontSize: 10 }}>{d}</span>
      ))}
    </div>
  </div>
);

const CertCard = () => (
  <div style={{ border: "1px solid #c9a55c", background: "linear-gradient(180deg, #15110a 0%, #100d07 100%)", padding: 28 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
      <div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 3, color: "#7a7261", marginBottom: 6 }}>IRA CERTIFICATE OF INSURANCE</p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#f5f1e8" }}>KZZ 005F</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#7ec48c", letterSpacing: 2 }}>● ACTIVE</p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#7a7261", marginTop: 4 }}>Britam Insurance</p>
      </div>
    </div>
    <div style={{ borderTop: "1px solid #2a2218", paddingTop: 20, display: "flex", justifyContent: "space-between" }}>
      <div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#7a7261" }}>COVER</p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#f5f1e8", marginTop: 4 }}>Comprehensive</p>
      </div>
      <div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#7a7261" }}>VALID UNTIL</p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#f5f1e8", marginTop: 4 }}>Q3 2027</p>
      </div>
      <div style={{ width: 60, height: 60, background: "repeating-linear-gradient(0deg, #2a2218, #2a2218 2px, transparent 2px, transparent 6px), repeating-linear-gradient(90deg, #2a2218, #2a2218 2px, transparent 2px, transparent 6px)", border: "1px solid #3a2f1c" }} />
    </div>
  </div>
);

const steps = [
  {
    num: "01",
    label: "STEP ONE · ~60s",
    title: "Get a quote",
    copy: "Enter your vehicle reg and we pull it straight from NTSA. Compare prices across top IRA-licensed carriers side by side. No forms. No phone calls.",
    visual: <BrowserMockup />,
  },
  {
    num: "02",
    label: "STEP TWO · ~30s",
    title: "Pay via M-Pesa",
    copy: "Choose your carrier and we send an STK push to your phone. Your money goes direct to the insurer — we never touch it.",
    visual: (
      <div style={{ display: "flex", gap: 16 }}>
        <PhoneMockup label="iOS" network="M-Pesa" color="#7ec48c" />
        <PhoneMockup label="Android" network="Airtel Money" color="#c9a55c" />
      </div>
    ),
  },
  {
    num: "03",
    label: "STEP THREE · INSTANT",
    title: "Drive, covered",
    copy: "Your IRA-compliant certificate of insurance is issued instantly. Download it, share it, or pull it up at a roadblock — all from your phone.",
    visual: <CertCard />,
  },
];

export default function HowItWorks() {
  const { isMobile } = useBreakpoint();
  const ref0 = useReveal(0);

  return (
    <section style={{ background: "#0a0907", padding: isMobile ? "60px 24px" : "80px 48px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div ref={ref0} className="reveal" style={{ textAlign: "center", marginBottom: isMobile ? 60 : 100 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>HOW IT WORKS</span>
            <div style={{ width: 36, height: 1, background: "#c9a55c" }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 44 : 64, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.1, marginBottom: 20 }}>
            Three steps.{" "}
            <em style={{ color: "#c9a55c", fontStyle: "italic" }}>Three minutes.</em>
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#b8b1a3", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            We've stripped away every unnecessary step. From registration lookup to driving away covered — faster than a cup of tea.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 60 : 80 }}>
          {steps.map((step, i) => {
            const reverse = !isMobile && i % 2 === 1;
            return (
              <div
                key={step.num}
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: isMobile ? 32 : 80,
                  alignItems: "center",
                  direction: reverse ? "rtl" : "ltr",
                }}
              >
                <div style={{ direction: "ltr" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 80 : 120, color: "#3a2f1c", lineHeight: 1, marginBottom: -16, fontWeight: 400 }}>
                    {step.num}
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600, marginBottom: 16 }}>
                    {step.label}
                  </p>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 40 : 56, fontWeight: 400, color: "#f5f1e8", marginBottom: 20, lineHeight: 1.1 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#b8b1a3", lineHeight: 1.75 }}>
                    {step.copy}
                  </p>
                </div>
                <div style={{ direction: "ltr" }}>
                  {step.visual}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
