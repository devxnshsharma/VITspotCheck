"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

export function HeroSection() {
  const scrollToBlocks = () => {
    const blocksSection = document.getElementById("blocks")
    if (blocksSection) {
      blocksSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6"
    >
      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 100, clipPath: "inset(100% 0 0 0)" }}
        animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.4,
        }}
        className="text-center"
      >
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[120px] font-bold text-white uppercase tracking-tight"
          style={{ lineHeight: 1.1, letterSpacing: "0.03em" }}
        >
          Campus Intelligence
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary uppercase tracking-tight"
          style={{ letterSpacing: "0.03em" }}
        >
          Real-Time
        </motion.p>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-8 text-lg text-white/60 max-w-xl text-center"
      >
        Track room availability, network speeds, and book spaces across VIT campus.
        Powered by crowd-sourced intelligence.
      </motion.p>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        onClick={scrollToBlocks}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-primary transition-colors"
        data-cursor="link"
      >
        <span className="text-sm uppercase tracking-widest">Explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </section>
  )
}
