import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const events = await db.karmaEvent.findMany({
      take: 15,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } }
      }
    })
    
    // Map to IntelligenceFeed format
    const formattedFeed = events.map(e => {
        let action = "performed a spatial action"
        let roomName = ""
        let type = "status_change"

        // Deduce intent based on description mapped from APIs
        if (e.description.includes("Secured Domain:")) {
            type = "booking"
            action = "secured node"
            roomName = e.description.split("Secured Domain:")[1].trim()
        } else if (e.description.includes("Synced Architectural Blueprint")) {
            type = "verification"
            action = "mapped layout for"
            roomName = "The Network"
        } else if (e.description.includes("Telemetry Sync:")) {
            type = "speedtest"
            action = "benchmarked network at"
            roomName = "Global Shard"
        }

        return {
            id: e.id,
            userName: e.user.name,
            action,
            roomName,
            type,
            karma: e.points,
            timestamp: e.createdAt.toISOString()
        }
    })

    return NextResponse.json(formattedFeed)
  } catch (error) {
    console.error("Feed error:", error)
    return NextResponse.json({ error: "Failed to fetch flux" }, { status: 500 })
  }
}
