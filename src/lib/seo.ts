// src/lib/seo.ts
// ─── Trung tâm cấu hình SEO cho toàn bộ FlowState ──────
// Thay đổi ở đây → áp dụng cho tất cả pages

import type { Metadata } from "next";

// ── Thông tin app ────────────────────────────────────────
export const SITE = {
  name: "FlowState",
  tagline: "Pomodoro Timer & Lofi Music for Deep Focus",
  description: "Ứng dụng Pomodoro timer kết hợp nhạc Lofi giúp bạn tập trung sâu. Quản lý tasks, habits, goals và theo dõi tiến độ mỗi ngày. Miễn phí mãi mãi.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://flowstate.app",
  locale: "vi_VN",
  localeAlt: "en_US",
  twitter: "@flowstateapp",
  author: "FlowState Team",
  keywords: [
    // Tiếng Việt
    "pomodoro timer",
    "nhạc lofi học bài",
    "ứng dụng tập trung",
    "quản lý thời gian",
    "lofi music việt nam",
    "app học tập hiệu quả",
    "theo dõi thói quen",
    "focus timer online",
    // English
    "pomodoro technique",
    "lofi music for studying",
    "productivity app",
    "study timer",
    "focus music",
    "habit tracker",
    "task manager free",
    "deep work timer",
  ],
};

// ── Helper: tạo metadata chuẩn cho từng page ─────────────
export function createMetadata(overrides: Partial<Metadata> & {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  image?: string;
}): Metadata {
  const {
    title,
    description = SITE.description,
    path = "",
    noIndex = false,
    image = "/og-image.png",
    ...rest
  } = overrides;

  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const url = `${SITE.url}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE.url}${image}`;

  return {
    title: fullTitle,
    description,
    keywords: SITE.keywords,
    authors: [{ name: SITE.author }],
    creator: SITE.name,
    publisher: SITE.name,
    metadataBase: new URL(SITE.url),
    alternates: {
      canonical: url,
      // Chỉ thêm language alternates khi thực sự có /en route
      // languages: {
      //   "vi-VN": `${SITE.url}${path}`,
      //   "en-US": `${SITE.url}/en${path}`,
      // },
    },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      alternateLocale: [SITE.localeAlt],
      url,
      title: fullTitle,
      description,
      siteName: SITE.name,
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: fullTitle,
        type: "image/png",
      }],
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.twitter,
      creator: SITE.twitter,
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    ...rest,
  };
}

// ── Schema.org JSON-LD builders ──────────────────────────

export function schemaWebApp() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web, iOS, Android",
    browserRequirements: "Requires JavaScript",
    inLanguage: ["vi", "en"],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      description: "Miễn phí mãi mãi cho tính năng cơ bản",
    },
    // aggregateRating: Chỉ thêm khi có đủ reviews thực từ DB.
    // Google penalty nếu phát hiện rating giả. Ví dụ khi có data:
    // aggregateRating: {
    //   "@type":      "AggregateRating",
    //   ratingValue:  averageRating,
    //   reviewCount:  totalReviews,
    //   bestRating:   "5",
    //   worstRating:  "1",
    // },
    featureList: [
      "Pomodoro Timer",
      "Lofi Music Player",
      "Task Manager",
      "Habit Tracker",
      "Focus Insights",
      "Zen Mode",
      "Custom YouTube URL",
    ],
  };
}

export function schemaOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.png`,
    sameAs: [
      "https://twitter.com/flowstateapp",
      "https://github.com/flowstateapp",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["Vietnamese", "English"],
      email: "support@flowstate.app",
    },
  };
}

export function schemaBlogPost(post: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  image?: string;
  tags?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${SITE.url}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    image: post.image || `${SITE.url}/og-image.png`,
    inLanguage: "vi",
    keywords: post.tags?.join(", "),
    author: {
      "@type": "Person",
      name: post.author || SITE.author,
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/blog/${post.slug}`,
    },
  };
}

export function schemaFAQ(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function schemaBreadcrumb(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
