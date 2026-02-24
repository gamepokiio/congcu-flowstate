import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock next-auth và db
vi.mock('next-auth', () => ({
    getServerSession: vi.fn().mockResolvedValue({
        user: { id: 'test-user-id', role: 'USER' }
    })
}))

vi.mock('@/lib/auth', () => ({
    authOptions: {}
}))

vi.mock('@/lib/db', () => ({
    db: {
        task: {
            findFirst: vi.fn(),
            update: vi.fn().mockResolvedValue({ id: 'task-1', updated: true })
        }
    }
}))

vi.mock('@/lib/redis', () => ({
    redis: {
        del: vi.fn()
    }
}))

// Import handler cần test
import { PATCH } from '../src/app/api/tasks/[id]/route'

describe('PATCH /api/tasks/[id]', () => {

    const createReq = (body: any) => {
        return new NextRequest('http://localhost/api/tasks/task-1', {
            method: 'PATCH',
            body: JSON.stringify(body)
        })
    }

    it('trả về 400 nếu gửi completed không phải boolean', async () => {
        const req = createReq({ completed: "not-a-boolean" })
        const res = await PATCH(req, { params: { id: 'task-1' } })
        const data = await res.json()

        expect(res.status).toBe(400)
        expect(data.error).toBe('completed phải là boolean')
    })

    it('trả về 400 nếu priority không hợp lệ', async () => {
        const req = createReq({ priority: "SUPER_HIGH" })
        const res = await PATCH(req, { params: { id: 'task-1' } })
        const data = await res.json()

        expect(res.status).toBe(400)
        expect(data.error).toBe('priority phải là LOW | MEDIUM | HIGH')
    })

    it('trả về 400 nếu pomoEstimate ngoài khoảng 1-20', async () => {
        const req = createReq({ pomoEstimate: 21 })
        const res = await PATCH(req, { params: { id: 'task-1' } })
        const data = await res.json()

        expect(res.status).toBe(400)
        expect(data.error).toBe('pomoEstimate phải là số từ 1–20')
    })
})
