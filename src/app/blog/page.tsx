// src/app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata, schemaBreadcrumb, SITE } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title:       "Blog — Năng Suất & Tập Trung",
  description: "Bài viết về kỹ thuật Pomodoro, phương pháp học tập hiệu quả, nhạc Lofi và cách tối ưu năng suất làm việc. Cập nhật hàng tuần.",
  path:        "/blog",
});

// Mock data — thay bằng fetch từ DB sau khi có bảng BlogPost
const POSTS = [
  {
    slug:        "ky-thuat-pomodoro-la-gi",
    title:       "Kỹ Thuật Pomodoro Là Gì? Hướng Dẫn Đầy Đủ Từ A-Z",
    excerpt:     "Tìm hiểu cách kỹ thuật Pomodoro hoạt động, lợi ích khoa học và cách áp dụng để tăng năng suất ngay hôm nay.",
    date:        "2024-11-15",
    readTime:    "8 phút",
    category:    "Pomodoro",
    tags:        ["pomodoro", "tập trung", "năng suất"],
  },
  {
    slug:        "nhac-lofi-giup-tap-trung",
    title:       "Tại Sao Nhạc Lofi Giúp Bạn Tập Trung Tốt Hơn? Khoa Học Giải Thích",
    excerpt:     "Nghiên cứu khoa học chứng minh âm nhạc tần số thấp, nhịp điệu ổn định giúp não tập trung và giảm lo âu như thế nào.",
    date:        "2024-11-22",
    readTime:    "6 phút",
    category:    "Lofi Music",
    tags:        ["lofi", "âm nhạc", "não bộ"],
  },
  {
    slug:        "deep-work-cal-newport",
    title:       "Deep Work Là Gì? 5 Chiến Lược Cal Newport Để Tập Trung Sâu",
    excerpt:     "Khám phá khái niệm 'Deep Work' từ bestseller của Cal Newport và cách FlowState giúp bạn thực hành mỗi ngày.",
    date:        "2024-12-01",
    readTime:    "10 phút",
    category:    "Productivity",
    tags:        ["deep work", "cal newport", "chiến lược"],
  },
  {
    slug:        "habit-tracker-xay-dung-thoi-quen",
    title:       "Habit Tracker: Xây Dựng Thói Quen Bền Vững Với Khoa Học",
    excerpt:     "Vì sao 80% người bỏ cuộc sau 2 tuần? Cách thiết lập habit tracker đúng cách để tạo thói quen bền vững nhờ habit stacking.",
    date:        "2024-12-08",
    readTime:    "7 phút",
    category:    "Habits",
    tags:        ["habit tracker", "thói quen", "tự kỷ luật"],
  },
] as const;

const CATEGORIES = ["Tất cả", "Pomodoro", "Lofi Music", "Productivity", "Habits", "Study Tips"];

export default function BlogPage() {
  const breadcrumbSchema = schemaBreadcrumb([
    { name: "Trang chủ", url: SITE.url },
    { name: "Blog",      url: `${SITE.url}/blog` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main style={{ minHeight: "100vh", background: "#0d0f14", color: "#e8e2d9", padding: "100px 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* Breadcrumb — visible + semantic */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: 32 }}>
            <ol style={{ display: "flex", gap: 8, alignItems: "center", listStyle: "none", padding: 0, fontSize: ".78rem", color: "rgba(232,226,217,0.4)" }}>
              <li><Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Trang chủ</Link></li>
              <li aria-hidden>›</li>
              <li aria-current="page" style={{ color: "#e8a87c" }}>Blog</li>
            </ol>
          </nav>

          {/* Header */}
          <header style={{ marginBottom: 48 }}>
            <h1 style={{ fontFamily: "Lora, serif", fontSize: "2.5rem", marginBottom: 14 }}>
              Blog FlowState
            </h1>
            <p style={{ color: "rgba(232,226,217,0.55)", fontSize: ".95rem", lineHeight: 1.7 }}>
              Bài viết về năng suất, kỹ thuật Pomodoro, nhạc Lofi và cách học tập hiệu quả. Cập nhật 2 bài/tuần.
            </p>
          </header>

          {/* Category filter */}
          <div role="navigation" aria-label="Lọc theo danh mục" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
            {CATEGORIES.map((cat) => (
              <button key={cat}
                style={{ padding: "5px 16px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)",
                  background: cat === "Tất cả" ? "#e8a87c" : "transparent",
                  color: cat === "Tất cả" ? "#1a0f00" : "rgba(232,226,217,0.55)",
                  cursor: "pointer", fontFamily: "inherit", fontSize: ".78rem", fontWeight: cat === "Tất cả" ? 600 : 400 }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Posts grid */}
          <div style={{ display: "grid", gap: 20 }} role="feed" aria-label="Danh sách bài viết">
            {POSTS.map((post) => (
              <article key={post.slug}
                style={{ padding: "24px 28px", borderRadius: 18, background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)", transition: "all .2s" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                  <span style={{ padding: "2px 10px", borderRadius: 8, background: "rgba(232,168,124,0.1)",
                    border: "1px solid rgba(232,168,124,0.18)", color: "#e8a87c", fontSize: ".68rem", fontWeight: 600 }}>
                    {post.category}
                  </span>
                  <time dateTime={post.date} style={{ fontSize: ".72rem", color: "rgba(232,226,217,0.35)" }}>
                    {new Date(post.date).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" })}
                  </time>
                  <span style={{ fontSize: ".72rem", color: "rgba(232,226,217,0.35)" }}>· {post.readTime} đọc</span>
                </div>

                <h2 style={{ fontFamily: "Lora, serif", fontSize: "1.15rem", marginBottom: 10, lineHeight: 1.4 }}>
                  <Link href={`/blog/${post.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {post.title}
                  </Link>
                </h2>

                <p style={{ color: "rgba(232,226,217,0.5)", fontSize: ".85rem", lineHeight: 1.7, marginBottom: 16 }}>
                  {post.excerpt}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {post.tags.map((tag) => (
                      <span key={tag} style={{ fontSize: ".65rem", padding: "2px 8px", borderRadius: 6,
                        background: "rgba(255,255,255,0.07)", color: "rgba(232,226,217,0.4)" }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug}`}
                    style={{ fontSize: ".8rem", color: "#7ec8c8", textDecoration: "none" }}>
                    Đọc tiếp →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
