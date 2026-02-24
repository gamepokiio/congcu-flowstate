// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cacheKey = `tasks:${session.user.id}`;

  // Thử đọc từ cache trước
  try {
    const cached = await redis.get(cacheKey);
    if (cached) return NextResponse.json(JSON.parse(cached));
  } catch { /* cache miss */ }

  const tasks = await db.task.findMany({
    where: { userId: session.user.id },
    orderBy: [{ completed: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  // Cache 30 giây
  try { await redis.setex(cacheKey, 30, JSON.stringify(tasks)); } catch { }

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, priority = "MEDIUM", pomoEstimate = 1, dueDate, category } = body;

  if (!title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const task = await db.task.create({
    data: {
      userId: session.user.id,
      title: title.trim(),
      priority,
      pomoEstimate: Number(pomoEstimate),
      dueDate: dueDate ? new Date(dueDate) : null,
      category,
    },
  });

  // Invalidate cache
  try { await redis.del(`tasks:${session.user.id}`); } catch { }

  return NextResponse.json(task, { status: 201 });
}
