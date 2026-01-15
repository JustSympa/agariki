import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { conversations, messages, User, users } from '@/lib/db/schema'
import { and, asc, desc, eq, ilike, ne, or } from 'drizzle-orm'

export async function POST(request: NextRequest) {
    const body = await request.json()
            const [ conversation ] = await db
            .insert(conversations)
            .values([{
                participant1Id: body.id1,
                participant2Id: body.id2,
                lastMessageAt: new Date(),
            }])
            .returning()
            return NextResponse.json(conversation)
}