// src/app/api/og/route.tsx
// Tạo OG image động cho từng blog post
// Usage: /api/og?title=Kỹ Thuật Pomodoro Là Gì

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title    = searchParams.get("title") || "FlowState Blog";
  const category = searchParams.get("category") || "Productivity";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "flex-start", justifyContent: "flex-end",
          padding: "60px 72px",
          background: "linear-gradient(135deg, #0d0f14 0%, #111827 100%)",
          position: "relative", overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background glow */}
        <div style={{
          position: "absolute", top: -150, left: -150,
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,168,124,0.12) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: -100, right: -100,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(126,200,200,0.08) 0%, transparent 70%)",
        }} />

        {/* Category */}
        <div style={{
          padding: "6px 18px", borderRadius: 20,
          background: "rgba(232,168,124,0.15)",
          border: "1px solid rgba(232,168,124,0.3)",
          color: "#e8a87c", fontSize: 18, fontWeight: 600,
          letterSpacing: "0.08em", textTransform: "uppercase",
          marginBottom: 24,
        }}>
          {category}
        </div>

        {/* Title */}
        <div style={{
          fontSize: title.length > 60 ? 40 : 52,
          fontWeight: 700,
          color: "#e8e2d9",
          lineHeight: 1.25,
          maxWidth: 900,
          marginBottom: 32,
        }}>
          {title}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 28 }}>🌿</div>
          <div style={{ color: "rgba(232,226,217,0.5)", fontSize: 22 }}>FlowState Blog</div>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(232,226,217,0.2)" }} />
          <div style={{ color: "rgba(232,226,217,0.35)", fontSize: 18 }}>flowstate.app</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
