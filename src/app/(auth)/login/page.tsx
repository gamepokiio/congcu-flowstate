import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// noIndex: true — trang login không cần Google index
export const metadata: Metadata = createMetadata({
  title:   "Đăng nhập",
  path:    "/login",
  noIndex: true,
});

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#0d0f14", color: "#e8e2d9" }}>
      <div style={{ textAlign: "center", padding: "48px 40px", borderRadius: 24, maxWidth: 420, width: "100%",
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🌿</div>
        <h1 style={{ fontFamily: "Lora, serif", fontSize: "1.6rem", marginBottom: 8, color: "#e8a87c" }}>
          FlowState
        </h1>
        <p style={{ color: "rgba(232,226,217,0.45)", fontSize: ".85rem", marginBottom: 32 }}>
          Đăng nhập để sync data giữa các thiết bị
        </p>
        <a href="/api/auth/signin/google"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            padding: "13px 24px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)", color: "#e8e2d9", textDecoration: "none",
            fontSize: ".9rem", fontWeight: 500, cursor: "pointer" }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Tiếp tục với Google
        </a>
        <p style={{ marginTop: 20, fontSize: ".72rem", color: "rgba(232,226,217,0.3)" }}>
          Hoặc{" "}
          <a href="/dashboard" style={{ color: "rgba(232,226,217,0.5)", textDecoration: "underline" }}>
            dùng không cần đăng nhập
          </a>
        </p>
      </div>
    </main>
  );
}
