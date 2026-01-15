import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { and, eq, ilike, ne, or } from 'drizzle-orm'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const body = Object.fromEntries(requestUrl.searchParams.entries())
    const [user] = await db.select().from(users).where(eq(users.id, body.id))
    return NextResponse.json(user)
}
