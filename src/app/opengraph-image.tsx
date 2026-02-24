// src/app/opengraph-image.tsx
// Next.js tự động generate ảnh OG tại /opengraph-image
// Không cần Figma, không cần Canva — code render ra PNG

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt     = "FlowState — Pomodoro Timer & Lofi Music";
export const size    = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width:      "100%",
          height:     "100%",
          display:    "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d0f14 0%, #111827 50%, #0a1420 100%)",
          fontFamily: "sans-serif",
          position:   "relative",
          overflow:   "hidden",
        }}
      >
        {/* Background glow effects */}
        <div style={{
          position:     "absolute",
          top:          "-100px",
          left:         "-100px",
          width:        "500px",
          height:       "500px",
          borderRadius: "50%",
          background:   "radial-gradient(circle, rgba(232,168,124,0.15) 0%, transparent 70%)",
        }} />
        <div style={{
          position:     "absolute",
          bottom:       "-100px",
          right:        "-100px",
          width:        "400px",
          height:       "400px",
          borderRadius: "50%",
          background:   "radial-gradient(circle, rgba(126,200,200,0.1) 0%, transparent 70%)",
        }} />

        {/* Logo */}
        <div style={{
          fontSize:   52,
          marginBottom: 16,
        }}>
          🌿
        </div>

        {/* App name */}
        <div style={{
          fontSize:     72,
          fontWeight:   700,
          color:        "#e8a87c",
          letterSpacing: "-2px",
          marginBottom: 16,
        }}>
          FlowState
        </div>

        {/* Tagline */}
        <div style={{
          fontSize:   28,
          color:      "rgba(232,226,217,0.65)",
          textAlign:  "center",
          maxWidth:   700,
          lineHeight: 1.5,
          marginBottom: 40,
        }}>
          Pomodoro Timer · Lofi Music · Task Manager
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 14 }}>
          {["🍅 Focus Timer", "🎵 Lofi Radio", "📝 Tasks", "💪 Habits"].map((f) => (
            <div key={f} style={{
              padding:      "10px 22px",
              borderRadius: 30,
              background:   "rgba(255,255,255,0.08)",
              border:       "1px solid rgba(255,255,255,0.15)",
              color:        "rgba(232,226,217,0.8)",
              fontSize:     18,
            }}>
              {f}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div style={{
          position: "absolute",
          bottom:   32,
          right:    40,
          fontSize: 18,
          color:    "rgba(232,226,217,0.3)",
        }}>
          flowstate.app
        </div>
      </div>
    ),
    { ...size }
  );
}
