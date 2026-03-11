import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "パワハラ対策AI｜証拠収集・内容証明・法的対応をAIが徹底サポート";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 12, display: "flex" }}>🛡️</div>
        <div style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginBottom: 12, textAlign: "center", display: "flex" }}>
          パワハラ対策AI
        </div>
        <div style={{ fontSize: 26, color: "#93c5fd", textAlign: "center", maxWidth: 900, marginBottom: 8, display: "flex" }}>
          証拠収集・内容証明・法的対応をAIが徹底サポート
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          {["法的評価", "証拠収集ガイド", "内容証明作成", "¥1,980/月"].map((label) => (
            <div
              key={label}
              style={{
                padding: "8px 20px",
                background: "rgba(147,197,253,0.15)",
                border: "1px solid rgba(147,197,253,0.3)",
                borderRadius: 24,
                fontSize: 18,
                color: "#bfdbfe",
                display: "flex",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
