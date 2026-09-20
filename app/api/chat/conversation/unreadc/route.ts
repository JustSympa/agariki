import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/db'
import { conversations, messages, User, users } from '@/db/schema'
import { and, asc, desc, eq, ilike, ne, or } from 'drizzle-orm'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const body = Object.fromEntries(requestUrl.searchParams.entries())
            const unreadCount = await db
            .select()
            .from(messages)
            .where(and(
                eq(messages.conversationId, body.convId),
                eq(messages.read, false),
                ne(messages.senderId, body.userId)
            ))
            return NextResponse.json({unreadCount: unreadCount.length})
}