import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const roomName = searchParams.get("roomName")

  try {
    const layouts = await db.layoutDesign.findMany({
      where: roomName ? { roomName } : undefined,
      include: {
        user: { select: { name: true, trustTier: true } }
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(layouts)
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch layouts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { roomName, schemaStr } = body
    
    // @ts-ignore
    const userId = session.user.id || (await db.user.findFirst({ where: { email: session.user.email } }))?.id

    if (!userId) {
      return NextResponse.json({ error: "User not found in DB" }, { status: 404 })
    }

    const newLayout = await db.layoutDesign.create({
      data: {
        roomName,
        schemaStr,
        userId
      }
    })
    return NextResponse.json(newLayout)
  } catch (e) {
    return NextResponse.json({ error: "Failed to create layout" }, { status: 500 })
  }
}
