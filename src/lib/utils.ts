// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  try {
    const u = new URL(url.trim());
    if (u.hostname === "youtu.be" || u.hostname === "www.youtu.be") {
      // youtu.be/<videoId>?si=... — lấy phần path đầu tiên, bỏ query string
      const id = u.pathname.slice(1).split("/")[0];
      return id.length === 11 ? id : null;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] || null;
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] || null;
    }
  } catch {
    // URL không hợp lệ — thử regex fallback
    const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }
  return null;
}
