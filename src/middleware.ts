// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Kiểm tra session cookie (database strategy dùng tên này)
  const sessionToken =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  // Nếu chưa đăng nhập → redirect về /login
  if (!sessionToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Admin check — chỉ cho phép ADMIN/SUPER_ADMIN
  // Lưu ý: Với database session, middleware KHÔNG có access tới role
  // → Check role phía server (getServerSession) trong admin page thay vì middleware

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
