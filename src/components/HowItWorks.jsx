import { useReveal } from "../hooks/useReveal";
import { useBreakpoint } from "../hooks/useBreakpoint";

const BrowserMockup = ({ isSmall }) => (
  <div style={{ border: "1px solid #2a2218", background: "#100d07", overflow: "hidden" }}>
    <div style={{ padding: "8px 12px", borderBottom: "1px solid #2a2218", display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3a2f1c", display: "inline-block", flexShrink: 0 }} />
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3a2f1c", display: "inline-block", flexShrink: 0 }} />
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3a2f1c", display: "inline-block", flexShrink: 0 }} />
      <div style={{ flex: 1, background: "#1a1510", padding: "3px 10px", marginLeft: 6, overflow: "hidden" }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 9 : 11, color: "#7a7261", whiteSpace: "nowrap", display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>
          insurely.co.ke/quote
        </span>
      </div>
    </div>
    <div style={{ padding: isSmall ? 14 : 20 }}>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 9 : 11, letterSpacing: 2, color: "#7a7261", marginBottom: 12 }}>QUOTES FOR KZZ 005F</p>
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
            padding: isSmall ? "10px 12px" : "12px 14px",
            marginBottom: 6,
            border: q.badge ? "1px solid #c9a55c" : "1px solid #2a2218",
            background: q.badge ? "rgba(201,165,92,0.04)" : "transparent",
            gap: 8,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 12 : 14, color: "#f5f1e8", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {q.carrier}
            </div>
            {q.badge && (
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: 2, color: "#c9a55c", marginTop: 2 }}>{q.badge}</div>
            )}
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isSmall ? 16 : 20, color: q.badge ? "#c9a55c" : "#9b9485", flexShrink: 0 }}>
            {q.price}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PhoneMockup = ({ label, network, color, isSmall }) => (
  <div
    style={{
      border: "1px solid #2a2218",
      background: "#100d07",
      padding: isSmall ? 14 : 18,
      flex: 1,
      minWidth: 0,
    }}
  >
    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 9 : 11, letterSpacing: 2, color: "#7a7261", marginBottom: 12 }}>{label}</div>
    <div style={{ padding: isSmall ? "12px" : "14px", background: "#1a1510", border: "1px solid #2a2218", marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: isSmall ? 26 : 30, height: isSmall ? 26 : 30, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, color: "#0a0907" }}>{network[0]}</span>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 11 : 12, color: "#f5f1e8", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{network}</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#7a7261" }}>Payment Request</div>
        </div>
      </div>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 11 : 12, color: "#b8b1a3", lineHeight: 1.5 }}>
        Enter PIN to pay <strong style={{ color: "#f5f1e8" }}>KES 12,400</strong> to Britam
      </p>
    </div>
    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
      {["●", "●", "●", "●"].map((d, i) => (
        <span key={i} style={{ color, fontSize: 9 }}>{d}</span>
      ))}
    </div>
  </div>
);

const CertCard = ({ isSmall, isMobile }) => (
  <div style={{ border: "1px solid #c9a55c", background: "linear-gradient(180deg, #15110a 0%, #100d07 100%)", padding: isSmall ? 20 : 24 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 12 }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 9 : 11, letterSpacing: 2, color: "#7a7261", marginBottom: 6 }}>IRA CERTIFICATE OF INSURANCE</p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isSmall ? 22 : 28, color: "#f5f1e8" }}>KZZ 005F</p>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 9 : 11, color: "#7ec48c", letterSpacing: 2 }}>● ACTIVE</p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 9 : 11, color: "#7a7261", marginTop: 4 }}>Britam Insurance</p>
      </div>
    </div>
    <div style={{ borderTop: "1px solid #2a2218", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
      <div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 9 : 11, color: "#7a7261" }}>COVER</p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 12 : 13, color: "#f5f1e8", marginTop: 4 }}>Comprehensive</p>
      </div>
      <div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 9 : 11, color: "#7a7261" }}>VALID UNTIL</p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 12 : 13, color: "#f5f1e8", marginTop: 4 }}>Q3 2027</p>
      </div>
      {!isSmall && (
        <div style={{ width: 48, height: 48, background: "repeating-linear-gradient(0deg, #2a2218, #2a2218 2px, transparent 2px, transparent 6px), repeating-linear-gradient(90deg, #2a2218, #2a2218 2px, transparent 2px, transparent 6px)", border: "1px solid #3a2f1c", flexShrink: 0 }} />
      )}
    </div>
  </div>
);

