"use client"

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Play, CheckCircle, Zap, RefreshCw } from 'lucide-react'
import { useAuthStore } from '@/lib/auth-store'
import { toast } from 'sonner'
import { useUIStore } from '@/lib/store'

// Fallback chain for resilience
const FALLBACK_URLS = [
  "https://speed.cloudflare.com/__down?bytes=25000000",
  "https://speed.cloudflare.com/__down?bytes=10000000",
  "https://raw.githubusercontent.com/librespeed/speedtest/master/backend/garbage.php?bytes=10000000"
]

export function SpeedtestSection() {
  const { addKarma, isAuthenticated, user } = useAuthStore()
  const { setDominantColor } = useUIStore()
  const [downloadSpeed, setDownloadSpeed] = useState<number>(0)
  const [isTesting, setIsTesting] = useState(false)
  const [testComplete, setTestComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const abortControllerRef = useRef<AbortController | null>(null)

  const runAutomatedTest = useCallback(async () => {
    setDominantColor("cyan")
    setIsTesting(true)
    setTestComplete(false)
    setDownloadSpeed(0)
    setProgress(0)
    
    abortControllerRef.current = new AbortController()

    // Try each fallback URL in sequence
    for (const url of FALLBACK_URLS) {
      if (abortControllerRef.current.signal.aborted) break;

      try {
        const startTime = performance.now()
        let loadedBytes = 0
        const isSmallFile = url.includes("bytes=10000000")
        const totalBytes = isSmallFile ? 10000000 : 25000000

        const response = await fetch(url, {
          signal: abortControllerRef.current.signal,
          cache: 'no-store',
          mode: 'cors'
        })

        if (!response.ok) continue; // Try next URL if 4xx or 5xx
        if (!response.body) throw new Error("Stream not supported")

        const reader = response.body.getReader()
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          loadedBytes += value.length
          const currentTime = performance.now()
          const durationInSeconds = (currentTime - startTime) / 1000
          
          if (durationInSeconds > 0) {
            const bitsLoaded = loadedBytes * 8
            const currentMbps = (bitsLoaded / durationInSeconds) / 1000000
            setDownloadSpeed(currentMbps)
            setProgress(Math.min((loadedBytes / totalBytes) * 100, 100))
          }
        }

        // If we got here, the test succeeded!
        setIsTesting(false)
        setTestComplete(true)
        
        const finalSpeed = downloadSpeed.toFixed(2)
        
        if (isAuthenticated) {
          if (user?.isGuest) {
            await addKarma(0, `Guest automated test: ${finalSpeed}Mbps`)
            toast.info(`Engine verified at ${finalSpeed}Mbps (Guest mode - no karma)`)
          } else {
            await addKarma(50, `Native automated test: ${finalSpeed}Mbps`)
            toast.success(`Analysis complete: ${finalSpeed}Mbps synced! +50 Karma`)
          }
        }
        return; // EXIT loop as we finished successfully

      } catch (error: any) {
        if (error.name === 'AbortError') return
        console.warn(`Speedtest fallback triggered for ${url}:`, error)
        // Continue to the next URL in the loop
      }
    }

    // If we're here, all URLs failed
    setIsTesting(false)
    toast.error("Telemetry failure. All relay nodes unresponsive.")
  }, [addKarma, isAuthenticated, user, setDominantColor, downloadSpeed])

  const cancelTest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsTesting(false)
      toast.info("Test canceled.")
    }
  }

  return (
    <section id="speedtest" className="min-h-screen py-24 px-6 lg:px-12 flex items-center justify-center relative overflow-hidden"
      onMouseEnter={() => setDominantColor("cyan")}
    >
      <div className="w-full max-w-6xl mx-auto z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tight">
            Data Flux Analyzer
          </h2>
          <p className="mt-4 text-xs text-white/50 uppercase tracking-[0.4em] font-medium">
            Professional Native Telemetry v2.0 (Resilient)
          </p>
        </motion.div>

        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-10 rounded-3xl bg-obsidian/80 backdrop-blur-xl border border-white/10 shadow-2xl text-center space-y-12"
          >
            {/* Speed Gauge Area */}
            <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
              {/* Outer Ring Progressbar */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-white/5"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray="754" // 2 * PI * 120
                  initial={{ strokeDashoffset: 754 }}
                  animate={{ strokeDashoffset: 754 - (754 * progress / 100) }}
                  transition={{ type: "spring", stiffness: 50, damping: 20 }}
                  className={testComplete ? "text-green-400" : "text-cyan-400"}
                />
              </svg>

              {/* Pulsing Back Glow */}
              <AnimatePresence>
                {isTesting && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-8 rounded-full bg-cyan-500/10 blur-2xl"
                  />
                )}
              </AnimatePresence>

              <div className={`w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-inner transition-colors duration-500 z-10 ${isTesting ? 'bg-cyan-500/5' : testComplete ? 'bg-green-500/5' : 'bg-white/5'}`}>
                {testComplete ? (
                  <CheckCircle size={60} className="text-green-400" />
                ) : (
                  <Zap size={60} className={isTesting ? "text-cyan-400 animate-pulse" : "text-white/20"} />
                )}
              </div>
            </div>

            {/* Readout Readability */}
            <div className="space-y-2">
              <div className="flex flex-col items-center">
                <span className={`text-7xl font-black font-mono tracking-tighter tabular-nums ${testComplete ? 'text-green-400' : 'text-cyan-400'}`}>
                  {downloadSpeed.toFixed(2)}
                </span>
                <span className="text-sm uppercase tracking-[0.5em] font-bold text-white/40">Mbps Download</span>
              </div>
              
              <AnimatePresence>
                {isTesting && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-[10px] text-cyan-400/60 font-black uppercase tracking-widest pt-4"
                  >
                    Streaming Native Flux Packets... {Math.round(progress)}%
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Button */}
            <div className="flex flex-col items-center gap-4">
              {!isTesting ? (
                <button 
                  onClick={runAutomatedTest}
                  className="w-full max-w-xs py-5 rounded-full bg-cyan-500 text-black text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.05] active:scale-95 transition-all shadow-[0_10px_40px_rgba(6,182,212,0.3)]"
                >
                  {testComplete ? <><RefreshCw size={16} /> Re-Analyze Flux</> : <><Play size={16} fill="black" /> Start Full Analysis</>}
                </button>
              ) : (
                <button 
                  onClick={cancelTest}
                  className="w-full max-w-xs py-5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-red-500/20 transition-all"
                >
                  Cancel Analysis
                </button>
              )}
              
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                Benchmarked against Resilient CDN Relay
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
