// src/app/robots.ts
// Next.js tự động serve tại /robots.txt
// Nói cho Googlebot biết trang nào được/không được crawl

import { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // ── Google và Bing: Cho crawl gần như mọi thứ ──
        userAgent: ["Googlebot", "Bingbot"],
        allow:     "/",
        disallow:  [
          "/admin",       // Admin panel — không index
          "/api/",        // API routes — không phải content
          "/dashboard",   // User dashboard — cần login, không hữu ích với SEO
          "/_next/",      // Next.js internals
        ],
      },
      {
        // ── Tất cả bots khác ───────────────────────────
        userAgent: "*",
        allow:     ["/", "/blog", "/pricing", "/focus"],
        // Thêm "/about", "/privacy", "/terms" khi đã tạo các trang này
        disallow:  ["/admin", "/api/", "/dashboard", "/_next/"],
      },
      {
        // ── Block AI training bots ─────────────────────
        // Tùy bạn: comment out nếu muốn cho phép
        userAgent: ["GPTBot", "CCBot", "anthropic-ai", "Claude-Web"],
        disallow:  "/",
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