export default function HowItWorks() {
  const { isSmall, isMobile, isTablet } = useBreakpoint();
  const ref0 = useReveal(0);

  const steps = [
    {
      num: "01",
      label: "STEP ONE · ~60s",
      title: "Get a quote",
      copy: "Enter your vehicle reg and we pull it straight from NTSA. Compare prices across top IRA-licensed carriers side by side. No forms. No phone calls.",
      visual: <BrowserMockup isSmall={isSmall} />,
    },
    {
      num: "02",
      label: "STEP TWO · ~30s",
      title: "Pay via M-Pesa",
      copy: "Choose your carrier and we send an STK push to your phone. Your money goes direct to the insurer — we never touch it.",
      visual: (
        <div style={{ display: "flex", gap: isSmall ? 8 : 12 }}>
          <PhoneMockup label="iOS" network="M-Pesa" color="#7ec48c" isSmall={isSmall} />
          <PhoneMockup label="Android" network="Airtel Money" color="#c9a55c" isSmall={isSmall} />
        </div>
      ),
    },
    {
      num: "03",
      label: "STEP THREE · INSTANT",
      title: "Drive, covered",
      copy: "Your IRA-compliant certificate of insurance is issued instantly. Download it, share it, or pull it up at a roadblock — all from your phone.",
      visual: <CertCard isSmall={isSmall} isMobile={isMobile} />,
    },
  ];

  const sectionPad = isSmall ? "48px 16px" : isMobile ? "60px 20px" : isTablet ? "60px 32px" : "80px 48px";

  return (
    <section style={{ background: "#0a0907", padding: sectionPad }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div ref={ref0} className="reveal" style={{ textAlign: "center", marginBottom: isSmall ? 40 : isMobile ? 52 : 80 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 28, height: 1, background: "#c9a55c" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 9 : 11, letterSpacing: isSmall ? 2 : 4, color: "#c9a55c", fontWeight: 600 }}>HOW IT WORKS</span>
            <div style={{ width: 28, height: 1, background: "#c9a55c" }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isSmall ? 36 : isMobile ? 44 : isTablet ? 52 : 64, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.1, marginBottom: 16 }}>
            Three steps.{" "}
            <em style={{ color: "#c9a55c", fontStyle: "italic" }}>Three minutes.</em>
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 14 : 16, color: "#b8b1a3", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            We've stripped away every unnecessary step. From registration lookup to driving away covered — faster than a cup of tea.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: isSmall ? 48 : isMobile ? 56 : 72 }}>
          {steps.map((step, i) => {
            const reverse = !isTablet && i % 2 === 1;
            return (
              <div
                key={step.num}
                style={{
                  display: "grid",
                  gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr",
                  gap: isSmall ? 20 : isTablet ? 28 : 64,
                  alignItems: "center",
                  direction: reverse ? "rtl" : "ltr",
                }}
              >
                <div style={{ direction: "ltr" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isSmall ? 56 : isMobile ? 72 : 100, color: "#3a2f1c", lineHeight: 1, marginBottom: -12, fontWeight: 400 }}>
                    {step.num}
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 9 : 11, letterSpacing: isSmall ? 2 : 4, color: "#c9a55c", fontWeight: 600, marginBottom: 12 }}>
                    {step.label}
                  </p>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isSmall ? 32 : isMobile ? 40 : isTablet ? 44 : 52, fontWeight: 400, color: "#f5f1e8", marginBottom: 16, lineHeight: 1.1 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 14 : 16, color: "#b8b1a3", lineHeight: 1.75 }}>
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
