"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Users,
  Clock,
  Zap,
  Wifi,
  ThermometerSun,
  Volume2,
  Sun,
  Power,
  Check,
  AlertCircle,
} from "lucide-react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts"
import { SpeedtestEngine } from "@/components/speedtest/speedtest-engine"
import { useRoomStore, useUIStore, useFeedStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"
import { cn } from "@/lib/utils"

function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffSecs = Math.floor(diffMs / 1000)

  if (diffSecs < 60) return `${diffSecs}s ago`
  if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`
  return `${Math.floor(diffSecs / 3600)}h ago`
}

export default function RoomDetailPage() {
  const params = useParams()
  const roomId = params.roomId as string
  const { rooms, updateRoomStatus } = useRoomStore()
  const { setDominantColor, showToast } = useUIStore()
  const { user, isAuthenticated, addKarma } = useAuthStore()
  const { addEvent } = useFeedStore()

  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyingStatus, setVerifyingStatus] = useState<"empty" | "occupied" | null>(null)
  const [countdown, setCountdown] = useState(3)
  const [syncTime, setSyncTime] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  const room = rooms[roomId]

  // Handle hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Update sync time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncTime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Set background color based on room status
  useEffect(() => {
    if (room) {
      setDominantColor(room.status === "empty" ? "green" : "amber")
    }
    return () => setDominantColor("black")
  }, [room, setDominantColor])

  // Verification countdown — awards karma through the persisted auth store
  useEffect(() => {
    if (!isVerifying) return

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }

    // Verification complete
    if (verifyingStatus) {
      updateRoomStatus(roomId, verifyingStatus)
      
      // Award karma through the persisted auth store (syncs to DB)
      if (isAuthenticated) {
        addKarma(5, `Synced Architectural Blueprint: ${room?.name || roomId}`)
      }
      showToast("+5 KARMA — Room Verified", "karma")
      
      // Add to live feed
      addEvent({
        id: `event_${Date.now()}`,
        type: "verification",
        userId: user?.id || "anonymous",
        userName: user?.name || "Anonymous",
        roomId,
        roomName: room?.name || roomId,
        action: `verified room ${verifyingStatus}`,
        karma: 5,
        timestamp: new Date().toISOString(),
      })
    }

    setIsVerifying(false)
    setVerifyingStatus(null)
    setCountdown(3)
  }, [isVerifying, countdown, verifyingStatus, roomId, room, user, isAuthenticated, updateRoomStatus, addKarma, showToast, addEvent])

  const handleVerify = useCallback((status: "empty" | "occupied") => {
    setVerifyingStatus(status)
    setIsVerifying(true)
    setCountdown(3)
  }, [])

  const cancelVerification = useCallback(() => {
    setIsVerifying(false)
    setVerifyingStatus(null)
    setCountdown(3)
  }, [])

  if (!isMounted) return null

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

  const radarData = [
    { subject: "WiFi", value: room.utilities.wifi },
    { subject: "Sockets", value: room.utilities.sockets },
    { subject: "AC", value: room.utilities.ac },
    { subject: "Quiet", value: room.utilities.quietness },
    { subject: "Light", value: room.utilities.lighting },
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Section 1: Hero & Status */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 relative">
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-24 left-6 lg:left-12 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          data-cursor="link"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>

        {/* Room Name */}
        <motion.h1
          initial={{ opacity: 0, y: 100, clipPath: "inset(100% 0 0 0)" }}
          animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight"
          style={{ textShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
        >
          {room.name}
        </motion.h1>

        {/* Metadata */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-4 text-lg text-white/70"
        >
          {room.block === "AB1" ? "Academic Block 1" : room.block} • Floor {room.floor}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-2 text-sm text-white/50 flex items-center gap-4"
        >
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            Capacity: {room.capacity}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Last synced: {syncTime}s ago
          </span>
        </motion.p>

        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-8 px-12 py-6 rounded-2xl glass-panel border-2 border-white/30 animate-breathe"
        >
          <span
            className={cn(
              "text-4xl font-bold uppercase tracking-wider",
              room.status === "empty" && "text-status-empty",
              room.status === "occupied" && "text-status-occupied",
              room.status === "unverified" && "text-status-unverified",
              room.status === "conflict" && "text-status-conflict"
            )}
          >
            {room.status}
          </span>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="mt-12 flex items-center gap-4"
        >
          {!isVerifying ? (
            <>
              <button
                onClick={() => handleVerify("empty")}
                data-cursor="button"
                data-cursor-text="+5"
                className="px-8 py-4 rounded-full glass-panel border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-white/10 hover:scale-105 transition-all"
              >
                Mark Empty
              </button>
              <button
                onClick={() => handleVerify("occupied")}
                data-cursor="button"
                data-cursor-text="+5"
                className="px-8 py-4 rounded-full glass-panel border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-white/10 hover:scale-105 transition-all"
              >
                Mark Occupied
              </button>
            </>
          ) : (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-primary mb-4"
              >
                VERIFYING... {countdown}
              </motion.div>
              <button
                onClick={cancelVerification}
                className="text-white/60 hover:text-white transition-colors"
                data-cursor="link"
              >
                Cancel
              </button>
            </div>
          )}
        </motion.div>
      </section>

      {/* Section 2: Network Analytics */}
      <section id="analytics" className="py-24 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white uppercase tracking-tight mb-12 text-center"
          >
            Network & Utility Analysis
          </motion.h2>

          <div className="space-y-8 lg:space-y-12">
            {/* Professional Data Flux Analyzer */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <SpeedtestEngine 
                roomId={roomId} 
                roomName={room.name}
              />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Radar Chart */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-panel-cyan rounded-2xl p-8 h-full"
              >
                <h3 className="text-xl font-bold text-white mb-6 text-center uppercase tracking-widest opacity-50">
                  Utility Vector Analysis
                </h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(6, 182, 212, 0.2)" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                      />
                      <Radar
                        name="Score"
                        dataKey="value"
                        stroke="#06B6D4"
                        fill="#06B6D4"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Network Health & Information */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-6"
              >
                <div className="glass-panel rounded-2xl p-8 border border-white/5 flex-1 flex flex-col justify-center">
                  <h3 className="text-sm font-bold text-white/40 uppercase tracking-[0.3em] mb-8">System Health</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Congestion Relay</span>
                        <span className="text-sm font-bold text-status-empty uppercase">Nominal / Low</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-status-empty w-[15%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Access Point Load</span>
                        <span className="text-sm font-bold text-amber-400 uppercase">32% [Optimal]</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 w-[32%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Signal Integrity</span>
                        <span className="text-sm font-bold text-primary uppercase">98% [Elite]</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[98%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel rounded-xl p-4 border border-white/5">
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Architecture</div>
                    <div className="text-lg font-bold text-white">802.11ax [WiFi 6E]</div>
                  </div>
                  <div className="glass-panel rounded-xl p-4 border border-white/5">
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Last Sample</div>
                    <div className="text-lg font-bold text-white">45 Mbps</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Utility Icons Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
          >
            {[
              { icon: Wifi, label: "WiFi", score: room.utilities.wifi },
              { icon: Power, label: "Sockets", score: room.utilities.sockets },
              { icon: ThermometerSun, label: "AC", score: room.utilities.ac },
              { icon: Volume2, label: "Quiet", score: room.utilities.quietness },
              { icon: Sun, label: "Lighting", score: room.utilities.lighting },
            ].map(({ icon: Icon, label, score }) => (
              <div
                key={label}
                className="glass-panel rounded-xl p-4 text-center hover:bg-white/[0.08] transition-colors"
              >
                <Icon className="w-8 h-8 mx-auto text-primary mb-2" />
                <div className="text-sm text-white/60">{label}</div>
                <div className="text-xl font-bold text-white mt-1">{score}%</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 3: Recent Activity */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white uppercase tracking-tight mb-12 text-center"
          >
            Recent Activity
          </motion.h2>

          <div className="space-y-3">
            {[
              { user: "User_Alpha", action: "verified room empty", time: "2 min ago", type: "verification" },
              { user: "User_Beta", action: "marked occupied", time: "15 min ago", type: "status" },
              { user: "User_Gamma", action: "ran speedtest: 52↓ 14↑ Mbps", time: "1 hr ago", type: "speedtest" },
              { user: "User_Delta", action: "verified empty", time: "3 hr ago", type: "verification" },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="flex items-center gap-4 p-4 rounded-xl glass-panel"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    activity.type === "verification" && "bg-status-empty/20 text-status-empty",
                    activity.type === "status" && "bg-status-occupied/20 text-status-occupied",
                    activity.type === "speedtest" && "bg-primary/20 text-primary"
                  )}
                >
                  {activity.type === "verification" && <Check className="w-4 h-4" />}
                  {activity.type === "status" && <AlertCircle className="w-4 h-4" />}
                  {activity.type === "speedtest" && <Zap className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-white">{activity.user}</span>
                  <span className="text-white/60 ml-2">{activity.action}</span>
                </div>
                <span className="text-sm text-white/40">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
