"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuthStore, KarmaEvent } from '@/lib/auth-store'

export function KarmaToast() {
  const lastUpdate = useAuthStore(s => s.lastKarmaUpdate)
  const [activeToasts, setActiveToasts] = useState<KarmaEvent[]>([])

  useEffect(() => {
    if (lastUpdate && lastUpdate.id) {
      setActiveToasts(prev => [...prev, lastUpdate])
      
      const timer = setTimeout(() => {
        setActiveToasts(prev => prev.filter(t => t.id !== lastUpdate.id))
      }, 4000)
      
      return () => clearTimeout(timer)
    }
  }, [lastUpdate])

  return (
    <div className="fixed bottom-24 right-8 z-[100] pointer-events-none flex flex-col gap-3 items-end">
      <AnimatePresence>
        {activeToasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="pointer-events-auto shadow-2xl overflow-hidden relative"
            style={{
              background: 'rgba(6, 6, 12, 0.9)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${toast.delta >= 0 ? 'rgba(52,211,153,0.3)' : 'rgba(251,113,133,0.3)'}`,
              borderRadius: '16px',
              padding: '12px 20px',
              minWidth: '240px',
              maxWidth: '320px'
            }}
          >
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${toast.delta >= 0 ? '#34D399' : '#FB7185'}, transparent 70%)`
              }}
            />
            
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-widest mb-1 text-white/50">
                  Karma Received
                </span>
                <span className="block text-sm text-white truncate font-medium">
                  {toast.reason}
                </span>
              </div>
              <motion.div 
                className="font-mono text-xl font-bold shrink-0"
                style={{ color: toast.delta >= 0 ? '#FBBF24' : '#FB7185' }}
                initial={{ scale: 0.5 }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                ✦ {toast.delta >= 0 ? '+' : ''}{toast.delta}
              </motion.div>
            </div>
            
            <motion.div 
              className="absolute bottom-0 left-0 h-0.5"
              style={{ background: toast.delta >= 0 ? '#34D399' : '#FB7185' }}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 4, ease: 'linear' }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
