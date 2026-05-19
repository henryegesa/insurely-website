import { useNavigate } from "react-router-dom";
import { useReveal } from "../hooks/useReveal";
import { useBreakpoint } from "../hooks/useBreakpoint";

const coverTypes = [
  {
    id: "tpo",
    label: "Third Party Only",
    abbr: "TPO",
    tag: "Legal minimum",
    tagColor: "#9b9485",
    price: "From KES 3,200/yr",
    covers: [
      "Bodily injury or death of third parties",
      "Damage to third-party property",
      "Legal liability arising from an accident",
    ],
    doesNotCover: [
      "Damage to your own vehicle",
      "Fire or theft of your vehicle",
    ],
    forWho: "Vehicles with a market value under KES 500,000, or where comprehensive cover is not required.",
  },
  {
    id: "tpp",
    label: "Third Party, Fire & Theft",
    abbr: "TPP",
    tag: "Popular choice",
    tagColor: "#c9a55c",
    price: "From KES 5,800/yr",
    covers: [
      "Everything in TPO",
      "Fire damage to your vehicle",
      "Theft of your vehicle",
    ],
    doesNotCover: [
      "Accidental damage to your own vehicle",
    ],
    forWho: "Drivers who want protection against theft and fire without the cost of full comprehensive cover.",
  },
  {
    id: "comp",
    label: "Comprehensive",
    abbr: "Comp",
    tag: "Recommended",
    tagColor: "#7ec48c",
    price: "From KES 12,400/yr",
    covers: [
      "Everything in TPP",
      "Accidental damage to your own vehicle",
      "Windscreen damage",
      "Emergency medical expenses",
      "Roadside assistance (where included by insurer)",
    ],
    doesNotCover: [
      "Mechanical or electrical breakdown",
      "Damage from racing or off-road use",
    ],
    forWho: "Newer vehicles, vehicles on financing, or drivers who want peace of mind on any incident.",
  },
];

const processSteps = [
  {
    num: "01",
    title: "Request a quote",
    copy: "Tell us your vehicle registration, cover type, and basic details. Takes about 2 minutes. No phone calls.",
  },
  {
    num: "02",
    title: "Receive your quote",
    copy: "We'll match you with IRA-licensed insurers and send you a clear, itemised quote by email.",
  },
  {
    num: "03",
    title: "Choose and pay",
    copy: "Select the insurer and cover that fits you. At launch, pay directly via M-Pesa or Airtel Money — your premium goes to the insurer, not Insurely.",
  },
  {
    num: "04",
    title: "Receive your documents",
    copy: "At launch, your policy documents will be delivered digitally. Digital certificate issuance is planned subject to DMVIC integration.",
  },
];

const requiredDetails = [
  { label: "Vehicle registration number", note: "As it appears on your logbook" },
  { label: "Vehicle make, model, and year", note: "e.g. Toyota Fielder 2019" },
  { label: "Estimated market value", note: "Required for Comprehensive and TPP" },
  { label: "Full name", note: "Must match your national ID or passport" },
  { label: "National ID or passport number", note: "Required by IRA for policy issuance" },
  { label: "Mobile number", note: "Used for M-Pesa payment and certificate delivery" },
  { label: "Email address", note: "Certificate and policy documents delivered here" },
];

