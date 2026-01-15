import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { conversations, messages, User, users } from '@/lib/db/schema'
import { and, asc, desc, eq, ilike, ne, or } from 'drizzle-orm'

export async function PUT(request: NextRequest) {
    const body = await request.json()
    await db
    .update(messages)
    .set({ read: true })
    .where(and(
        eq(messages.conversationId, body.convId),
        eq(messages.read, false),
        ne(messages.senderId, body.userId)))

    return NextResponse.json(body)
}