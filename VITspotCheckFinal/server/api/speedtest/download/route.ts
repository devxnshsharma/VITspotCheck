import { NextResponse } from "next/server"

export async function GET() {
  const sizeMB = 5
  const buffer = Buffer.alloc(sizeMB * 1024 * 1024)
  buffer.fill(Math.random() * 255)

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  })
}
