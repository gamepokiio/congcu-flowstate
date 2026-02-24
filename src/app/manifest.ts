// src/app/manifest.ts
// PWA manifest — cho phép "Add to Home Screen" trên mobile
// Google cũng dùng thông tin này để hiểu app của bạn

import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             "FlowState — Pomodoro & Lofi Music",
    short_name:       "FlowState",
    description:      "Tập trung sâu hơn với Pomodoro Timer và Lofi Music. Miễn phí.",
    start_url:        "/",
    display:          "standalone",
    background_color: "#0d0f14",
    theme_color:      "#e8a87c",
    orientation:      "portrait-primary",
    lang:             "vi",
    categories:       ["productivity", "education", "lifestyle"],
    icons: [
      {
        src:     "/icon-192.png",
        sizes:   "192x192",
        type:    "image/png",
        purpose: "any",
      },
      {
        src:     "/icon-192-maskable.png",
        sizes:   "192x192",
        type:    "image/png",
        purpose: "maskable",      // Adaptive icons trên Android
      },
      {
        src:     "/icon-512.png",
        sizes:   "512x512",
        type:    "image/png",
        purpose: "any",
      },
      {
        src:     "/icon-512-maskable.png",
        sizes:   "512x512",
        type:    "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src:          "/screenshots/desktop.png",
        sizes:        "1280x720",
        type:         "image/png",
        // @ts-ignore — form_factor chưa có trong TypeScript types
        form_factor:  "wide",
        label:        "FlowState Desktop — Pomodoro Timer và Lofi Music",
      },
      {
        src:          "/screenshots/mobile.png",
        sizes:        "390x844",
        type:         "image/png",
        label:        "FlowState Mobile",
      },
    ],
    shortcuts: [
      {
        name:        "Bắt đầu Focus",
        short_name:  "Focus",
        description: "Mở Pomodoro Timer",
        url:         "/dashboard?tab=focus",
        icons:       [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name:        "Nghe Lofi",
        short_name:  "Lofi",
        description: "Mở Lofi Music Player",
        url:         "/dashboard?tab=music",
        icons:       [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
