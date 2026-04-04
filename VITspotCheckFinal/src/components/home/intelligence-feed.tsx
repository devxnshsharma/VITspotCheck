"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Check, Zap, Calendar, AlertCircle } from "lucide-react"
import { useFeedStore, useUIStore } from "@/lib/store"
import type { FeedEvent } from "@/lib/store"
import { cn } from "@/lib/utils"
import { CampusMap } from "./campus-map"

function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  
  return `${Math.floor(diffHours / 24)}d ago`
}

function getEventIcon(type: FeedEvent["type"]) {
  switch (type) {
    case "verification":
      return <Check className="w-4 h-4" />
    case "speedtest":
      return <Zap className="w-4 h-4" />
    case "booking":
      return <Calendar className="w-4 h-4" />
    case "status_change":
      return <AlertCircle className="w-4 h-4" />
    default:
      return <Check className="w-4 h-4" />
  }
}

function getEventColor(type: FeedEvent["type"]): string {
  switch (type) {
    case "verification":
      return "text-status-empty bg-status-empty/20"
    case "speedtest":
      return "text-primary bg-primary/20"
    case "booking":
      return "text-accent bg-accent/20"
    case "status_change":
      return "text-status-unverified bg-status-unverified/20"
    default:
      return "text-white bg-white/20"
  }
}

interface FeedItemProps {
  event: FeedEvent
  index: number
}

function FeedItem({ event, index }: FeedItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      viewport={{ once: true }}
      className="p-4 rounded-xl glass-panel hover:bg-white/[0.08] transition-colors"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            getEventColor(event.type)
          )}
        >
          {getEventIcon(event.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white">
            <span className="font-semibold">{event.userName}</span>{" "}
            <span className="text-white/70">{event.action}</span>{" "}
            <span className="text-primary font-medium">{event.roomName}</span>
          </p>

          {/* Speedtest data */}
          {event.type === "speedtest" && event.data && (
            <p className="mt-1 text-xs text-white/50 tabular-nums">
              {event.data.download as number}↓ {event.data.upload as number}↑ Mbps
            </p>
          )}

          {/* Meta */}
          <div className="mt-1 flex items-center gap-3 text-xs text-white/40">
            <span>{formatTimeAgo(event.timestamp)}</span>
            {event.karma && event.karma > 0 && (
              <span className="text-accent">+{event.karma} Karma</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function IntelligenceFeed() {
  const [events, setEvents] = useState<any[]>([])
  const { setDominantColor } = useUIStore()

  // Set background color when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDominantColor("amber")
        }
      },
      { threshold: 0.3 }
    )

    const element = document.getElementById("feed")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [setDominantColor])

  // Poll real events every 5s
  useEffect(() => {
    const fetchFeed = async () => {
       try {
         const res = await fetch('/api/feed')
         if (res.ok) setEvents(await res.json())
       } catch (e) {
         console.error(e)
       }
    }
    fetchFeed()
    const interval = setInterval(fetchFeed, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="feed" className="min-h-screen py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
          {/* Campus Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl glass-panel overflow-hidden lg:min-h-[600px]"
          >
            <CampusMap />
          </motion.div>

          {/* Intelligence Feed */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
                Live Intelligence
              </h2>
              <p className="text-white/50 mt-1">
                Real-time campus activity feed
              </p>
            </div>

            {/* Feed Items */}
            <div className="flex-1 overflow-y-auto max-h-[600px] space-y-3 pr-2 custom-scrollbar">
              {events.length === 0 && <p className="text-white/30 italic text-sm">Waiting for network flux...</p>}
              {events.slice(0, 15).map((event, index) => (
                <FeedItem key={event.id} event={event as FeedEvent} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
