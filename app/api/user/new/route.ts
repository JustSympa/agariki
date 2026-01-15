import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

export async function POST(request:NextRequest) {
    const body = await request.json()
    const [ user ] = await db
        .insert(users)
        .values(body)
        .returning()
    return NextResponse.json(user)
}