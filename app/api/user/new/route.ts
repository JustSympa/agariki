import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/db'
import { NewUser, users } from '@/db/schema'

export async function POST(request:NextRequest) {
    const body = await request.json() as NewUser
    const [ user ] = await db
        .insert(users)
        .values(body)
        .returning()
    return NextResponse.json(user)
}