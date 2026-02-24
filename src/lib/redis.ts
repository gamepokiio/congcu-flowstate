// src/lib/redis.ts — Redis client (cache, sessions)
import Redis from "ioredis";

const globalForRedis = globalThis as unknown as { redis: Redis | undefined };

function createRedisClient() {
  // Fail-fast trong production nếu REDIS_URL chưa được set
  if (!process.env.REDIS_URL && process.env.NODE_ENV === "production") {
    throw new Error("[Redis] REDIS_URL is required in production. Check your .env file.");
  }

  const client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 50, 2000),
    lazyConnect: true,
  });

  client.on("error", (err) => {
    // Không crash app nếu Redis disconnect
    console.error("Redis error:", err.message);
  });

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

// Helper: cache wrapper
export async function cached<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds = 60
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached) as T;
  } catch { /* Redis miss — fallback to fn */ }

  const result = await fn();
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(result));
  } catch { /* ignore cache write errors */ }
  return result;
}
