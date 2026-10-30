import { ImageResponse } from "next/og";

// Shared preview for links to any page without its own image. Text stays Latin: the font
// bundled with next/og has no Cyrillic glyphs.
export const alt = "InfoSystems Mongolia — MACS ERP, MACS POS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "#0071ce";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#0b1b2b", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg height="112" viewBox="0 0 40 40" width="112">
            <rect fill={BRAND} height="40" rx="12" width="40" />
            <circle cx="13" cy="11.6" fill="#fff" r="2.7" />
            <rect fill="#fff" height="13.4" rx="2.5" width="5" x="10.5" y="16.6" />
            <path d="M29.6 15.6c-.9-2.2-2.9-3.5-5.3-3.5-2.9 0-4.9 1.8-4.9 4.1 0 5.4 10.6 3 10.6 8.9 0 2.6-2.2 4.6-5.4 4.6-2.6 0-4.6-1.2-5.6-3.4" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.4" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 64, fontWeight: 800, letterSpacing: -1 }}>InfoSystems</span>
            <span style={{ fontSize: 26, letterSpacing: 10, color: "rgba(255,255,255,0.6)" }}>MONGOLIA</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontSize: 56, fontWeight: 700 }}>MACS ERP · MACS POS</span>
          <span style={{ fontSize: 30, color: "rgba(255,255,255,0.7)" }}>Accounting, inventory, payroll and point-of-sale software</span>
        </div>
        <div style={{ display: "flex", height: 10, width: 220, borderRadius: 5, background: BRAND }} />
      </div>
    ),
    size,
  );
}
