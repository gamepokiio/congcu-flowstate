// prisma/seed.ts — Tạo dữ liệu mẫu ban đầu
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Tạo playlist nhạc mẫu
  await prisma.musicPlaylist.createMany({
    skipDuplicates: true,
    data: [
      { name: "Lofi Hip Hop Radio ☕", description: "Chill Beats to Study/Relax", emoji: "☕", youtubeId: "jfKfPfyJRdk", isPremium: false, order: 1 },
      { name: "Coffee Shop Lofi 🍵", description: "Cozy Background for Work", emoji: "🍵", youtubeId: "5qap5aO4i9A", isPremium: false, order: 2 },
      { name: "Jazz Lofi Night 🌙", description: "Late Night Study Vibes", emoji: "🌙", youtubeId: "HuFYqnbVbzY", isPremium: false, order: 3 },
      { name: "Tokyo Night Drive 🌆", description: "Japanese City Pop Lofi", emoji: "🌆", youtubeId: "pXRViuL6tHQ", isPremium: true, order: 4 },
      { name: "Deep Focus Alpha ⚡", description: "Binaural Beats + Lofi", emoji: "⚡", youtubeId: "WPni755-Krg", isPremium: true, order: 5 },
    ],
  });

  console.log("✅ Seeded playlists");
  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
