"use client"

import { motion } from "framer-motion"

export function Footer() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  const navLinks = [
    { label: "Map", id: "feed" },
    { label: "Speedtest", id: "speedtest" },
    { label: "Booking", id: "booking" },
    { label: "Layout", id: "layout-builder" },
    { label: "Karma", id: "profile" },
    { label: "Admin", id: "admin" },
  ]

  return (
    <footer className="relative border-t border-white/[0.04]" style={{ background: "#06060A" }}>
      <div className="max-w-[1400px] mx-auto px-10 py-20 lg:px-12">
        {/* Logo + Tagline */}
        <div className="mb-16">
          <span className="text-xl font-bold tracking-tight block mb-8">
            <span className="text-amber-400">VIT</span>
            <span className="text-white/35">spot</span>
            <span className="text-orange-400">Check</span>
          </span>

          <h2 className="text-3xl md:text-5xl font-bold text-white/90 tracking-tighter italic uppercase leading-tight max-w-[500px] mb-5">
            Campus Intelligence,<br />Reimagined.
          </h2>

          <p className="text-white/30 text-sm max-w-[380px] leading-relaxed mb-8">
            Real-time room tracking, smart bookings, and crowd-sourced campus data — all in one place.
          </p>

          <motion.a
            href="mailto:vitspotcheck@vit.ac.in"
            className="text-lg text-white/70 inline-flex items-center gap-2 tracking-tight"
            whileHover={{ color: "#FBBF24", x: 4 }}
          >
            vitspotcheck@vit.ac.in →
          </motion.a>
        </div>

        {/* Grid columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-20">
          {/* About */}
          <div>
            <h4 className="text-[10px] font-bold text-white/25 tracking-[0.12em] uppercase mb-5">
              About
            </h4>
            <div className="flex flex-col gap-3">
              <span className="text-white/45 text-sm">VIT Vellore</span>
              <span className="text-white/45 text-sm">Campus Intelligence Platform</span>
              <span className="text-white/45 text-sm">Built by Students</span>
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="text-[10px] font-bold text-white/25 tracking-[0.12em] uppercase mb-5">
              Navigate
            </h4>
            <div className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <motion.button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-white/45 text-sm text-left hover:text-amber-400 transition-colors"
                  whileHover={{ x: 3 }}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-[10px] font-bold text-white/25 tracking-[0.12em] uppercase mb-5">
              Connect
            </h4>
            <div className="flex flex-col gap-3">
              <motion.a
                href="https://github.com/devxnshsharma/VITspotCheck"
                target="_blank"
                rel="noopener"
                className="text-white/45 text-sm"
                whileHover={{ color: "#FBBF24", x: 3 }}
              >
                ↗ GitHub
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/school/vellore-institute-of-technology/"
                target="_blank"
                rel="noopener"
                className="text-white/45 text-sm"
                whileHover={{ color: "#FBBF24", x: 3 }}
              >
                ↗ LinkedIn
              </motion.a>
              <motion.a
                href="https://www.instagram.com/vellore_vit/"
                target="_blank"
                rel="noopener"
                className="text-white/45 text-sm"
                whileHover={{ color: "#FBBF24", x: 3 }}
              >
                ↗ Instagram
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex justify-between items-center pt-6 border-t border-white/[0.04]">
          <span className="font-mono text-[10px] text-white/15 tracking-[0.04em]">
            © VITspotCheck {new Date().getFullYear()}. All rights reserved.
          </span>

          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-10 h-10 rounded-full border border-white/10 text-white/40 text-[11px] font-mono flex items-center justify-center hover:border-amber-400/30 hover:text-amber-400 hover:bg-white/[0.03] transition-all"
            whileHover={{ scale: 1.05 }}
          >
            TOP ↑
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
