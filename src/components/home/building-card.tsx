"use client"

import { motion } from "framer-motion"
import type { Building } from "@/lib/store"
import { cn } from "@/lib/utils"

interface BuildingCardProps {
  building: Building
  isSelected: boolean
  onClick: () => void
  index: number
}

export function BuildingCard({
  building,
  isSelected,
  onClick,
  index,
}: BuildingCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      viewport={{ once: true }}
      onClick={onClick}
      data-cursor="link"
      data-cursor-text="EXPLORE"
      className={cn(
        "relative flex flex-col items-center justify-center w-full sm:w-[140px] h-20 rounded-xl transition-all duration-300",
        "glass-panel-cyan hover:scale-[1.03] hover:shadow-[0_8px_32px_rgba(6,182,212,0.3)]",
        isSelected && "bg-primary/15 border-primary/50"
      )}
    >
      {/* Building Name */}
      <span className="text-lg font-bold text-white">{building.shortName}</span>

      {/* Empty Count */}
      <span className="mt-1 text-sm text-primary tabular-nums">
        {building.emptyRooms}/{building.totalRooms}
      </span>

      {/* Active indicator */}
      {isSelected && (
        <motion.div
          layoutId="building-indicator"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full"
        />
      )}
    </motion.button>
  )
}
