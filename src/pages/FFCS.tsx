"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, X, Scale, Wifi, ThermometerSun, Volume2, Users, Star } from "lucide-react"
import { useRoomStore, useUIStore } from "@/lib/store"
import { FFCS_SLOTS } from "@/lib/mock-data"
import type { Room } from "@/lib/store"
import { cn } from "@/lib/utils"

interface ComparisonRoom {
  room: Room
  selectedSlots: string[]
}

function calculateScore(room: Room): number {
  const { wifi, sockets, ac, quietness, lighting } = room.utilities
  return Math.round((wifi + sockets + ac + quietness + lighting) / 5)
}

function RoomComparisonColumn({ 
  comparison, 
  onRemove, 
  onToggleSlot,
  index 
}: { 
  comparison: ComparisonRoom
  onRemove: () => void
  onToggleSlot: (slot: string) => void
  index: number
}) {
  const { room, selectedSlots } = comparison
  const score = calculateScore(room)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-panel-cyan rounded-2xl p-6 relative"
    >
      {/* Remove Button */}
      <button
        onClick={onRemove}
        data-cursor="link"
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-status-conflict/20 transition-colors"
      >
        <X className="w-4 h-4 text-white/60" />
      </button>

      {/* Room Name */}
      <h3 className="text-2xl font-bold text-white mb-2">{room.name}</h3>
      <p className="text-white/60 text-sm mb-6">
        Capacity: {room.capacity} • Floor {room.floor}
      </p>

      {/* Overall Score */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-full bg-gradient-to-r from-primary to-cyan-400"
          />
        </div>
        <span className="text-xl font-bold text-primary">{score}</span>
      </div>

      {/* Utility Stats */}
      <div className="space-y-3 mb-6">
        {[
          { icon: Wifi, label: "WiFi", value: room.utilities.wifi },
          { icon: ThermometerSun, label: "AC", value: room.utilities.ac },
          { icon: Volume2, label: "Quiet", value: room.utilities.quietness },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-primary/60" />
            <span className="text-sm text-white/60 w-12">{label}</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/60"
                style={{ width: `${value}%` }}
              />
            </div>
            <span className="text-sm text-white/80 w-8 text-right">{value}</span>
          </div>
        ))}
      </div>

      {/* FFCS Slots */}
      <div>
        <h4 className="text-sm font-semibold text-white/80 mb-3">Select Slots</h4>
        <div className="flex flex-wrap gap-2">
          {FFCS_SLOTS.slice(0, 12).map((slot) => (
            <button
              key={slot}
              onClick={() => onToggleSlot(slot)}
              data-cursor="link"
              className={cn(
                "px-2 py-1 rounded text-xs font-semibold transition-all duration-200",
                selectedSlots.includes(slot)
                  ? "bg-primary text-obsidian"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              )}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Network Stats */}
      {room.network && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Network</span>
            <span className="text-primary font-semibold">
              {room.network.download}↓ {room.network.upload}↑ Mbps
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function FFCSPage() {
  const { rooms } = useRoomStore()
  const { setDominantColor } = useUIStore()
  const [comparisons, setComparisons] = useState<ComparisonRoom[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    setDominantColor("cyan")
    return () => setDominantColor("black")
  }, [setDominantColor])

  const filteredRooms = Object.values(rooms).filter(
    room => 
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !comparisons.some(c => c.room.id === room.id)
  )

  const addRoom = (room: Room) => {
    if (comparisons.length < 3) {
      setComparisons([...comparisons, { room, selectedSlots: [] }])
      setShowAddModal(false)
      setSearchQuery("")
    }
  }

  const removeRoom = (index: number) => {
    setComparisons(comparisons.filter((_, i) => i !== index))
  }

  const toggleSlot = (index: number, slot: string) => {
    setComparisons(comparisons.map((c, i) => {
      if (i !== index) return c
      const selectedSlots = c.selectedSlots.includes(slot)
        ? c.selectedSlots.filter(s => s !== slot)
        : [...c.selectedSlots, slot]
      return { ...c, selectedSlots }
    }))
  }

  // Find best room based on score
  const bestRoom = comparisons.length > 0
    ? comparisons.reduce((best, current) => 
        calculateScore(current.room) > calculateScore(best.room) ? current : best
      )
    : null

  return (
    <div className="min-h-screen pt-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight">
            FFCS Mode
          </h1>
          <p className="mt-2 text-white/60">
            Compare rooms based on your timetable slots
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {comparisons.map((comparison, index) => (
            <RoomComparisonColumn
              key={comparison.room.id}
              comparison={comparison}
              onRemove={() => removeRoom(index)}
              onToggleSlot={(slot) => toggleSlot(index, slot)}
              index={index}
            />
          ))}

          {/* Add Room Card */}
          {comparisons.length < 3 && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: comparisons.length * 0.1 }}
              onClick={() => setShowAddModal(true)}
              data-cursor="button"
              className="min-h-[400px] rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
            >
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <Plus className="w-8 h-8 text-white/40" />
              </div>
              <span className="text-white/60 font-semibold">Add Room to Compare</span>
            </motion.button>
          )}
        </div>

        {/* Best Room Banner */}
        {bestRoom && comparisons.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-status-empty/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-status-empty" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Recommended Room</h3>
                <p className="text-white/60">Based on overall utility score</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-status-empty">
                {bestRoom.room.name}
              </div>
              <div className="text-white/60">
                Score: {calculateScore(bestRoom.room)}
              </div>
            </div>
          </motion.div>
        )}

        {/* Add Room Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div
              className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-md glass-panel rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Add Room</h3>
              
              {/* Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rooms..."
                className="w-full px-4 py-3 rounded-xl glass-panel text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                data-cursor="input"
                autoFocus
              />

              {/* Room List */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredRooms.slice(0, 10).map((room) => (
                  <button
                    key={room.id}
                    onClick={() => addRoom(room)}
                    data-cursor="link"
                    className="w-full px-4 py-3 rounded-xl glass-panel text-left hover:bg-white/10 transition-colors"
                  >
                    <div className="font-semibold text-white">{room.name}</div>
                    <div className="text-sm text-white/60 flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      {room.capacity}
                      <span className="mx-1">•</span>
                      Score: {calculateScore(room)}
                    </div>
                  </button>
                ))}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowAddModal(false)}
                data-cursor="link"
                className="mt-4 w-full px-4 py-2 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}

        {/* Empty State */}
        {comparisons.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Scale className="w-16 h-16 mx-auto text-white/20 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Rooms Selected</h2>
            <p className="text-white/60">
              Add up to 3 rooms to compare their amenities and find the best match for your schedule.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
