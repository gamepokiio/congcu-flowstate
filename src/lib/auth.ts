// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as any).role;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Tự động set ADMIN cho email đặc biệt
      // Lưu ý: session.strategy = "database" → PrismaAdapter tạo user TRƯỚC signIn callback
      // → Chỉ cần update, không cần upsert/create
      if (user.email && user.email === process.env.ADMIN_EMAIL && account) {
        try {
          await db.user.update({
            where: { email: user.email },
            data:  { role: "ADMIN" },
          });
        } catch (err) {
          // Log nhưng không block đăng nhập — user vẫn vào được với role USER
          console.warn("signIn: could not set ADMIN role:", err);
        }
      }
      return true;
    },
  },
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "database" },
};

declare module "next-auth" {
  interface Session {
    user: { id: string; name?: string | null; email?: string | null; image?: string | null; role: string };
  }
}
