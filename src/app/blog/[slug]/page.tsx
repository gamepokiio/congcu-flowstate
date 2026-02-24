// src/app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createMetadata, schemaBlogPost, schemaBreadcrumb, SITE } from "@/lib/seo";

// ── Mock data ─────────────────────────────────────────────
// Thay bằng fetch từ database khi có bảng BlogPost
const POSTS: Record<string, {
  title: string; description: string; content: string;
  date: string; updatedAt?: string; readTime: string;
  author: string; category: string; tags: string[];
}> = {
  "ky-thuat-pomodoro-la-gi": {
    title:       "Kỹ Thuật Pomodoro Là Gì? Hướng Dẫn Đầy Đủ Từ A-Z",
    description: "Tìm hiểu cách kỹ thuật Pomodoro hoạt động, lợi ích khoa học và cách áp dụng để tăng năng suất ngay hôm nay.",
    date:        "2024-11-15",
    updatedAt:   "2024-12-01",
    readTime:    "8 phút",
    author:      "FlowState Team",
    category:    "Pomodoro",
    tags:        ["pomodoro", "tập trung", "năng suất", "time management"],
    content:     "Nội dung bài viết đầy đủ sẽ được load từ database...",
  },
  "nhac-lofi-giup-tap-trung": {
    title:       "Tại Sao Nhạc Lofi Giúp Bạn Tập Trung Tốt Hơn?",
    description: "Nghiên cứu khoa học chứng minh âm nhạc tần số thấp giúp não tập trung và giảm lo âu.",
    date:        "2024-11-22",
    readTime:    "6 phút",
    author:      "FlowState Team",
    category:    "Lofi Music",
    tags:        ["lofi", "âm nhạc", "não bộ", "focus music"],
    content:     "Nội dung bài viết về Lofi music...",
  },
};

// ── Static Params — pre-render tại build time ─────────────
// Giúp Google index ngay khi deploy, không cần chờ request
export async function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

// ── Dynamic Metadata ──────────────────────────────────────
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = POSTS[params.slug];
  if (!post) return { title: "Không tìm thấy | FlowState" };

  return createMetadata({
    title:       post.title,
    description: post.description,
    path:        `/blog/${params.slug}`,
    // OG image riêng cho từng bài — single encode là đủ, imageUrl sẽ được resolve bởi createMetadata
    image:       `/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`,
  });
}

// ── Page Component ────────────────────────────────────────
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug];
  if (!post) notFound();

  const articleSchema = schemaBlogPost({
    title:       post.title,
    description: post.description,
    slug:        params.slug,
    publishedAt: post.date,
    updatedAt:   post.updatedAt,
    author:      post.author,
    tags:        post.tags,
  });

  const breadcrumbSchema = schemaBreadcrumb([
    { name: "Trang chủ", url: SITE.url },
    { name: "Blog",      url: `${SITE.url}/blog` },
    { name: post.title,  url: `${SITE.url}/blog/${params.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main style={{ minHeight: "100vh", background: "#0d0f14", color: "#e8e2d9", padding: "100px 24px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: 32 }}>
            <ol style={{ display: "flex", gap: 8, alignItems: "center", listStyle: "none", padding: 0, fontSize: ".78rem", color: "rgba(232,226,217,0.4)" }}>
              <li><Link href="/"     style={{ color: "inherit", textDecoration: "none" }}>Trang chủ</Link></li>
              <li aria-hidden>›</li>
              <li><Link href="/blog" style={{ color: "inherit", textDecoration: "none" }}>Blog</Link></li>
              <li aria-hidden>›</li>
              <li aria-current="page" style={{ color: "#e8a87c", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{post.title}</li>
            </ol>
          </nav>

          {/* Article header */}
          <header style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
              <span style={{ padding: "3px 12px", borderRadius: 8, background: "rgba(232,168,124,0.1)",
                border: "1px solid rgba(232,168,124,0.2)", color: "#e8a87c", fontSize: ".7rem", fontWeight: 600 }}>
                {post.category}
              </span>
              <time dateTime={post.date} style={{ fontSize: ".72rem", color: "rgba(232,226,217,0.35)" }}>
                {new Date(post.date).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" })}
              </time>
              <span style={{ fontSize: ".72rem", color: "rgba(232,226,217,0.35)" }}>· {post.readTime} đọc</span>
            </div>

            <h1 style={{ fontFamily: "Lora, serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", lineHeight: 1.3, marginBottom: 16 }}>
              {post.title}
            </h1>

            <p style={{ color: "rgba(232,226,217,0.55)", fontSize: ".95rem", lineHeight: 1.75, borderLeft: "3px solid #e8a87c", paddingLeft: 16 }}>
              {post.description}
            </p>
          </header>

          {/* Author */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40,
            padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #e8a87c, #c8a7e8)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
              🌿
            </div>
            <div>
              <div style={{ fontSize: ".82rem", fontWeight: 600 }}>{post.author}</div>
              <div style={{ fontSize: ".72rem", color: "rgba(232,226,217,0.4)" }}>
                {post.updatedAt ? `Cập nhật ${new Date(post.updatedAt).toLocaleDateString("vi-VN")}` : new Date(post.date).toLocaleDateString("vi-VN")}
              </div>
            </div>
          </div>

          {/* Article content — semantic HTML cho SEO */}
          <article
            className="prose"
            style={{ color: "rgba(232,226,217,0.7)", lineHeight: 1.85, fontSize: ".9rem" }}
          >
            {/* Nội dung thực sẽ được render từ MDX hoặc rich text */}
            <p>{post.content}</p>
          </article>

          {/* Tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 40, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {post.tags.map((tag) => (
              <span key={tag} style={{ padding: "4px 12px", borderRadius: 8,
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)",
                fontSize: ".72rem", color: "rgba(232,226,217,0.45)" }}>
                #{tag}
              </span>
            ))}
          </div>

          {/* CTA trong bài */}
          <div style={{ marginTop: 48, padding: "28px 32px", borderRadius: 18,
            background: "linear-gradient(135deg, rgba(232,168,124,0.08), rgba(126,200,200,0.04))",
            border: "1px solid rgba(232,168,124,0.18)", textAlign: "center" }}>
            <div style={{ fontSize: "1.4rem", marginBottom: 10 }}>🌿</div>
            <div style={{ fontFamily: "Lora, serif", fontSize: "1.1rem", marginBottom: 10 }}>
              Thử FlowState ngay hôm nay
            </div>
            <p style={{ color: "rgba(232,226,217,0.5)", fontSize: ".85rem", marginBottom: 18 }}>
              Áp dụng những gì bạn vừa đọc — miễn phí hoàn toàn.
            </p>
            <Link href="/dashboard"
              style={{ padding: "11px 28px", borderRadius: 24, background: "#e8a87c", color: "#1a0f00",
                fontWeight: 700, fontSize: ".9rem", textDecoration: "none", display: "inline-block" }}>
              Bắt đầu Focus ngay →
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
