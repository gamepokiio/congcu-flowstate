import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginButton from "./LoginButton";

// noIndex: true — trang login không cần Google index
export const metadata: Metadata = createMetadata({
  title: "Đăng nhập",
  path: "/login",
  noIndex: true,
});

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <main style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#0d0f14", color: "#e8e2d9"
    }}>
      <div style={{
        textAlign: "center", padding: "48px 40px", borderRadius: 24, maxWidth: 420, width: "100%",
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)"
      }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🌿</div>
        <h1 style={{ fontFamily: "Lora, serif", fontSize: "1.6rem", marginBottom: 8, color: "#e8a87c" }}>
          FlowState
        </h1>
        <p style={{ color: "rgba(232,226,217,0.45)", fontSize: ".85rem", marginBottom: 32 }}>
          Đăng nhập để sync data giữa các thiết bị
        </p>
        <LoginButton />
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
