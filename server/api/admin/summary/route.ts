import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const totalBookings = await db.booking.count()
    const totalUsers = await db.user.count()
    const totalKarmaEvents = await db.karmaEvent.count()
    const totalSpeedtests = await db.speedtest.count()
    const totalLayouts = await db.layoutDesign.count()
    
    // Get latest activities
    const recentBookings = await db.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } }
    })

    return NextResponse.json({
      stats: {
        totalBookings,
        totalUsers,
        totalKarmaEvents,
        totalSpeedtests,
        totalLayouts
      },
      recentActivity: recentBookings
    })
  } catch (e) {
    return NextResponse.json({ error: "Failed to load summary" }, { status: 500 })
  }
}
