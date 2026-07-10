import { ImageResponse } from "next/og";

export const alt = "Utleiekalkulator – Forstå boligen før du byr";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f8fa",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
            }}
          >
            🏠
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, color: "#0f172a" }}>
            Utleiekalkulator
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              padding: "10px 22px",
              borderRadius: 999,
              background: "rgba(37,99,235,0.10)",
              border: "1px solid rgba(37,99,235,0.25)",
              color: "#1d4ed8",
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            Boliganalyse for kjøpere og investorer
          </div>
          <div
            style={{
              fontSize: 82,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            Forstå boligen{" "}
            <span style={{ color: "#2563eb", marginLeft: 20 }}>før du byr</span>
          </div>
          <div style={{ fontSize: 34, color: "#64748b", lineHeight: 1.35, maxWidth: 900 }}>
            Lim inn en Finn-lenke. Vi avdekker risiko i salgsoppgaven (TG1/TG2/TG3)
            og regner yield og kontantstrøm — på sekunder.
          </div>
        </div>

        {/* Footer row */}
        <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 28, color: "#334155" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#16a34a" }} /> Gratis
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#16a34a" }} /> Ingen registrering
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
            <span style={{ color: "#2563eb", fontWeight: 700 }}>utleiekalkulatoren.no</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
