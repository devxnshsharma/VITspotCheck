"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"

export function FloatingBookButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.4 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Link
        href="/booking"
        data-cursor="button"
        data-cursor-text="BOOK"
        className="group relative flex items-center gap-3 px-6 py-4 rounded-full bg-gradient-to-r from-accent to-yellow-500 shadow-[0_8px_32px_rgba(251,146,60,0.5)] hover:shadow-[0_16px_48px_rgba(251,146,60,0.8)] transition-all duration-300 hover:scale-105"
      >
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-yellow-500 opacity-50 blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Content */}
        <div className="relative flex items-center gap-3">
          <Plus className="w-5 h-5 text-white" />
          <span className="text-base font-bold text-white uppercase tracking-wider">
            Book Space
          </span>
        </div>
      </Link>

      {/* Floating animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}