export default function MotorInsurancePage() {
  const navigate = useNavigate();
  const { isSmall, isMobile, isTablet } = useBreakpoint();
  const ref0 = useReveal(0);
  const ref1 = useReveal(100);
  const ref2 = useReveal(150);
  const ref3 = useReveal(200);
  const ref4 = useReveal(250);

  const pad = isSmall ? "0 16px" : isMobile ? "0 20px" : "0 48px";

  return (
    <div style={{ background: "#0a0907", minHeight: "100vh", paddingTop: 72 }}>

      {/* Hero */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isSmall ? "48px 16px 56px" : isMobile ? "60px 20px 64px" : "80px 48px 80px" }}>
        <div ref={ref0} className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 28, height: 1, background: "#c9a55c" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 9 : 11, letterSpacing: isSmall ? 2 : 4, color: "#c9a55c", fontWeight: 600 }}>
              MOTOR INSURANCE · PRIVATE VEHICLES
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
              maxWidth: 800,
            }}
          >
            Motor cover that{" "}
            <em style={{ color: "#c9a55c", fontStyle: "italic" }}>works.</em>
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isSmall ? 15 : 17, color: "#b8b1a3", lineHeight: 1.75, maxWidth: 600, marginBottom: 36 }}>
            Motor insurance for Kenyan drivers — accessed through IRA-licensed insurance partners.
            Compare cover options and join the waitlist for early access at launch.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <button
              onClick={() => navigate("/")}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                letterSpacing: 3,
                fontWeight: 700,
                color: "#0a0907",
                background: "#c9a55c",
                border: "none",
                padding: isSmall ? "14px 24px" : "16px 32px",
                cursor: "pointer",
              }}
            >
              JOIN WAITLIST →
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 16px", border: "1px solid #2a2218" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a55c", display: "inline-block" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 2, color: "#9b9485", fontWeight: 600 }}>
                IRA LICENSED PARTNERS ONLY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cover types */}
      <div style={{ borderTop: "1px solid #2a2218" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: isSmall ? "48px 16px" : isMobile ? "60px 20px" : "80px 48px" }}>
          <div ref={ref1} className="reveal">
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1, background: "#c9a55c" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>THREE COVER LEVELS</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isSmall ? 36 : isMobile ? 44 : 56, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.1, marginBottom: 48 }}>
              Choose what fits <em style={{ color: "#c9a55c", fontStyle: "italic" }}>your vehicle.</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "repeat(3, 1fr)", gap: isTablet ? 16 : 0 }}>
            {coverTypes.map((ct, i) => (
              <div
                key={ct.id}
                style={{
                  padding: isSmall ? "28px 20px" : "36px 32px",
                  border: "1px solid #2a2218",
                  borderLeft: !isTablet && i > 0 ? "none" : "1px solid #2a2218",
                  position: "relative",
                }}
              >
                {/* Tag */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: 4, color: "#3a2f1c" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: 2, color: ct.tagColor, border: `1px solid ${ct.tagColor}33`, padding: "3px 8px", fontWeight: 600 }}>
                    {ct.tag.toUpperCase()}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.2, marginBottom: 4 }}>
                  {ct.label}
                </h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#c9a55c", fontWeight: 600, marginBottom: 24 }}>
                  {ct.price}
                </p>

                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", marginBottom: 12, fontWeight: 600 }}>WHAT'S COVERED</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px" }}>
                  {ct.covers.map((c) => (
                    <li key={c} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                      <span style={{ color: "#7ec48c", flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#b8b1a3", lineHeight: 1.5 }}>{c}</span>
                    </li>
                  ))}
                </ul>

                {ct.doesNotCover.length > 0 && (
                  <>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a7261", marginBottom: 12, fontWeight: 600 }}>NOT COVERED</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
                      {ct.doesNotCover.map((c) => (
                        <li key={c} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                          <span style={{ color: "#4a4235", flexShrink: 0, marginTop: 1 }}>✕</span>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#7a7261", lineHeight: 1.5 }}>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <div style={{ padding: "12px 14px", background: "rgba(42,34,24,0.4)", border: "1px solid #2a2218", marginBottom: 24 }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9b9485", lineHeight: 1.6 }}>
                    <strong style={{ color: "#7a7261", fontWeight: 600 }}>Best for:</strong> {ct.forWho}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/")}
                  style={{
                    width: "100%",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    letterSpacing: 3,
                    fontWeight: 700,
                    color: "#c9a55c",
                    background: "transparent",
                    border: "1px solid #c9a55c",
                    padding: "12px 0",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  JOIN WAITLIST →
                </button>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#4a4235", marginTop: 16, lineHeight: 1.6 }}>
            * Prices are indicative and vary by vehicle age, value, and insurer. Final premium confirmed at quote.
            All insurers on the Insurely platform are IRA-licensed. Insurely is an insurance distribution platform, not an underwriter.
          </p>
        </div>
      </div>

      {/* What you'll need */}
      <div style={{ borderTop: "1px solid #2a2218" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: isSmall ? "48px 16px" : isMobile ? "60px 20px" : "80px 48px" }}>
          <div ref={ref2} className="reveal">
            <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: isTablet ? 40 : 80, alignItems: "start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 1, background: "#c9a55c" }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>WHAT YOU'LL NEED</span>
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isSmall ? 36 : 48, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.1, marginBottom: 16 }}>
                  Required <em style={{ color: "#c9a55c", fontStyle: "italic" }}>information.</em>
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#9b9485", lineHeight: 1.7 }}>
                  Kenyan regulations require certain details to issue a legally valid motor insurance policy.
                  Have these ready when you request your quote.
                </p>
              </div>
              <div>
                {requiredDetails.map((d, i) => (
                  <div
                    key={d.label}
                    style={{
                      display: "flex",
                      gap: 16,
                      padding: "16px 0",
                      borderBottom: i < requiredDetails.length - 1 ? "1px solid #2a2218" : "none",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: "#c9a55c", minWidth: 28, marginTop: 2 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#f5f1e8", marginBottom: 3 }}>{d.label}</p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7a7261" }}>{d.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ borderTop: "1px solid #2a2218" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: isSmall ? "48px 16px" : isMobile ? "60px 20px" : "80px 48px" }}>
          <div ref={ref3} className="reveal">
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1, background: "#c9a55c" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 4, color: "#c9a55c", fontWeight: 600 }}>HOW IT WORKS</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isSmall ? 36 : isMobile ? 44 : 56, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.1, marginBottom: 48 }}>
              From request to <em style={{ color: "#c9a55c", fontStyle: "italic" }}>certificate.</em>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr 1fr" : "repeat(4, 1fr)", gap: isSmall ? 24 : 0 }}>
              {processSteps.map((s, i) => (
                <div
                  key={s.num}
                  style={{
                    padding: isSmall ? "24px 0" : "0 32px",
                    borderLeft: !isSmall && i > 0 ? "1px solid #2a2218" : "none",
                    borderTop: isSmall && i > 0 ? "1px solid #2a2218" : "none",
                  }}
                >
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 64, color: "#1a1309", fontWeight: 400, lineHeight: 1, marginBottom: 16 }}>
                    {s.num}
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: "#f5f1e8", marginBottom: 12 }}>{s.title}</h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#9b9485", lineHeight: 1.7 }}>{s.copy}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: "12px 16px", border: "1px solid #2a2218", display: "inline-flex", gap: 10, alignItems: "center" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a55c", flexShrink: 0 }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#7a7261" }}>
                Digital certificate issuance is planned at launch (Q3 2026), subject to DMVIC integration readiness.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ borderTop: "1px solid #2a2218" }}>
        <div ref={ref4} className="reveal" style={{ maxWidth: 1200, margin: "0 auto", padding: isSmall ? "48px 16px" : isMobile ? "60px 20px" : "80px 48px", display: "flex", flexDirection: isTablet ? "column" : "row", alignItems: isTablet ? "flex-start" : "center", justifyContent: "space-between", gap: 32 }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isSmall ? 36 : 52, fontWeight: 400, color: "#f5f1e8", lineHeight: 1.1, marginBottom: 12 }}>
              Be first at <em style={{ color: "#c9a55c", fontStyle: "italic" }}>launch.</em>
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#9b9485", lineHeight: 1.6 }}>
              Join the waitlist for early access when we launch in Q3 2026.
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              letterSpacing: 3,
              fontWeight: 700,
              color: "#0a0907",
              background: "#c9a55c",
              border: "none",
              padding: "18px 40px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            JOIN WAITLIST →
          </button>
        </div>
      </div>

    </div>
  );
}
