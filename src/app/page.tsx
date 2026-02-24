// src/app/page.tsx — Landing Page (SEO-optimized)
import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata, schemaFAQ, SITE } from "@/lib/seo";

// ── Page-specific Metadata ───────────────────────────────
export const metadata: Metadata = createMetadata({
  // Không đặt title → dùng default: "FlowState — Pomodoro Timer & Lofi Music for Deep Focus"
  description: "Tập trung sâu hơn với FlowState: Pomodoro timer thông minh, nhạc Lofi chất lượng cao, quản lý tasks và theo dõi habits. Miễn phí, không cần cài đặt. 10,000+ người dùng.",
  path:        "/",
});

// ── Static Data ──────────────────────────────────────────
const FEATURES = [
  { icon: "🍅", title: "Pomodoro Timer", desc: "4 chế độ: Focus 25', Short Break, Long Break, Deep Work 50'. Dual progress ring theo dõi daily goal. Âm thanh thông báo nhẹ nhàng bằng Web Audio API." },
  { icon: "🎵", title: "Lofi Radio", desc: "Stream nhạc Lofi trực tiếp từ YouTube. Dán bất kỳ link YouTube nào để phát. 5+ playlist curated sẵn, unlock thêm với Premium." },
  { icon: "📝", title: "Task Manager", desc: "Quản lý tasks với priority High/Medium/Low, ước tính Pomodoro cần thiết. Brain Dump mode để capture ý tưởng tức thì không mất tập trung." },
  { icon: "💪", title: "Habit Tracker", desc: "Theo dõi thói quen hàng ngày với streak counter, heatmap 90 ngày và emoji tùy chọn. Kết nối mood với performance qua ngày." },
  { icon: "📊", title: "Focus Insights", desc: "Biểu đồ focus time theo tuần, phân tích giờ vàng hiệu quả nhất, mood vs performance chart. AI suggestions (Premium)." },
  { icon: "🌌", title: "Zen Mode", desc: "Fullscreen tối giản chỉ hiện đồng hồ và task đang làm. Loại bỏ hoàn toàn distraction, vào trạng thái flow trong vài giây." },
  { icon: "💧", title: "Water Tracker", desc: "Nhắc nhở uống nước đủ 8 ly/ngày. Tích hợp ngay trong sidebar, không cần app khác." },
  { icon: "✍️", title: "Daily Journal", desc: "Ghi chú tâm trạng, suy nghĩ cuối ngày với handwriting font. AI reflection prompts (Premium) giúp review sâu hơn." },
] as const;

const FAQ = [
  { q: "FlowState là gì và hoạt động như thế nào?", a: "FlowState là ứng dụng web kết hợp kỹ thuật Pomodoro (25 phút tập trung + 5 phút nghỉ), nhạc Lofi và quản lý tasks. Bạn chọn task, bật nhạc, khởi động timer — app giúp bạn duy trì trạng thái tập trung sâu trong nhiều giờ liên tiếp." },
  { q: "FlowState có miễn phí không?", a: "Có! FlowState miễn phí mãi mãi cho tính năng cơ bản: Pomodoro Timer đầy đủ, 3 Lofi playlists, Task Manager, Habit Tracker cơ bản. Gói Premium (79,000đ/tháng) mở khóa thêm nhạc, AI insights, cloud sync và nhiều hơn nữa." },
  { q: "Tôi có cần cài đặt gì không?", a: "Không cần cài đặt gì cả! FlowState chạy hoàn toàn trên trình duyệt web. Mở flowstate.app và bắt đầu ngay. Bạn có thể đăng nhập bằng Google để sync data giữa các thiết bị." },
  { q: "Kỹ thuật Pomodoro là gì?", a: "Kỹ thuật Pomodoro do Francesco Cirillo phát triển: làm việc 25 phút tập trung hoàn toàn (1 Pomodoro), nghỉ 5 phút, lặp lại 4 lần rồi nghỉ dài 15 phút. Phương pháp này giúp não duy trì độ tập trung cao và tránh burnout." },
  { q: "Tôi có thể dùng nhạc YouTube của mình không?", a: "Có! FlowState cho phép bạn dán link YouTube bất kỳ để phát nhạc trong khi làm việc. Chỉ cần copy URL từ YouTube và paste vào ô Custom URL trong Music Player. Miễn phí không giới hạn." },
  { q: "FlowState có hoạt động offline không?", a: "Timer và task manager hoạt động khi mất mạng. Tuy nhiên, nhạc Lofi cần kết nối internet vì stream từ YouTube. Chúng tôi đang phát triển tính năng offline mode đầy đủ cho phiên bản tiếp theo." },
] as const;

const STATS = [
  { num: "10,000+", label: "Người dùng" },
  { num: "500K+",   label: "Pomodoro sessions" },
  { num: "4.9 ⭐",  label: "Rating trung bình" },
  { num: "100%",    label: "Tính năng cơ bản miễn phí" },
] as const;

