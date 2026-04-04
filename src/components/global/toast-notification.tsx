"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Check, X } from "lucide-react"
import { useUIStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function ToastNotification() {
  const { activeToast, hideToast } = useUIStore()

  return (
    <div className="fixed top-24 right-6 z-[1001]">
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className={cn(
              "flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl min-w-[280px]",
              activeToast.type === "karma" &&
                "bg-gradient-to-r from-accent to-yellow-500",
              activeToast.type === "success" && "bg-status-empty",
              activeToast.type === "error" && "bg-status-conflict"
            )}
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              {activeToast.type === "karma" && (
                <Sparkles className="w-6 h-6 text-white" />
              )}
              {activeToast.type === "success" && (
                <Check className="w-6 h-6 text-white" />
              )}
              {activeToast.type === "error" && (
                <X className="w-6 h-6 text-white" />
              )}
            </div>

            {/* Message */}
            <span className="text-lg font-bold text-white">
              {activeToast.message}
            </span>

            {/* Close button */}
            <button
              onClick={hideToast}
              className="ml-auto opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
