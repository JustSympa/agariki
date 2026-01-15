import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { conversations, messages, User, users } from '@/lib/db/schema'
import { and, asc, desc, eq, ilike, ne, or } from 'drizzle-orm'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const body = Object.fromEntries(requestUrl.searchParams.entries())
    const [ existingConv ]  = await db
    .select()
    .from(conversations)
    .where(or(
        and(eq(conversations.participant1Id, body.id1),eq(conversations.participant2Id, body.id2)),
        and(eq(conversations.participant1Id, body.id2),eq(conversations.participant2Id, body.id1))))
    .limit(1)
    return NextResponse.json(existingConv)
}