// ── Page Component ───────────────────────────────────────
export default function LandingPage() {
  const faqSchema = schemaFAQ(FAQ.map((f) => ({ q: f.q, a: f.a })));

  return (
    <>
      {/* FAQ Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main style={{ minHeight: "100vh", background: "#0d0f14", color: "#e8e2d9" }}>
        {/* Background */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 50% at 10% 20%, rgba(232,168,124,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 80%, rgba(126,200,200,0.05) 0%, transparent 55%)" }} />

        {/* ── NAVBAR ── */}
        <nav aria-label="Main navigation" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: 60,
          background: "rgba(9,12,18,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <Link href="/" aria-label="FlowState — Trang chủ"
            style={{ fontFamily: "Lora, serif", fontSize: "1.1rem", color: "#e8a87c", textDecoration: "none",
              display: "flex", alignItems: "center", gap: 8 }}>
            🌿 <span>FlowState</span>
          </Link>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/blog"    style={{ padding: "6px 14px", fontSize: ".8rem", color: "rgba(232,226,217,0.5)", textDecoration: "none" }}>Blog</Link>
            <Link href="/pricing" style={{ padding: "6px 14px", fontSize: ".8rem", color: "rgba(232,226,217,0.5)", textDecoration: "none" }}>Giá cả</Link>
            <Link href="/login"   style={{ padding: "7px 18px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)", color: "rgba(232,226,217,0.6)", fontSize: ".8rem", textDecoration: "none" }}>Đăng nhập</Link>
            <Link href="/dashboard" style={{ padding: "7px 18px", borderRadius: 20, background: "#e8a87c", color: "#1a0f00", fontWeight: 700, fontSize: ".8rem", textDecoration: "none" }}>Dùng miễn phí →</Link>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section aria-label="Hero" style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "100vh", padding: "120px 24px 80px" }}>

          {/* Eyebrow */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 16px", borderRadius: 20,
            background: "rgba(232,168,124,.1)", border: "1px solid rgba(232,168,124,.2)",
            fontSize: ".7rem", fontWeight: 600, color: "#e8a87c", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 20 }}>
            ✨ v2.0 — AI Insights &amp; Zen Mode
          </div>

          {/* H1 — chứa primary keyword */}
          <h1 style={{ fontFamily: "Lora, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 600, lineHeight: 1.2, maxWidth: 800, marginBottom: 20 }}>
            Tập trung sâu hơn với{" "}
            <span style={{ color: "#e8a87c" }}>Pomodoro Timer</span>{" "}
            &amp;{" "}
            <span style={{ color: "#7ec8c8" }}>Nhạc Lofi</span>
          </h1>

          {/* Description — chứa secondary keywords */}
          <p style={{ fontSize: "1rem", color: "rgba(232,226,217,0.6)", maxWidth: 600, lineHeight: 1.85, marginBottom: 36 }}>
            FlowState kết hợp <strong style={{ color: "rgba(232,226,217,0.85)" }}>kỹ thuật Pomodoro</strong>,{" "}
            nhạc Lofi chất lượng cao, quản lý tasks và theo dõi habits — giúp bạn
            duy trì trạng thái flow hàng giờ liên tiếp mà không kiệt sức.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 56 }}>
            <Link href="/dashboard"
              style={{ padding: "14px 36px", borderRadius: 28, background: "#e8a87c", color: "#1a0f00",
                fontWeight: 700, fontSize: "1rem", textDecoration: "none",
                boxShadow: "0 4px 24px rgba(232,168,124,0.35)" }}>
              🚀 Bắt đầu miễn phí — không cần đăng ký
            </Link>
            <Link href="#features"
              style={{ padding: "14px 24px", borderRadius: 28, border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(232,226,217,0.6)", fontSize: ".9rem", textDecoration: "none" }}>
              Xem tính năng ↓
            </Link>
          </div>

          {/* Stats — E-E-A-T signal */}
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center",
            paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Lora, serif", fontSize: "1.9rem", fontWeight: 600, color: "#e8a87c" }}>{s.num}</div>
                <div style={{ fontSize: ".7rem", color: "rgba(232,226,217,0.4)", textTransform: "uppercase", letterSpacing: ".08em", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" aria-label="Tính năng" style={{ position: "relative", zIndex: 1, padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Lora, serif", fontSize: "2rem", textAlign: "center", marginBottom: 12 }}>
            Mọi thứ bạn cần để tập trung
          </h2>
          <p style={{ textAlign: "center", color: "rgba(232,226,217,0.5)", fontSize: ".9rem", marginBottom: 48, maxWidth: 500, margin: "0 auto 48px" }}>
            Một workspace đủ mạnh, đủ đẹp để bạn muốn quay lại mỗi ngày
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {FEATURES.map((f) => (
              <article key={f.title} style={{ padding: "22px 24px", borderRadius: 18,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: "1.8rem", marginBottom: 12 }} aria-hidden="true">{f.icon}</div>
                <h3 style={{ fontWeight: 600, marginBottom: 8, fontSize: ".95rem" }}>{f.title}</h3>
                <p style={{ fontSize: ".82rem", color: "rgba(232,226,217,0.5)", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── POMODORO EXPLAINER (SEO content) ── */}
        <section aria-label="Kỹ thuật Pomodoro" style={{ position: "relative", zIndex: 1, padding: "80px 24px", maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Lora, serif", fontSize: "1.8rem", marginBottom: 20 }}>
            Kỹ thuật Pomodoro hoạt động như thế nào?
          </h2>
          <p style={{ color: "rgba(232,226,217,0.6)", lineHeight: 1.85, marginBottom: 16 }}>
            <strong style={{ color: "#e8e2d9" }}>Pomodoro Technique</strong> là phương pháp quản lý thời gian
            do Francesco Cirillo phát triển vào cuối thập niên 1980. Nguyên tắc cốt lõi: chia công việc
            thành các intervals 25 phút tập trung hoàn toàn (gọi là "Pomodoro"), xen kẽ với các khoảng nghỉ ngắn.
          </p>
          <p style={{ color: "rgba(232,226,217,0.6)", lineHeight: 1.85, marginBottom: 16 }}>
            Nghiên cứu khoa học chứng minh não người không thể duy trì sự chú ý liên tục quá 20–30 phút.
            Bằng cách làm việc theo sprint ngắn và nghỉ có chủ đích, bạn duy trì được{" "}
            <strong style={{ color: "#e8e2d9" }}>độ tập trung cao</strong> suốt nhiều giờ mà không bị kiệt sức
            tinh thần (mental fatigue).
          </p>
          <p style={{ color: "rgba(232,226,217,0.6)", lineHeight: 1.85 }}>
            FlowState kết hợp thêm <strong style={{ color: "#7ec8c8" }}>nhạc Lofi</strong> — thể loại nhạc nền
            có nhịp điệu ổn định, không có lời, được chứng minh giúp tăng khả năng tập trung và giảm lo âu —
            tạo ra môi trường học tập và làm việc tối ưu.
          </p>
        </section>

        {/* ── FAQ ── */}
        <section aria-label="Câu hỏi thường gặp" style={{ position: "relative", zIndex: 1, padding: "80px 24px", maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Lora, serif", fontSize: "1.8rem", marginBottom: 36, textAlign: "center" }}>
            Câu hỏi thường gặp
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQ.map((item) => (
              <details key={item.q}
                style={{ padding: "16px 20px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}>
                <summary style={{ fontWeight: 600, fontSize: ".9rem", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {item.q} <span style={{ color: "rgba(232,226,217,0.4)", fontSize: ".8rem" }}>▾</span>
                </summary>
                <p style={{ marginTop: 12, color: "rgba(232,226,217,0.6)", fontSize: ".85rem", lineHeight: 1.7, margin: "12px 0 0" }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section aria-label="Call to action" style={{ position: "relative", zIndex: 1, padding: "80px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 36px", borderRadius: 24,
            background: "linear-gradient(135deg, rgba(232,168,124,0.08), rgba(126,200,200,0.04))",
            border: "1px solid rgba(232,168,124,0.18)" }}>
            <h2 style={{ fontFamily: "Lora, serif", fontSize: "1.8rem", marginBottom: 14 }}>
              Sẵn sàng vào flow chưa? 🌿
            </h2>
            <p style={{ color: "rgba(232,226,217,0.5)", marginBottom: 28, lineHeight: 1.7 }}>
              Miễn phí mãi mãi cho tính năng cơ bản. Không cần thẻ tín dụng. Không cần cài đặt.
            </p>
            <Link href="/dashboard"
              style={{ padding: "14px 40px", borderRadius: 28, background: "#e8a87c", color: "#1a0f00",
                fontWeight: 700, fontSize: "1rem", textDecoration: "none", display: "inline-block" }}>
              Bắt đầu ngay — miễn phí
            </Link>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ position: "relative", zIndex: 1, padding: "32px 24px", borderTop: "1px solid rgba(255,255,255,0.07)",
          textAlign: "center", fontSize: ".76rem", color: "rgba(232,226,217,0.3)" }}>
          <nav aria-label="Footer navigation" style={{ marginBottom: 12, display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/about"   style={{ color: "inherit", textDecoration: "none" }}>Về chúng tôi</Link>
            <Link href="/pricing" style={{ color: "inherit", textDecoration: "none" }}>Giá cả</Link>
            <Link href="/blog"    style={{ color: "inherit", textDecoration: "none" }}>Blog</Link>
            <Link href="/privacy" style={{ color: "inherit", textDecoration: "none" }}>Chính sách bảo mật</Link>
            <Link href="/terms"   style={{ color: "inherit", textDecoration: "none" }}>Điều khoản</Link>
          </nav>
          <div>🌿 FlowState © {new Date().getFullYear()} · Tập trung sâu, sống đủ đầy</div>
        </footer>
      </main>
    </>
  );
}
