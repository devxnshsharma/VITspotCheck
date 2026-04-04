"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Radio, Check, Zap, Calendar, TrendingUp } from "lucide-react"
import { useFeedStore } from "@/lib/store"
import type { FeedEvent } from "@/lib/store"
import { cn } from "@/lib/utils"

function getEventIcon(type: FeedEvent["type"]) {
  switch (type) {
    case "verification":
      return <Check className="w-3.5 h-3.5" />
    case "speedtest":
      return <Zap className="w-3.5 h-3.5" />
    case "booking":
      return <Calendar className="w-3.5 h-3.5" />
    case "status_change":
      return <TrendingUp className="w-3.5 h-3.5" />
    default:
      return <Check className="w-3.5 h-3.5" />
  }
}

function getEventColor(type: FeedEvent["type"]): string {
  switch (type) {
    case "verification":
      return "text-[#00FF88]"
    case "speedtest":
      return "text-[#00E5FF]"
    case "booking":
      return "text-[#FF9500]"
    case "status_change":
      return "text-[#FFD600]"
    default:
      return "text-white"
  }
}

export function LiveUpdateBanner() {
  const { events } = useFeedStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Cycle through events
  useEffect(() => {
    if (events.length === 0) return

    const interval = setInterval(() => {
      setIsVisible(false)
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % Math.min(events.length, 10))
        setIsVisible(true)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [events.length])

  if (events.length === 0) return null

  const currentEvent = events[currentIndex]
  if (!currentEvent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[900] px-4 pb-4 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key={currentEvent.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="px-5 py-3 rounded-xl glass-panel border border-white/10 flex items-center gap-4"
            >
              {/* Live Indicator */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Radio className="w-4 h-4 text-[#00FF88]" />
                  <span className="absolute inset-0 animate-ping">
                    <Radio className="w-4 h-4 text-[#00FF88] opacity-50" />
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#00FF88] uppercase tracking-wider">Live</span>
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-white/10" />

              {/* Event Icon */}
              <div className={cn("flex-shrink-0", getEventColor(currentEvent.type))}>
                {getEventIcon(currentEvent.type)}
              </div>

              {/* Event Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/90 truncate">
                  <span className="font-medium text-white">{currentEvent.userName}</span>{" "}
                  <span className="text-white/60">{currentEvent.action}</span>{" "}
                  <span className={cn("font-medium", getEventColor(currentEvent.type))}>
                    {currentEvent.roomName}
                  </span>
                </p>
              </div>

              {/* Karma */}
              {currentEvent.karma && currentEvent.karma > 0 && (
                <span className="text-xs font-semibold text-[#FF9500]">
                  +{currentEvent.karma} Karma
                </span>
              )}

              {/* Progress dots */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(events.length, 5) }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-colors",
                      i === currentIndex % 5 ? "bg-[#00E5FF]" : "bg-white/20"
                    )}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
