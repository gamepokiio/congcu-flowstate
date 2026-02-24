// src/app/pricing/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata, schemaBreadcrumb, SITE } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title:       "Giá Cả — Free & Premium",
  description: "FlowState miễn phí mãi mãi cho tính năng cơ bản. Gói Premium từ 79,000đ/tháng mở khóa AI insights, cloud sync và 50+ Lofi playlists.",
  path:        "/pricing",
});

const PLANS = [
  {
    name:     "Free",
    price:    "0đ",
    period:   "mãi mãi",
    highlight: false,
    features: [
      "✅ Pomodoro Timer đầy đủ 4 chế độ",
      "✅ Task Manager (max 20 tasks)",
      "✅ 3 Lofi playlists curated",
      "✅ Custom YouTube URL (5/ngày)",
      "✅ Habit Tracker (max 3 habits)",
      "✅ Lịch sử 7 ngày",
      "✅ Daily Journal",
      "✅ Water Tracker",
      "✅ Zen Mode",
      "❌ Cloud sync đa thiết bị",
      "❌ AI Focus Insights",
      "❌ Premium playlists",
    ],
  },
  {
    name:     "Premium",
    price:    "79,000đ",
    period:   "/tháng",
    yearlyPrice: "699,000đ/năm",
    highlight: true,
    badge:    "Phổ biến nhất",
    features: [
      "✅ Tất cả tính năng Free",
      "✅ 50+ Premium Lofi playlists",
      "✅ Custom YouTube không giới hạn",
      "✅ Unlimited tasks & habits",
      "✅ Cloud sync đa thiết bị",
      "✅ AI Focus Score & Insights",
      "✅ Lịch sử 90 ngày",
      "✅ Focus Rooms (học cùng nhau)",
      "✅ Export data (CSV/JSON)",
      "✅ Custom themes & colors",
      "✅ Priority email support",
      "✅ Early access tính năng mới",
    ],
  },
  {
    name:     "Team",
    price:    "149,000đ",
    period:   "/người/tháng",
    highlight: false,
    features: [
      "✅ Tất cả tính năng Premium",
      "✅ Team workspace chung",
      "✅ Shared goals & OKRs",
      "✅ Manager analytics dashboard",
      "✅ Slack & Notion integration",
      "✅ Custom branding",
      "✅ SSO (SAML)",
      "✅ SLA 99.9% uptime",
      "✅ Dedicated support",
    ],
  },
] as const;

export default function PricingPage() {
  // Pricing Schema.org
  const pricingSchema = {
    "@context": "https://schema.org",
    "@type":    "Product",
    name:        "FlowState Premium",
    description: "Pomodoro Timer & Lofi Music app với AI insights và cloud sync",
    brand: { "@type": "Brand", name: "FlowState" },
    offers: [
      {
        "@type":          "Offer",
        name:             "Free Plan",
        price:            "0",
        priceCurrency:    "VND",
        availability:     "https://schema.org/InStock",
        description:      "Miễn phí mãi mãi",
        priceValidUntil:  "2027-12-31",
        url:              `${SITE.url}/pricing`,
      },
      {
        "@type":          "Offer",
        name:             "Premium Plan",
        price:            "79000",
        priceCurrency:    "VND",
        availability:     "https://schema.org/InStock",
        billingIncrement: "P1M",
        url:              `${SITE.url}/pricing`,
      },
    ],
  };

  const breadcrumbSchema = schemaBreadcrumb([
    { name: "Trang chủ", url: SITE.url },
    { name: "Giá cả",    url: `${SITE.url}/pricing` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main style={{ minHeight: "100vh", background: "#0d0f14", color: "#e8e2d9", padding: "100px 24px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Header */}
          <header style={{ textAlign: "center", marginBottom: 56 }}>
            <h1 style={{ fontFamily: "Lora, serif", fontSize: "2.5rem", marginBottom: 14 }}>
              Chọn gói phù hợp với bạn
            </h1>
            <p style={{ color: "rgba(232,226,217,0.5)", fontSize: ".95rem", maxWidth: 500, margin: "0 auto" }}>
              Miễn phí mãi mãi cho cá nhân. Nâng cấp khi bạn cần nhiều hơn.
            </p>
          </header>

          {/* Plans grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {PLANS.map((plan) => (
              <div key={plan.name}
                style={{ padding: "28px 26px", borderRadius: 20, position: "relative",
                  background: plan.highlight ? "rgba(232,168,124,0.07)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${plan.highlight ? "rgba(232,168,124,0.35)" : "rgba(255,255,255,0.08)"}`,
                  boxShadow: plan.highlight ? "0 0 40px rgba(232,168,124,0.08)" : "none" }}>

                {plan.highlight && "badge" in plan && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    padding: "4px 16px", borderRadius: 20, background: "#e8a87c", color: "#1a0f00",
                    fontSize: ".7rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                    {plan.badge}
                  </div>
                )}

                <div style={{ fontFamily: "Lora, serif", fontSize: "1.3rem", marginBottom: 8 }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: "2.2rem", fontWeight: 700, color: plan.highlight ? "#e8a87c" : "#e8e2d9" }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: ".8rem", color: "rgba(232,226,217,0.4)" }}>{plan.period}</span>
                </div>
                {"yearlyPrice" in plan && (
                  <div style={{ fontSize: ".72rem", color: "#7ce8a8", marginBottom: 20 }}>
                    hoặc {plan.yearlyPrice} (tiết kiệm 26%)
                  </div>
                )}

                <Link href={plan.name === "Free" ? "/dashboard" : "/dashboard?upgrade=true"}
                  style={{ display: "block", textAlign: "center", padding: "11px 20px", borderRadius: 14, marginBottom: 24,
                    background: plan.highlight ? "#e8a87c" : "rgba(255,255,255,0.08)",
                    border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.1)",
                    color: plan.highlight ? "#1a0f00" : "rgba(232,226,217,0.7)",
                    fontWeight: 600, fontSize: ".88rem", textDecoration: "none" }}>
                  {plan.name === "Free" ? "Bắt đầu miễn phí" : plan.name === "Team" ? "Liên hệ sales" : "Nâng cấp Premium"}
                </Link>

                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ fontSize: ".8rem", color: f.startsWith("❌") ? "rgba(232,226,217,0.3)" : "rgba(232,226,217,0.65)", lineHeight: 1.5 }}>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Trust signals */}
          <div style={{ textAlign: "center", marginTop: 48, color: "rgba(232,226,217,0.35)", fontSize: ".8rem" }}>
            🔒 Thanh toán bảo mật · ↩️ Hoàn tiền 30 ngày nếu không hài lòng · 💳 Hỗ trợ MoMo, VNPAY, Thẻ tín dụng
          </div>

        </div>
      </main>
    </>
  );
}
