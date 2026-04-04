import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, delta, reason } = body

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    let user = await db.user.findUnique({ where: { email } })
    
    // Auto-create user for demo seamlessness
    if (!user) {
      user = await db.user.create({
        data: {
           email,
           name: email.split('@')[0],
           karma: 100,
           trustTier: "newcomer"
        }
      })
    }

    // Add Karma Event
    const karmaEvent = await db.karmaEvent.create({
      data: {
        userId: user.id,
        type: delta >= 0 ? "gain" : "loss",
        points: delta,
        description: reason
      }
    })

    // Update User total karma
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { karma: { increment: delta } }
    })

    // Update Tier logically
    let newTier = "OBSERVER"
    if (updatedUser.karma > 250) newTier = "SPOTTER"
    if (updatedUser.karma > 1200) newTier = "NAVIGATOR"
    if (updatedUser.karma > 6000) newTier = "ARCHITECT"
    if (updatedUser.karma > 15000) newTier = "ORACLE"

    if (newTier !== updatedUser.trustTier) {
       await db.user.update({
         where: { id: user.id },
         data: { trustTier: newTier }
       })
    }

    return NextResponse.json({ success: true, newKarma: updatedUser.karma, tier: newTier })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to sync karma" }, { status: 500 })
  }
}
