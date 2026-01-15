import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { and, eq, ilike, ne, or } from 'drizzle-orm'

export async function PUT(request:NextRequest) {
    const body = await request.json()
    const [ user ] = await db
            .update(users)
            .set(body.updates)
            .where(eq(users.id, body.id))
            .returning()
    return NextResponse.json(user)
}