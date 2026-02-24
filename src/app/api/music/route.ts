// src/app/api/music/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { cached } from "@/lib/redis";

export async function GET() {
  const session = await getServerSession(authOptions);
  const isPremium = session && ["PREMIUM", "ADMIN", "SUPER_ADMIN"].includes(session.user.role);

  // Cache playlist 5 phút (ít thay đổi)
  const playlists = await cached(
    "playlists:all",
    () => db.musicPlaylist.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    300
  );

  // Free users chỉ thấy free playlists
  const filtered = isPremium ? playlists : playlists.filter((p) => !p.isPremium);

  return NextResponse.json(filtered);
}
