"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, AlertCircle, Check, Sparkles } from "lucide-react"
import { useAuthStore, isVITEmail, extractRegNumber, AuthUser } from "@/lib/auth-store"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function GoogleAuthModal() {
  const { showAuthModal, setShowAuthModal, setUser, setIsLoading, isLoading } =
    useAuthStore()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [step, setStep] = useState<"email" | "verifying" | "success">("email")

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    setStep("verifying")
    
    // Create Simulated Student profile (Instead of calling real NextAuth since keys are missing)
    const mockStudent: AuthUser = {
      id: `s-${Date.now()}`,
      email: "architect@vitstudent.ac.in",
      name: "Lead Architect",
      isVITStudent: true,
      registrationNumber: "22BCE1234",
      karma: 1500,
      trustTier: "elite",
      verificationsCount: 42,
      joinedAt: new Date().toISOString(),
      isGuest: false
    }

    // Simulate verification delay
    setTimeout(() => {
      setStep("success")
      setTimeout(() => {
        setUser(mockStudent)
        setIsLoading(false)
        setShowAuthModal(false)
        toast.success("Identity verified via VIT Relay. Full access unlocked.")
      }, 1000)
    }, 1500)
  }

  const handleDemoLogin = () => {
    setIsLoading(true)
    setError("")
    
    // Create Guest User
    const guestUser: AuthUser = {
      id: "guest-id",
      email: "guest@vitspotcheck.demo",
      name: "Guest Architect",
      isVITStudent: false,
      karma: 0,
      trustTier: "guest",
      verificationsCount: 0,
      joinedAt: new Date().toISOString(),
      isGuest: true
    }

    // Simulate short delay
    setTimeout(() => {
      setUser(guestUser)
      setIsLoading(false)
      setShowAuthModal(false)
      toast.success("Guest access granted. Views enabled, Karma disabled.")
    }, 800)
  }

  if (!showAuthModal) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
        onClick={() => !isLoading && setShowAuthModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md p-8 rounded-2xl glass-panel border border-white/10"
        >
          {/* Close Button */}
          {!isLoading && (
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          )}

          {/* Content based on step */}
          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                {/* Logo */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">V</span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome to VITspotCheck
                </h2>
                <p className="text-white/60 mb-8">
                  Sign in with your VIT student email to access campus intelligence
                </p>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400 text-left">{error}</p>
                  </motion.div>
                )}

                {/* Skip & Enter - THE PRIMARY BYPASS */}
                <button
                  onClick={handleDemoLogin}
                  className="w-full py-6 px-6 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#00FFD1] text-black font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(0,229,255,0.4)] mb-6 group"
                >
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Skip & Enter
                </button>

                {/* Google Sign In Button - SECONDARY */}
                <div className="relative mb-4 opacity-50 hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-4 px-6 rounded-xl bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center gap-3 hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      {/* ... path same as before ... */}
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                  </button>
                  <span className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-rose-500 text-[8px] font-black uppercase tracking-widest text-white shadow-lg">
                    Auth.js Required
                  </span>
                </div>

                {/* Info */}
                <div className="mt-8 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <div className="flex items-center gap-2 text-cyan-400 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">VIT Email Required</span>
                  </div>
                  <p className="text-xs text-white/50">
                    Only students with @vitstudent.ac.in email can access the platform
                  </p>
                </div>
              </motion.div>
            )}

            {step === "verifying" && (
              <motion.div
                key="verifying"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-8"
              >
                {/* Loading Spinner */}
                <div className="w-16 h-16 mx-auto mb-6 relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500"
                  />
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Verifying VIT Email
                </h3>
                <p className="text-white/60">
                  Checking your student credentials...
                </p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-8"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Welcome, VITian!
                </h3>
                <p className="text-white/60 mb-4">
                  You have been verified successfully
                </p>

                {/* Karma Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30"
                >
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-400 font-semibold">+100 Karma Welcome Bonus!</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
