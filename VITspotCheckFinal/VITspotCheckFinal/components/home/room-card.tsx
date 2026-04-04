"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Users } from "lucide-react"
import type { Room, RoomStatus } from "@/lib/store"
import { cn } from "@/lib/utils"

interface RoomCardProps {
  room: Room
  index: number
}

const STATUS_STYLES: Record<RoomStatus, { border: string; glow: string; text: string }> = {
  empty: {
    border: "border-t-status-empty",
    glow: "hover:shadow-[0_12px_32px_rgba(52,211,153,0.4)]",
    text: "text-status-empty",
  },
  occupied: {
    border: "border-t-status-occupied",
    glow: "hover:shadow-[0_12px_32px_rgba(251,146,60,0.4)]",
    text: "text-status-occupied",
  },
  unverified: {
    border: "border-t-status-unverified",
    glow: "hover:shadow-[0_12px_32px_rgba(251,191,36,0.4)]",
    text: "text-status-unverified",
  },
  conflict: {
    border: "border-t-status-conflict",
    glow: "hover:shadow-[0_12px_32px_rgba(251,113,133,0.4)]",
    text: "text-status-conflict",
  },
}

export function RoomCard({ room, index }: RoomCardProps) {
  const styles = STATUS_STYLES[room.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
    >
      <Link
        href={`/room/${room.id}`}
        data-cursor="room-card"
        data-room-status={room.status}
        className={cn(
          "group block aspect-square rounded-xl glass-panel transition-all duration-200",
          "border-t-4 hover:-translate-y-2",
          styles.border,
          styles.glow
        )}
      >
        <div className="h-full flex flex-col items-center justify-center p-3">
          {/* Room Number */}
          <span className="text-base sm:text-lg font-bold text-white group-hover:scale-105 transition-transform">
            {room.name.split("-")[1]}
          </span>

          {/* Capacity Badge */}
          <div className="mt-2 flex items-center gap-1 text-xs text-white/50">
            <Users className="w-3 h-3" />
            <span>{room.capacity}</span>
          </div>

          {/* Status indicator dot */}
          <div
            className={cn(
              "mt-2 w-2 h-2 rounded-full animate-breathe",
              room.status === "empty" && "bg-status-empty",
              room.status === "occupied" && "bg-status-occupied",
              room.status === "unverified" && "bg-status-unverified",
              room.status === "conflict" && "bg-status-conflict"
            )}
          />
        </div>
      </Link>
    </motion.div>
  )
}
