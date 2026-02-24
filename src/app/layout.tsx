// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { SITE, schemaWebApp, schemaOrganization } from "@/lib/seo";
import "./globals.css";
import { Providers } from "./providers";

// ── Viewport (mobile-first, PWA) ────────────────────────
export const viewport: Viewport = {
  width:              "device-width",
  initialScale:       1,
  maximumScale:       5,
  themeColor:         [
    { media: "(prefers-color-scheme: dark)",  color: "#0d0f14" },
    { media: "(prefers-color-scheme: light)", color: "#e8a87c" },
  ],
};

// ── Root Metadata ────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),

  title: {
    default:  `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,          // "Blog | FlowState"
  },
  description:  SITE.description,
  keywords:     SITE.keywords,
  authors:      [{ name: SITE.author, url: SITE.url }],
  creator:      SITE.name,
  publisher:    SITE.name,

  // ── Open Graph ────────────────────────────────────────
  openGraph: {
    type:     "website",
    locale:   "vi_VN",
    url:      SITE.url,
    title:    `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    siteName: SITE.name,
    images: [{
      url:    "/og-image.png",
      width:  1200,
      height: 630,
      alt:    `${SITE.name} — Pomodoro Timer & Lofi Music`,
      type:   "image/png",
    }],
  },

  // ── Twitter / X ───────────────────────────────────────
  twitter: {
    card:        "summary_large_image",
    site:        SITE.twitter,
    creator:     SITE.twitter,
    title:       `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images:      ["/og-image.png"],
  },

  // ── Robots ────────────────────────────────────────────
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },

  // ── Canonical & Alternates ────────────────────────────
  alternates: {
    canonical: SITE.url,
    // Thêm language alternates khi có /en route
    // languages: {
    //   "vi-VN": SITE.url,
    //   "en-US": `${SITE.url}/en`,
    // },
  },

  // ── Icons & PWA ──────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico",                        sizes: "any"    },
      { url: "/icon-16.png",  type: "image/png",    sizes: "16x16"  },
      { url: "/icon-32.png",  type: "image/png",    sizes: "32x32"  },
      { url: "/icon-192.png", type: "image/png",    sizes: "192x192"},
      { url: "/icon-512.png", type: "image/png",    sizes: "512x512"},
    ],
    apple:    [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  manifest:     "/manifest.json",

  // ── Verification ──────────────────────────────────────
  // Điền sau khi verify trong Search Console và Bing
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? {
        google: process.env.GOOGLE_SITE_VERIFICATION,
        // bing: "your-bing-verification-code",
      }
    : undefined,

  // ── App metadata ──────────────────────────────────────
  applicationName: SITE.name,
  category:        "productivity",
  classification:  "Productivity App",
  referrer:        "origin-when-cross-origin",
  formatDetection: { email: false, telephone: false, address: false },
};

// ── Root Layout Component ────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Preconnect — giảm latency tải fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch cho external resources */}
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Schema.org: WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebApp()) }}
        />
        {/* Schema.org: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization()) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
