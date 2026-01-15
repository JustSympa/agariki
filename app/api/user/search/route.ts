import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { and, eq, ilike, ne, or } from 'drizzle-orm'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const body = Object.fromEntries(requestUrl.searchParams.entries())
    const result = await db
        .select()
        .from(users)
        .where(and(
        ne(users.id, body.exclude),
        or(ilike(users.fullName, body.query), ilike(users.email, body.query))))
        .limit(10)
    return NextResponse.json(result)
}