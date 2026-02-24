// src/app/focus/[profession]/page.tsx
// Programmatic SEO: tạo trang riêng cho mỗi ngành nghề
// Mục tiêu: rank cho "pomodoro timer cho sinh viên", "focus app cho lập trình viên", v.v.

import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata, schemaFAQ, SITE } from "@/lib/seo";
import { notFound } from "next/navigation";

// ── Data cho từng ngành nghề ──────────────────────────────
const PROFESSIONS: Record<string, {
  name:     string;
  nameEn:   string;
  icon:     string;
  keyword:  string;
  tips:     string[];
  schedule: { time: string; task: string }[];
  faq:      Array<{ q: string; a: string }>;
}> = {
  "sinh-vien": {
    name:    "Sinh Viên",
    nameEn:  "Student",
    icon:    "🎓",
    keyword: "sinh viên",
    tips: [
      "Học mỗi môn 1-2 Pomodoro, xen kẽ review ngay sau break",
      "Dùng Brain Dump để ghi nhanh ý tưởng khi đang học không bị gián đoạn",
      "Bật nhạc Lofi không có lời khi đọc sách, tắt khi làm bài tập tính toán",
      "Đặt goal 6-8 Pomodoro/ngày trong mùa thi",
    ],
    schedule: [
      { time: "7:00-9:00",   task: "4 Pomodoro — Ôn bài buổi sáng (giờ vàng nhớ nhất)" },
      { time: "14:00-16:00", task: "4 Pomodoro — Làm bài tập, đọc tài liệu" },
      { time: "20:00-22:00", task: "4 Pomodoro — Chuẩn bị cho ngày mai" },
    ],
    faq: [
      { q: "Nên học bao nhiêu Pomodoro mỗi ngày?", a: "Sinh viên nên bắt đầu với 4-6 Pomodoro/ngày và tăng dần lên 8-10 khi quen. Quan trọng là chất lượng tập trung, không phải số lượng. Nghiên cứu cho thấy não sinh viên hoạt động tốt nhất vào buổi sáng sớm và sau giấc ngủ trưa." },
      { q: "Nên nghe loại nhạc gì khi học?", a: "Nhạc Lofi không có lời giúp sinh viên tập trung tốt nhất khi đọc và viết. Tránh nhạc có lời vì não phải xử lý lyrics song song với việc học, gây giảm hiệu quả 20-30%. Nhạc cổ điển nhịp 60 BPM (Mozart, Bach) cũng rất hiệu quả." },
    ],
  },
  "lap-trinh-vien": {
    name:    "Lập Trình Viên",
    nameEn:  "Developer",
    icon:    "💻",
    keyword: "lập trình viên",
    tips: [
      "Deep Work 50 phút cho complex tasks như debugging hay architecture design",
      "Commit code trước mỗi break để dễ context-switch trở lại",
      "Dùng Brain Dump cho TODO list khi đang code, tránh mở tab mới",
      "Track Pomodoro theo task trên Jira/Github Issue",
    ],
    schedule: [
      { time: "9:00-12:00",  task: "6 Pomodoro — Deep work: coding, architecture (no meetings)" },
      { time: "14:00-16:00", task: "4 Pomodoro — Code review, documentation" },
      { time: "16:00-17:00", task: "2 Pomodoro — Emails, Slack, async communication" },
    ],
    faq: [
      { q: "25 phút có đủ cho lập trình viên không?", a: "Nhiều developer thích interval 50 phút (Deep Work mode) vì code thường cần thời gian để vào trạng thái flow. FlowState có chế độ Deep Work 50' phù hợp hơn cho coding sessions phức tạp. Thử cả hai và chọn cái phù hợp với bạn." },
      { q: "Nên nghe gì khi code?", a: "Lo-fi hip hop và ambient electronic music phổ biến nhất với developer. Nhiều người cũng thích white noise hoặc brown noise. Tránh podcast hay nhạc có lời khi code vì não cần tập trung xử lý ngôn ngữ lập trình." },
    ],
  },
  "designer": {
    name:    "Designer",
    nameEn:  "Designer",
    icon:    "🎨",
    keyword: "designer",
    tips: [
      "Brainstorming và sketching 1 Pomodoro, execution 2-3 Pomodoro",
      "Break 5 phút: đứng dậy nhìn xa để tránh mỏi mắt",
      "Dùng mood tracking để biết thời gian nào sáng tạo nhất",
      "Lofi ambient phù hợp hơn lofi hip hop cho creative work",
    ],
    schedule: [
      { time: "8:00-10:00",  task: "4 Pomodoro — Creative work: ideation, sketching" },
      { time: "10:00-12:00", task: "4 Pomodoro — Execution: Figma, Illustrator" },
      { time: "14:00-15:30", task: "3 Pomodoro — Revisions và client feedback" },
    ],
    faq: [
      { q: "Kỹ thuật Pomodoro có phù hợp với creative work không?", a: "Có, nhưng cần điều chỉnh. Với brainstorming, 1 Pomodoro vừa đủ. Với execution (Figma, Photoshop), 2-3 Pomodoro liên tiếp cho phép bạn đạt trạng thái flow. Break giúp designer nhìn nhận thiết kế với con mắt mới, thường phát hiện vấn đề mà trước đó bỏ qua." },
    ],
  },
  "freelancer": {
    name:    "Freelancer",
    nameEn:  "Freelancer",
    icon:    "🏠",
    keyword: "freelancer",
    tips: [
      "Track thời gian theo Pomodoro để invoice chính xác hơn",
      "Phân tách workspace và personal space rõ ràng",
      "Đặt giờ làm cố định như đi làm văn phòng để tránh procrastinate",
      "Batching tasks: admin Pomodoro riêng, client work riêng",
    ],
    schedule: [
      { time: "8:00-12:00",  task: "8 Pomodoro — Client work (giờ cao điểm năng suất)" },
      { time: "13:30-15:30", task: "4 Pomodoro — Tiếp tục deliverables" },
      { time: "15:30-16:30", task: "2 Pomodoro — Admin: email, invoice, proposals" },
    ],
    faq: [
      { q: "Làm sao track billable hours chính xác bằng Pomodoro?", a: "Mỗi Pomodoro 25 phút = 0.5 billable hour. 4 Pomodoro cho một task = 2 giờ invoice. FlowState cho phép gán task cho mỗi Pomodoro, nên cuối ngày bạn có data chính xác về thời gian dành cho mỗi client. Export CSV để làm timesheet." },
    ],
  },
};

