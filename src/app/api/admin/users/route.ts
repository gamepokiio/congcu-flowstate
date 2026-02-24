// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

function isAdmin(role: string) {
  return ["ADMIN", "SUPER_ADMIN"].includes(role);
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const [users, total] = await Promise.all([
    db.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, image: true, createdAt: true },
    }),
    db.user.count(),
  ]);

  return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) });
}

// PATCH /api/admin/users/:id — Update user role
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, role } = body;

  if (!userId || !role) {
    return NextResponse.json({ error: "userId và role là bắt buộc" }, { status: 400 });
  }

  // Whitelist roles hợp lệ
  const validRoles = ["USER", "PREMIUM", "ADMIN", "SUPER_ADMIN"];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: "Role không hợp lệ" }, { status: 400 });
  }

  const user = await db.user.update({ where: { id: userId }, data: { role } });

  // Ghi audit log
  await db.auditLog.create({
    data: { adminId: session.user.id, action: "USER_ROLE_CHANGED", targetId: userId, metadata: { newRole: role } },
  });

  return NextResponse.json(user);
}
