// src/app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

// PATCH /api/tasks/:id — Update task (toggle complete, edit, v.v.)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Whitelist các fields được phép update — phải khớp đúng với Task model trong schema.prisma
  const allowedFields = ["title", "completed", "priority", "pomoEstimate", "dueDate", "category", "order"];
  const safeData: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in body) safeData[key] = body[key];
  }

  if (Object.keys(safeData).length === 0) {
    return NextResponse.json({ error: "Không có field hợp lệ để update" }, { status: 400 });
  }

  // Validate types để tránh Prisma throw 500
  if ("completed" in safeData && typeof safeData.completed !== "boolean") {
    return NextResponse.json({ error: "completed phải là boolean" }, { status: 400 });
  }
  if ("priority" in safeData && !["LOW", "MEDIUM", "HIGH"].includes(safeData.priority as string)) {
    return NextResponse.json({ error: "priority phải là LOW | MEDIUM | HIGH" }, { status: 400 });
  }
  if ("pomoEstimate" in safeData) {
    const est = Number(safeData.pomoEstimate);
    if (isNaN(est) || est < 1 || est > 20) {
      return NextResponse.json({ error: "pomoEstimate phải là số từ 1–20" }, { status: 400 });
    }
    safeData.pomoEstimate = est;
  }
  if ("order" in safeData) {
    const ord = Number(safeData.order);
    if (isNaN(ord)) {
      return NextResponse.json({ error: "order phải là số nguyên" }, { status: 400 });
    }
    safeData.order = ord;
  }
  if ("title" in safeData && typeof safeData.title === "string") {
    safeData.title = (safeData.title as string).trim();
    if (!safeData.title) return NextResponse.json({ error: "title không được rỗng" }, { status: 400 });
  }


  // Kiểm tra task thuộc về user này
  const existing = await db.task.findFirst({ where: { id: params.id, userId: session.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const task = await db.task.update({
    where: { id: params.id },
    data: safeData,
  });

  try { await redis.del(`tasks:${session.user.id}`); } catch { }
  return NextResponse.json(task);
}

// DELETE /api/tasks/:id
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await db.task.findFirst({ where: { id: params.id, userId: session.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.task.delete({ where: { id: params.id } });
  try { await redis.del(`tasks:${session.user.id}`); } catch { }
  return NextResponse.json({ success: true });
}
