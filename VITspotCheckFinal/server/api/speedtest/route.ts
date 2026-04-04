import { NextResponse } from "next/server"

// Generates dummy data stream for download speed tests
export async function GET(request: Request) {
  const url = new URL(request.url)
  const sizeParam = url.searchParams.get("size")
  
  // Default to 10MB chunk, but allow query string to dictate size in MB
  const sizeMB = sizeParam ? parseInt(sizeParam) : 10
  
  if (sizeMB === 1) {
     // Ping test
     return new NextResponse(JSON.stringify({ status: "pong" }), {
        headers: { "Content-Type": "application/json" }
     })
  }

  // Large buffer for payload testing (Download)
  const bufferBytes = sizeMB * 1024 * 1024
  const data = new Uint8Array(bufferBytes)

  // Fast filling stream
  return new NextResponse(data, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": bufferBytes.toString(),
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
    }
  })
}

// Accepts payload chunks for upload speed testing
export async function POST(request: Request) {
  try {
    // Read the stream to measure upload
    if (request.body) {
      const reader = request.body.getReader()
      let bytesReceived = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        bytesReceived += value.length
      }

      return NextResponse.json({ 
        status: "received", 
        bytes: bytesReceived 
      })
    }
    
    return NextResponse.json({ status: "empty" }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ status: "error" }, { status: 500 })
  }
}
