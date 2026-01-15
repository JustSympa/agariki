import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { conversations, messages, User, users } from '@/lib/db/schema'
import { and, asc, desc, eq, ilike, ne, or } from 'drizzle-orm'

export async function POST(request: NextRequest) {
    const body = await request.json()
            const [ message ] = await db
            .insert(messages)
            .values({
                conversationId: body.conversationId,
                senderId: body.senderId,
                content: body.content,
                read: false,
            })
            .returning()

            // Update conversation's last_message_at
            await db
            .update(conversations)
            .set({ lastMessageAt: new Date()})
            .where(eq(conversations.id, body.conversationId))

            return NextResponse.json(message)
}