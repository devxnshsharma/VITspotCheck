import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const bookings = await db.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } }
    })
    return NextResponse.json(bookings)
  } catch (e) {
    return NextResponse.json({ error: "Failed to load bookings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, roomName, startTime, endTime, reason } = body

    if (!email || !roomName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let user = await db.user.findUnique({ where: { email } })
    if (!user) {
      user = await db.user.create({
        data: { email, name: email.split('@')[0], karma: 100, trustTier: "newcomer" }
      })
    }

    const startDateTime = new Date(startTime)
    const endDateTime = new Date(endTime)

    const booking = await db.booking.create({
      data: {
        userId: user.id,
        roomName,
        startTime: startDateTime,
        endTime: endDateTime,
        reason
      }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to book space" }, { status: 500 })
  }
}