// Tạo static params — pre-render tất cả profession pages
export async function generateStaticParams() {
  return Object.keys(PROFESSIONS).map((profession) => ({ profession }));
}

// Dynamic metadata cho SEO
export async function generateMetadata(
  { params }: { params: { profession: string } }
): Promise<Metadata> {
  const prof = PROFESSIONS[params.profession];
  if (!prof) return { title: "Không tìm thấy" };

  return createMetadata({
    title:       `Pomodoro Timer cho ${prof.name} — Tăng Năng Suất`,
    description: `Hướng dẫn áp dụng kỹ thuật Pomodoro và nhạc Lofi cho ${prof.name}. Schedule tối ưu, tips chuyên biệt và FAQ cho ${prof.keyword}.`,
    path:        `/focus/${params.profession}`,
  });
}

export default function ProfessionFocusPage({ params }: { params: { profession: string } }) {
  const prof = PROFESSIONS[params.profession];
  if (!prof) notFound();

  const faqSchema = schemaFAQ(prof.faq);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main style={{ minHeight: "100vh", background: "#0d0f14", color: "#e8e2d9", padding: "100px 24px 80px" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: 32 }}>
            <ol style={{ display: "flex", gap: 8, listStyle: "none", padding: 0, fontSize: ".78rem", color: "rgba(232,226,217,0.4)" }}>
              <li><Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Trang chủ</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/focus" style={{ color: "inherit", textDecoration: "none" }}>Focus</Link></li>
              <li aria-hidden="true">›</li>
              <li style={{ color: "#e8a87c" }}>{prof.name}</li>
            </ol>
          </nav>

          {/* H1 — exact keyword match */}
          <h1 style={{ fontFamily: "Lora, serif", fontSize: "2.2rem", marginBottom: 16, lineHeight: 1.3 }}>
            {prof.icon} Pomodoro Timer cho {prof.name}
          </h1>
          <p style={{ color: "rgba(232,226,217,0.55)", fontSize: ".95rem", lineHeight: 1.8, marginBottom: 48, maxWidth: 650 }}>
            Hướng dẫn áp dụng kỹ thuật Pomodoro và nhạc Lofi được tối ưu
            riêng cho {prof.keyword}. Schedule thực tế, tips đã được kiểm chứng.
          </p>

          {/* Daily Schedule */}
          <section aria-labelledby="schedule-heading" style={{ marginBottom: 48 }}>
            <h2 id="schedule-heading" style={{ fontFamily: "Lora, serif", fontSize: "1.4rem", marginBottom: 20 }}>
              📅 Schedule Pomodoro lý tưởng cho {prof.name}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {prof.schedule.map((s) => (
                <div key={s.time} style={{ padding: "16px 20px", borderRadius: 14,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: ".75rem",
                    color: "#e8a87c", whiteSpace: "nowrap", marginTop: 2 }}>{s.time}</div>
                  <div style={{ fontSize: ".85rem", color: "rgba(232,226,217,0.65)", lineHeight: 1.6 }}>{s.task}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Tips */}
          <section aria-labelledby="tips-heading" style={{ marginBottom: 48 }}>
            <h2 id="tips-heading" style={{ fontFamily: "Lora, serif", fontSize: "1.4rem", marginBottom: 20 }}>
              💡 Tips Pomodoro chuyên biệt cho {prof.name}
            </h2>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {prof.tips.map((tip) => (
                <li key={tip} style={{ padding: "12px 16px", borderRadius: 12,
                  background: "rgba(126,200,200,0.05)", border: "1px solid rgba(126,200,200,0.12)",
                  fontSize: ".85rem", color: "rgba(232,226,217,0.65)", lineHeight: 1.6,
                  display: "flex", gap: 10 }}>
                  <span style={{ color: "#7ec8c8", flexShrink: 0 }}>→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading" style={{ marginBottom: 48 }}>
            <h2 id="faq-heading" style={{ fontFamily: "Lora, serif", fontSize: "1.4rem", marginBottom: 20 }}>
              ❓ Câu hỏi thường gặp
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {prof.faq.map((item) => (
                <details key={item.q} style={{ padding: "16px 20px", borderRadius: 14,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}>
                  <summary style={{ fontWeight: 600, fontSize: ".88rem" }}>{item.q}</summary>
                  <p style={{ marginTop: 12, color: "rgba(232,226,217,0.6)", fontSize: ".85rem", lineHeight: 1.7 }}>{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div style={{ textAlign: "center", padding: "36px 32px", borderRadius: 20,
            background: "linear-gradient(135deg, rgba(232,168,124,0.08), rgba(126,200,200,0.04))",
            border: "1px solid rgba(232,168,124,0.18)" }}>
            <h2 style={{ fontFamily: "Lora, serif", fontSize: "1.3rem", marginBottom: 10 }}>
              Bắt đầu Pomodoro cho {prof.name} ngay bây giờ
            </h2>
            <p style={{ color: "rgba(232,226,217,0.5)", fontSize: ".85rem", marginBottom: 20 }}>
              FlowState miễn phí, không cần đăng ký, chạy ngay trên trình duyệt.
            </p>
            <Link href="/dashboard"
              style={{ padding: "12px 32px", borderRadius: 24, background: "#e8a87c", color: "#1a0f00",
                fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
              🍅 Mở Timer ngay
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
