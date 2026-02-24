import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // QUAN TRỌNG: Cần thiết cho Docker multi-stage build
  // Tạo ra thư mục .next/standalone chứa tất cả để chạy độc lập
  output: "standalone",

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // CSP: cho phép YouTube iframe, Google Fonts, NextAuth
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // YouTube embed
              "frame-src https://www.youtube.com https://youtube.com",
              // Next.js needs inline scripts (RSC payload, schema JSON-LD)
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Tailwind inline styles
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Google Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // API calls, images
              "img-src 'self' data: https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
              "connect-src 'self'",
              "media-src 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Redirect www → non-www
  // QUAN TRỌNG: Thay YOUR_DOMAIN bằng domain thực trong .env
  // Hoặc dùng biến env để tránh hardcode
  async redirects() {
    const domain = process.env.NEXT_PUBLIC_APP_URL?.replace("https://", "") || "";
    if (!domain) return [];
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${domain}` }],
        destination: `https://${domain}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
