// src/app/api/sessions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/sessions — Ghi lại một pomodoro session đã hoàn thành
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { type = "FOCUS", duration, completed = true, taskId, mood, notes } = body;

  // Validate duration — phải là số dương, tối đa 120 phút
  const durationNum = Number(duration);
  if (!duration || isNaN(durationNum) || durationNum <= 0 || durationNum > 7200) {
    return NextResponse.json({ error: "duration phải là số giây hợp lệ (1–7200)" }, { status: 400 });
  }

  // Validate type — phải khớp với SessionType enum trong Prisma schema
  const validTypes = ["FOCUS", "SHORT_BREAK", "LONG_BREAK"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "type không hợp lệ. Phải là: FOCUS | SHORT_BREAK | LONG_BREAK" }, { status: 400 });
  }

  const pomSession = await db.pomodoroSession.create({
    data: {
      userId: session.user.id,
      type,
      duration: durationNum,
      completed,
      taskId: taskId || null,
      mood: mood || null,
      notes: notes || null,
      endedAt: new Date(),
    },
  });

  return NextResponse.json(pomSession, { status: 201 });
}

// GET /api/sessions — Lịch sử sessions (7 ngày gần nhất)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const since = new Date();
  since.setDate(since.getDate() - 7);

  const sessions = await db.pomodoroSession.findMany({
    where: { userId: session.user.id, startedAt: { gte: since } },
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json(sessions);
}
