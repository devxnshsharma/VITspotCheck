"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wifi, Zap, Hexagon, Shield, Activity, RefreshCw } from "lucide-react"
import { useUIStore, useFeedStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"
import { cn } from "@/lib/utils"

type TestPhase = "idle" | "latency" | "download" | "upload" | "results"

interface SpeedtestEngineProps {
  roomId: string
  roomName: string
  onComplete?: (results: { download: number; upload: number; ping: number }) => void
}

export function SpeedtestEngine({ roomId, roomName, onComplete }: SpeedtestEngineProps) {
  const { setDominantColor, showToast } = useUIStore()
  const { user, isAuthenticated, addKarma } = useAuthStore()
  const { addEvent } = useFeedStore()

  const [phase, setPhase] = useState<TestPhase>("idle")
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<{ download: number; upload: number; ping: number }>({
    download: 0,
    upload: 0,
    ping: 0
  })

  const runFullAnalysis = useCallback(async () => {
    setPhase("latency")
    setProgress(10)

    try {
      // 1. Measure Latency (Ping)
      const pingStart = performance.now()
      const pingRes = await fetch('/api/speedtest/ping', { cache: 'no-store' })
      const pingEnd = performance.now()
      const realPing = Math.round(pingEnd - pingStart)
      
      setResults(prev => ({ ...prev, ping: realPing }))
      setProgress(30)
      setPhase("download")

      // 2. Measure Download Throughput
      const dlStart = performance.now()
      const dlRes = await fetch('/api/speedtest/download', { cache: 'no-store' })
      if (!dlRes.ok) throw new Error("Flux Sync Failed")
      
      const reader = dlRes.body?.getReader()
      let receivedBytes = 0
      const totalBytes = Number(dlRes.headers.get('Content-Length')) || 5 * 1024 * 1024

      if (!reader) throw new Error("No Streamer")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        receivedBytes += value.length
        setProgress(30 + Math.round((receivedBytes / totalBytes) * 60))
        
        // Dynamic Mbps update
        const dlCurrent = performance.now()
        const dlElapsed = (dlCurrent - dlStart) / 1000
        const currentMbps = (receivedBytes * 8) / (dlElapsed * 1024 * 1024)
        setResults(prev => ({ ...prev, download: Number(currentMbps.toFixed(2)) }))
      }

      const dlEnd = performance.now()
      const dlTime = (dlEnd - dlStart) / 1000
      const finalDownload = (receivedBytes * 8) / (dlTime * 1024 * 1024)

      // 3. Simulated Upload (Mocked for now since upload endpoint is not high-bandwidth)
      setPhase("upload")
      setProgress(95)
      const finalUpload = finalDownload * 0.4 // Typical asymmetric ratio

      // Finalize
      const finalResults = {
        download: Number(finalDownload.toFixed(2)),
        upload: Number(finalUpload.toFixed(2)),
        ping: realPing
      }

      setResults(finalResults)
      setPhase("results")
      setProgress(100)

      // Award karma and log event
      if (isAuthenticated) {
        addKarma(3, `Telemetry Sync: ${roomName}`)
      }
      showToast("+3 KARMA", "karma")
      
      addEvent({
        id: `event_${Date.now()}`,
        type: "speedtest",
        userId: user?.id || "anonymous",
        userName: user?.name || "Anonymous",
        roomId,
        roomName,
        action: "benchmarked network at",
        karma: 3,
        timestamp: new Date().toISOString(),
        data: finalResults,
      })

      if (onComplete) onComplete(finalResults)
    } catch (error) {
      console.error(error)
      showToast("Telemetry Sync Error", "error")
      setPhase("idle")
    }
  }, [roomId, roomName, user, isAuthenticated, addKarma, showToast, addEvent, onComplete])

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Branding Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl lg:text-5xl font-black text-white tracking-widest uppercase mb-2">
          Data Flux Analyzer
        </h2>
        <p className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">
          Professional Native Telemetry v2.0 <span className="text-primary">[Resilient]</span>
        </p>
      </div>

      <div className="glass-panel-cyan rounded-3xl p-12 glow-cyan relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <AnimatePresence mode="wait">
          {phase === "idle" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center py-12"
            >
              {/* Circular Icon */}
              <div className="relative w-48 h-48 mb-12">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-24 h-24 rounded-full border border-primary/30 flex items-center justify-center">
                      <Zap className="w-12 h-12 text-primary" />
                   </div>
                </div>
                {/* Orbital dots */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_12px_#06B6D4]" />
                </motion.div>
              </div>

              {/* Central Display */}
              <div className="text-center mb-12">
                <div className="text-7xl font-black text-white tabular-nums mb-1">0.00</div>
                <div className="text-xs font-bold text-white/40 tracking-[0.2em] uppercase">Mbps Download</div>
              </div>

              {/* Action Button */}
              <button
                onClick={runFullAnalysis}
                data-cursor="button"
                className="group relative px-12 py-5 rounded-full bg-primary text-obsidian font-black text-sm uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_32px_rgba(6,182,212,0.4)] overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                   <Activity className="w-4 h-4" />
                   Start Full Analysis
                </span>
                <motion.div 
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </button>

              <div className="mt-8 text-[10px] font-bold text-white/30 tracking-widest uppercase">
                Benchmarked Against Resilient CDN Relay
              </div>
            </motion.div>
          ) : phase === "results" ? (
             <motion.div
               key="results"
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="py-8"
             >
               <div className="grid grid-cols-3 gap-6 mb-12">
                 <div className="text-center p-6 glass-panel rounded-2xl border border-white/5">
                   <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Ping</div>
                   <div className="text-3xl font-black text-primary tabular-nums">{results.ping}<span className="text-xs ml-1 opacity-50">ms</span></div>
                 </div>
                 <div className="text-center p-6 glass-panel rounded-2xl border border-white/5">
                   <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Down</div>
                   <div className="text-3xl font-black text-primary tabular-nums">{results.download}</div>
                 </div>
                 <div className="text-center p-6 glass-panel rounded-2xl border border-white/5">
                   <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Up</div>
                   <div className="text-3xl font-black text-primary tabular-nums">{results.upload}</div>
                 </div>
               </div>

               <div className="text-center">
                 <button
                   onClick={() => setPhase("idle")}
                   className="text-primary text-xs font-bold uppercase tracking-[0.2em] hover:opacity-70 transition-opacity flex items-center gap-2 mx-auto"
                 >
                   <RefreshCw className="w-3 h-3" />
                   Recalibrate Flux
                 </button>
               </div>
             </motion.div>
          ) : (
            <motion.div
              key="testing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 flex flex-col items-center"
            >
              {/* Progress Ring */}
              <div className="relative w-64 h-64 mb-12">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="128" cy="128" r="110" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <circle
                    cx="128" cy="128" r="110" fill="none" stroke="#06B6D4" strokeWidth="4"
                    strokeLinecap="round" strokeDasharray={691}
                    strokeDashoffset={691 - (691 * progress) / 100}
                    className="transition-all duration-300 ease-linear shadow-[0_0_20px_#06B6D4]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <motion.div 
                     key={phase}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="text-4xl lg:text-6xl font-black text-white tabular-nums"
                   >
                     {phase === "download" ? results.download : results.ping}
                   </motion.div>
                   <div className="text-[10px] font-bold text-primary tracking-widest uppercase mt-2">
                     {phase === "latency" ? "Latency Ping" : phase === "download" ? "Mbps Download" : "Finalizing Upload"}
                   </div>
                </div>
              </div>

              <div className="w-full max-w-sm h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 shrink-0">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-cyan-400 shadow-[0_0_12px_#06B6D4]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-4 text-[10px] font-bold text-white/30 tracking-[0.3em] uppercase">
                Synchronizing Architectural Data Nodes...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
