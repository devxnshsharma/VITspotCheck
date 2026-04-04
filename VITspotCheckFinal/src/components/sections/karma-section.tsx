"use client"

import { motion } from "framer-motion"
import { Sparkles, Trophy, Star, TrendingUp, Award, Shield, Zap, Target } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { cn } from "@/lib/utils"

const KARMA_TIERS = [
  { name: "Newcomer", min: 0, max: 499, color: "text-white/60", icon: Star },
  { name: "Verified", min: 500, max: 1999, color: "text-[#00E5FF]", icon: Shield },
  { name: "Trusted", min: 2000, max: 4999, color: "text-[#FF9500]", icon: Award },
  { name: "Elite", min: 5000, max: Infinity, color: "text-[#00FF88]", icon: Trophy },
]

const KARMA_ACTIVITIES = [
  { action: "Room Verification", karma: "+5", icon: Shield, color: "text-[#00FF88]" },
  { action: "Speedtest Submit", karma: "+10", icon: Zap, color: "text-[#00E5FF]" },
  { action: "Layout Submission", karma: "+25", icon: Target, color: "text-[#FF9500]" },
  { action: "Conflict Resolution", karma: "+15", icon: Award, color: "text-[#FFD600]" },
]

export function KarmaSection() {
  const { user, isAuthenticated } = useAuthStore()

  const karma = user?.karma || 0
  const currentTier = KARMA_TIERS.find((t) => karma >= t.min && karma < t.max) || KARMA_TIERS[0]
  const nextTier = KARMA_TIERS[KARMA_TIERS.indexOf(currentTier) + 1]
  const progress = nextTier
    ? ((karma - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100

  return (
    <section id="karma" className="min-h-screen py-32 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase tracking-tight mb-4">
            Karma <span className="text-gradient-amber">Profile</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Build your reputation by contributing to campus intelligence
          </p>
        </motion.div>

        {isAuthenticated && user ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Karma Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl glass-panel-amber"
            >
              {/* User Info */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF9500] to-[#FFD600] flex items-center justify-center text-2xl font-bold text-black">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{user.name}</h3>
                  <p className="text-white/50 text-sm">{user.email}</p>
                </div>
              </div>

              {/* Karma Display */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Sparkles className="w-8 h-8 text-[#FF9500]" />
                  <span className="text-6xl font-bold text-white tabular-nums">
                    {karma.toLocaleString()}
                  </span>
                </div>
                <p className="text-white/50">Total Karma Points</p>
              </div>

              {/* Current Tier */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <currentTier.icon className={cn("w-5 h-5", currentTier.color)} />
                    <span className={cn("font-semibold", currentTier.color)}>
                      {currentTier.name}
                    </span>
                  </div>
                  {nextTier && (
                    <span className="text-sm text-white/40">
                      {nextTier.min - karma} to {nextTier.name}
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#FF9500] to-[#FFD600]"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-2xl font-bold text-[#00E5FF]">{user.verificationsCount}</p>
                  <p className="text-sm text-white/50">Verifications</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-2xl font-bold text-[#00FF88]">
                    {Math.floor(user.verificationsCount * 0.3)}
                  </p>
                  <p className="text-sm text-white/50">Speedtests</p>
                </div>
              </div>
            </motion.div>

            {/* Karma Activities */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl glass-panel"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#00E5FF]" />
                Earn Karma
              </h3>

              <div className="space-y-4">
                {KARMA_ACTIVITIES.map((activity, index) => (
                  <motion.div
                    key={activity.action}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-4"
                  >
                    <div className={cn("p-3 rounded-xl bg-white/10", activity.color)}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{activity.action}</p>
                    </div>
                    <span className={cn("text-lg font-bold", activity.color)}>
                      {activity.karma}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Tiers */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
                  Trust Tiers
                </h4>
                <div className="flex items-center gap-2">
                  {KARMA_TIERS.map((tier, index) => (
                    <div
                      key={tier.name}
                      className={cn(
                        "flex-1 p-3 rounded-lg text-center transition-colors",
                        karma >= tier.min
                          ? "bg-white/10"
                          : "bg-white/5 opacity-50"
                      )}
                    >
                      <tier.icon className={cn("w-5 h-5 mx-auto mb-1", tier.color)} />
                      <p className={cn("text-xs font-medium", tier.color)}>{tier.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-12 rounded-2xl glass-panel"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-[#FF9500]/50" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Sign in to view your Karma
            </h3>
            <p className="text-white/50 mb-6">
              Track your contributions and build your reputation
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
