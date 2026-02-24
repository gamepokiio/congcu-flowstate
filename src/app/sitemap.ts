// src/app/sitemap.ts
// Next.js tự động serve tại /sitemap.xml
// Submit lên: Google Search Console → Sitemaps → Add sitemap URL

import { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
// import { db } from "@/lib/db"; // Uncomment khi dùng dynamic blog posts từ DB

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Static pages ────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url:            SITE.url,
      lastModified:   now,
      changeFrequency: "weekly",
      priority:       1.0,        // Trang chủ — ưu tiên cao nhất
    },
    {
      url:            `${SITE.url}/pricing`,
      lastModified:   now,
      changeFrequency: "monthly",
      priority:       0.9,
    },
    {
      url:            `${SITE.url}/blog`,
      lastModified:   now,
      changeFrequency: "daily",
      priority:       0.8,
    },
    // Thêm /about, /privacy, /terms vào đây khi đã tạo các trang này
    // {
    //   url:            `${SITE.url}/about`,
    //   lastModified:   now,
    //   changeFrequency: "monthly",
    //   priority:       0.7,
    // },
    // {
    //   url:            `${SITE.url}/privacy`,
    //   lastModified:   now,
    //   changeFrequency: "yearly",
    //   priority:       0.3,
    // },
    // {
    //   url:            `${SITE.url}/terms`,
    //   lastModified:   now,
    //   changeFrequency: "yearly",
    //   priority:       0.3,
    // },
  ];

  // ── Blog posts (dynamic từ database) ─────────────────
  // Khi bạn thêm bảng BlogPost vào schema, uncomment phần này:
  // const posts = await db.blogPost.findMany({
  //   where:    { published: true },
  //   select:   { slug: true, updatedAt: true },
  //   orderBy:  { publishedAt: "desc" },
  // });
  // const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
  //   url:             `${SITE.url}/blog/${post.slug}`,
  //   lastModified:    post.updatedAt,
  //   changeFrequency: "monthly",
  //   priority:        0.7,
  // }));

  // ── Programmatic SEO pages (focus timer for X) ──────
  // Các trang được tạo tự động để target long-tail keywords
  const professions = [
    "sinh-vien",
    "lap-trinh-vien",
    "designer",
    "ke-toan",
    "bac-si",
    "giao-vien",
    "freelancer",
    "writer",
  ];
  const programmaticPages: MetadataRoute.Sitemap = professions.map((p) => ({
    url:             `${SITE.url}/focus/${p}`,
    lastModified:    now,
    changeFrequency: "monthly" as const,
    priority:        0.6,
  }));

  return [...staticPages, ...programmaticPages];
}
