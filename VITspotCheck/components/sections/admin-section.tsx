"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Users, AlertTriangle, Check, X, Eye, Clock, TrendingUp, Flag, Ban } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { cn } from "@/lib/utils"

interface Report {
  id: string
  type: "false_status" | "spam" | "abuse"
  roomName: string
  reportedBy: string
  reason: string
  timestamp: string
  status: "pending" | "resolved" | "dismissed"
}

const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    type: "false_status",
    roomName: "AB1 - 301",
    reportedBy: "21BCE2345",
    reason: "Room marked as empty but was occupied",
    timestamp: "2 min ago",
    status: "pending",
  },
  {
    id: "2",
    type: "spam",
    roomName: "AB2 - 105",
    reportedBy: "21BCE3456",
    reason: "Repeated false verifications for karma farming",
    timestamp: "15 min ago",
    status: "pending",
  },
  {
    id: "3",
    type: "abuse",
    roomName: "GDN - 201",
    reportedBy: "21BCE4567",
    reason: "Inappropriate comment in feedback",
    timestamp: "1 hour ago",
    status: "resolved",
  },
]

const MOCK_STATS = {
  totalUsers: 2847,
  activeToday: 423,
  verifications: 1205,
  pendingReports: 12,
}

export function AdminSection() {
  const { user, isAuthenticated } = useAuthStore()
  const [reports, setReports] = useState(MOCK_REPORTS)
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  const handleResolve = (id: string, action: "resolved" | "dismissed") => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    )
    setSelectedReport(null)
  }

  const isAdmin = isAuthenticated && user?.trustTier === "elite"

  return (
    <section id="admin" className="min-h-screen py-32 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase tracking-tight mb-4">
            Admin <span className="text-gradient-cyan">Panel</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Moderation dashboard for trusted community members
          </p>
        </motion.div>

        {/* Admin Check */}
        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-12 rounded-2xl glass-panel"
          >
            <Shield className="w-16 h-16 mx-auto mb-6 text-white/30" />
            <h3 className="text-2xl font-bold text-white mb-4">Sign in Required</h3>
            <p className="text-white/50">Admin access requires authentication</p>
          </motion.div>
        ) : (
          <>
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              {[
                { label: "Total Users", value: MOCK_STATS.totalUsers, icon: Users, color: "text-[#00E5FF]" },
                { label: "Active Today", value: MOCK_STATS.activeToday, icon: TrendingUp, color: "text-[#00FF88]" },
                { label: "Verifications", value: MOCK_STATS.verifications, icon: Check, color: "text-[#FF9500]" },
                { label: "Pending Reports", value: MOCK_STATS.pendingReports, icon: Flag, color: "text-[#FF4081]" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl glass-panel"
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                    <span className={cn("text-2xl font-bold tabular-nums", stat.color)}>
                      {stat.value.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-white/50">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Reports Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-2xl glass-panel"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#FF9500]" />
                Moderation Queue
              </h3>

              <div className="space-y-4">
                {reports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "p-4 rounded-xl transition-colors",
                      report.status === "pending"
                        ? "bg-white/5 hover:bg-white/10"
                        : "bg-white/[0.02] opacity-60"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              report.type === "false_status"
                                ? "bg-[#FFD600]/20 text-[#FFD600]"
                                : report.type === "spam"
                                ? "bg-[#FF9500]/20 text-[#FF9500]"
                                : "bg-[#FF4081]/20 text-[#FF4081]"
                            )}
                          >
                            {report.type.replace("_", " ")}
                          </span>
                          <span className="text-xs text-white/40">{report.timestamp}</span>
                        </div>
                        
                        <p className="font-medium text-white">{report.roomName}</p>
                        <p className="text-sm text-white/60 mt-1">{report.reason}</p>
                        <p className="text-xs text-white/40 mt-1">
                          Reported by {report.reportedBy}
                        </p>
                      </div>

                      {/* Actions */}
                      {report.status === "pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleResolve(report.id, "resolved")}
                            className="p-2 rounded-lg bg-[#00FF88]/20 text-[#00FF88] hover:bg-[#00FF88]/30 transition-colors"
                            title="Resolve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleResolve(report.id, "dismissed")}
                            className="p-2 rounded-lg bg-white/10 text-white/50 hover:bg-white/20 transition-colors"
                            title="Dismiss"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedReport(report.id)}
                            className="p-2 rounded-lg bg-white/10 text-white/50 hover:bg-white/20 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            report.status === "resolved"
                              ? "bg-[#00FF88]/20 text-[#00FF88]"
                              : "bg-white/10 text-white/50"
                          )}
                        >
                          {report.status}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
                  Quick Actions
                </h4>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 transition-colors flex items-center gap-2 text-sm">
                    <Ban className="w-4 h-4" />
                    View Banned Users
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 transition-colors flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    Activity Log
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 transition-colors flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    Analytics
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
