import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { conversations, messages, User, users } from '@/lib/db/schema'
import { and, asc, desc, eq, ilike, ne, or } from 'drizzle-orm'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const body = Object.fromEntries(requestUrl.searchParams.entries())
            const [ lastMessage ]  = await db
            .selectDistinct({content: messages.content})
            .from(messages)
            .where(eq(messages.conversationId, body.id))
            .orderBy(desc(messages.createdAt))
            .limit(1)
            return NextResponse.json(lastMessage)
}