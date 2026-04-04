"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useUIStore, useRoomStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"
import { SpeedtestEngine } from "@/components/speedtest/speedtest-engine"

export default function SpeedtestPage() {
  const params = useParams()
  const roomId = params.roomId as string
  const { rooms } = useRoomStore()
  const { setDominantColor } = useUIStore()

  const room = rooms[roomId]

  useEffect(() => {
    setDominantColor("cyan")
    return () => setDominantColor("black")
  }, [setDominantColor])

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Room Not Found</h1>
          <Link href="/" className="text-primary hover:underline" data-cursor="link">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-6 lg:px-12">
      {/* Back Button */}
      <Link
        href={`/room/${roomId}`}
        className="inline-flex items-center gap-2 mt-4 text-white/60 hover:text-white transition-colors"
        data-cursor="link"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to {room.name}</span>
      </Link>

      <div className="max-w-4xl mx-auto py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight">
            Speedtest
          </h1>
          <p className="mt-2 text-white/60">{room.name}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          <div className="glass-panel-cyan rounded-3xl p-8 lg:p-12 glow-cyan">
            <SpeedtestEngine 
              roomId={roomId} 
              roomName={room.name}
              onComplete={() => {
                // Results handled by engine
              }}
            />
          </div>
        </AnimatePresence>
      </div>
    </div>
  )
}
