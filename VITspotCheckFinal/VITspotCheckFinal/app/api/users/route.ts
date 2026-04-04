import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const users = await db.user.findMany({
      orderBy: { karma: "desc" },
      take: 50,
      include: {
        karmaEvents: { take: 10, orderBy: { createdAt: "desc" } }
      }
    })
    return NextResponse.json(users)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 })
  }
}
