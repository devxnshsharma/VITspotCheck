"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useRoomStore, useUIStore } from "@/lib/store"
import { BuildingCard } from "./building-card"
import { RoomCard } from "./room-card"
import { cn } from "@/lib/utils"

export function BlockSelector() {
  const { buildings, selectedBuilding, selectedFloor, selectBuilding, selectFloor, getRoomsByFloor } = useRoomStore()
  const { setDominantColor } = useUIStore()
  const [expandedBuilding, setExpandedBuilding] = useState<string | null>(null)

  // Set background color when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDominantColor("cyan")
        }
      },
      { threshold: 0.3 }
    )

    const element = document.getElementById("blocks")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [setDominantColor])

  const handleBuildingClick = (buildingId: string) => {
    if (expandedBuilding === buildingId) {
      setExpandedBuilding(null)
      selectBuilding(null)
    } else {
      setExpandedBuilding(buildingId)
      selectBuilding(buildingId)
      // Select first floor by default
      const building = buildings.find(b => b.id === buildingId)
      if (building && building.floors.length > 0) {
        selectFloor(building.floors[0])
      }
    }
  }

  const selectedBuildingData = buildings.find(b => b.id === expandedBuilding)
  const rooms = expandedBuilding && selectedFloor !== null
    ? getRoomsByFloor(expandedBuilding, selectedFloor)
    : []

  return (
    <section id="blocks" className="min-h-screen py-24 px-6 lg:px-12">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
          Select Building
        </h2>
        <p className="mt-3 text-white/50">
          Choose a block to explore available rooms
        </p>
      </motion.div>

      {/* Building Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {buildings.map((building, index) => (
          <BuildingCard
            key={building.id}
            building={building}
            isSelected={expandedBuilding === building.id}
            onClick={() => handleBuildingClick(building.id)}
            index={index}
          />
        ))}
      </div>

      {/* Expansion Panel */}
      <AnimatePresence>
        {expandedBuilding && selectedBuildingData && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-obsidian/90 backdrop-blur-xl border border-white/10">
              {/* Panel Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedBuildingData.name}
                  </h3>
                  <p className="text-white/50 mt-1">
                    {selectedBuildingData.emptyRooms} of {selectedBuildingData.totalRooms} rooms available
                  </p>
                </div>
                <button
                  onClick={() => {
                    setExpandedBuilding(null)
                    selectBuilding(null)
                  }}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  data-cursor="link"
                >
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>

              {/* Floor Selector Pills */}
              <div className="flex flex-wrap gap-3 mb-8">
                {selectedBuildingData.floors.map((floor) => (
                  <button
                    key={floor}
                    onClick={() => selectFloor(floor)}
                    data-cursor="link"
                    className={cn(
                      "px-5 py-2 rounded-full text-sm font-bold transition-all duration-200",
                      selectedFloor === floor
                        ? "bg-primary text-obsidian"
                        : "bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    F{floor}
                  </button>
                ))}
              </div>

              {/* Room Cards Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
                {rooms.map((room, index) => (
                  <RoomCard key={room.id} room={room} index={index} />
                ))}
              </div>

              {/* Legend */}
              <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-status-empty" />
                  <span className="text-white/60">Empty</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-status-occupied" />
                  <span className="text-white/60">Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-status-unverified" />
                  <span className="text-white/60">Unverified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-status-conflict" />
                  <span className="text-white/60">Conflict</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
