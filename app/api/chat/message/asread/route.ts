import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { conversations, messages, User, users } from '@/lib/db/schema'
import { and, asc, desc, eq, ilike, ne, or } from 'drizzle-orm'

export async function PUT(request: NextRequest) {
    const body = await request.json()
            await db
            .update(messages)
            .set({ read: true })
            .where(eq(messages.id, body.id))
            return NextResponse.json(body)
}