import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Redis Client Config', () => {
    const originalEnv = process.env

    beforeEach(() => {
        vi.resetModules() // Xóa cache module
        process.env = { ...originalEnv }
        // Xóa singleton cache của Next.js (do dev setup globalThis)
        // @ts-ignore
        delete globalThis.redis
    })

    it('không văng lỗi khi ở môi trường development dù chưa có REDIS_URL', async () => {
        process.env.NODE_ENV = 'development'
        delete process.env.REDIS_URL

        const { redis } = await import('../src/lib/redis?t=dev')
        expect(redis).toBeDefined()
    })

    it('NÉM lỗi (fail-fast) khi ở môi trường production mà không có REDIS_URL', async () => {
        process.env.NODE_ENV = 'production'
        delete process.env.REDIS_URL

        await expect(async () => {
            await import(`../src/lib/redis?t=prod`)
        }).rejects.toThrow(/REDIS_URL is required in production/)
    })

    it('khởi tạo thành công trong production nếu có đủ REDIS_URL', async () => {
        process.env.NODE_ENV = 'production'
        process.env.REDIS_URL = 'redis://my-secure-redis:6379'

        const { redis } = await import('../src/lib/redis?t=prod2')
        expect(redis).toBeDefined()
    })
})
