import { GOLD, NAVY } from "../constants/theme";

export default function Footer({ setPage }) {
  return (
    <footer style={{
      background: NAVY,
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "48px 24px 32px",
    }}>
      <div style={{
        maxWidth: 1120, margin: "0 auto",
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32,
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 20, color: GOLD, marginBottom: 8 }}>
            insurely
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", maxWidth: 260, lineHeight: 1.6 }}>
            Private motor insurance, instant and effortless. A licensed digital
            insurance agency regulated by the IRA.
          </p>
        </div>

        <div style={{ display: "flex", gap: 48 }}>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)",
              letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12,
            }}>
              Company
            </div>
            {["Home", "About", "FAQ"].map((l) => (
              <div
                key={l}
                onClick={() => setPage(l)}
                style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8, cursor: "pointer" }}
              >
                {l}
              </div>
            ))}
          </div>

          <div>
            <div style={{
              fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)",
              letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12,
            }}>
              Legal
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Privacy policy</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Terms of service</div>
          </div>

          <div>
            <div style={{
              fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)",
              letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12,
            }}>
              Contact
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>hello@insurely.co.ke</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Nairobi, Kenya</div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: 1120, margin: "32px auto 0", paddingTop: 24,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center",
      }}>
        © 2026 Insurely. All rights reserved. Licensed and regulated by the
        Insurance Regulatory Authority of Kenya.
      </div>
    </footer>
  );
}
