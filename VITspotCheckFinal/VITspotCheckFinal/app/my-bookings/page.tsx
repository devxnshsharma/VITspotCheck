"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Calendar, Clock, MapPin, Check, X, AlertCircle } from "lucide-react"
import { useBookingStore, useRoomStore, useUIStore } from "@/lib/store"
import { BOOKINGS } from "@/lib/mock-data"
import type { Booking } from "@/lib/store"
import { cn } from "@/lib/utils"

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { 
    weekday: "short", 
    month: "short", 
    day: "numeric" 
  })
}

function getStatusIcon(status: Booking["status"]) {
  switch (status) {
    case "confirmed":
      return <Calendar className="w-5 h-5" />
    case "completed":
      return <Check className="w-5 h-5" />
    case "cancelled":
      return <X className="w-5 h-5" />
    default:
      return <AlertCircle className="w-5 h-5" />
  }
}

function getStatusColor(status: Booking["status"]) {
  switch (status) {
    case "confirmed":
      return "bg-primary/20 text-primary border-primary/30"
    case "completed":
      return "bg-status-empty/20 text-status-empty border-status-empty/30"
    case "cancelled":
      return "bg-status-conflict/20 text-status-conflict border-status-conflict/30"
    default:
      return "bg-status-unverified/20 text-status-unverified border-status-unverified/30"
  }
}

interface BookingCardProps {
  booking: Booking
  roomName: string
  onCancel?: () => void
  index: number
}

function BookingCard({ booking, roomName, onCancel, index }: BookingCardProps) {
  const isPast = new Date(booking.date) < new Date()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "glass-panel rounded-2xl p-6 transition-all duration-200",
        booking.status === "cancelled" && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Room */}
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-accent" />
            <span className="text-xl font-bold text-white">{roomName}</span>
          </div>

          {/* Date & Time */}
          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(booking.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{booking.startTime} - {booking.endTime}</span>
            </div>
          </div>

          {/* Purpose */}
          {booking.purpose && (
            <p className="mt-3 text-sm text-white/50">{booking.purpose}</p>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex flex-col items-end gap-3">
          <div
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border",
              getStatusColor(booking.status)
            )}
          >
            <span className="flex items-center gap-1.5">
              {getStatusIcon(booking.status)}
              {booking.status}
            </span>
          </div>

          {/* Cancel Button */}
          {booking.status === "confirmed" && !isPast && onCancel && (
            <button
              onClick={onCancel}
              data-cursor="link"
              className="text-sm text-status-conflict/70 hover:text-status-conflict transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function MyBookingsPage() {
  const { bookings, setBookings, cancelBooking } = useBookingStore()
  const { rooms } = useRoomStore()
  const { setDominantColor, showToast } = useUIStore()

  useEffect(() => {
    setDominantColor("cyan")
    // Initialize with mock data if empty
    if (bookings.length === 0) {
      setBookings(BOOKINGS)
    }
    return () => setDominantColor("black")
  }, [setDominantColor, bookings.length, setBookings])

  const handleCancel = (bookingId: string) => {
    cancelBooking(bookingId)
    showToast("Booking cancelled", "success")
  }

  // Sort bookings: upcoming first, then by date
  const sortedBookings = [...bookings].sort((a, b) => {
    const statusOrder = { pending: 0, confirmed: 1, completed: 2, cancelled: 3 }
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status]
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  const upcomingBookings = sortedBookings.filter(
    b => b.status === "confirmed" || b.status === "pending"
  )
  const pastBookings = sortedBookings.filter(
    b => b.status === "completed" || b.status === "cancelled"
  )

  return (
    <div className="min-h-screen pt-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight">
              My Bookings
            </h1>
            <p className="mt-2 text-white/60">Manage your room reservations</p>
          </div>
          <Link
            href="/booking"
            data-cursor="button"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent to-yellow-500 text-white font-bold uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_8px_32px_rgba(251,146,60,0.3)]"
          >
            <Plus className="w-5 h-5" />
            Book New
          </Link>
        </motion.div>

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <section className="mb-12">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-semibold text-white mb-6 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming
            </motion.h2>
            <div className="space-y-4">
              {upcomingBookings.map((booking, index) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  roomName={rooms[booking.roomId]?.name || booking.roomId}
                  onCancel={() => handleCancel(booking.id)}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <section>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-semibold text-white/60 mb-6 flex items-center gap-2"
            >
              <Clock className="w-5 h-5" />
              Past
            </motion.h2>
            <div className="space-y-4">
              {pastBookings.map((booking, index) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  roomName={rooms[booking.roomId]?.name || booking.roomId}
                  index={index + upcomingBookings.length}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {bookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-white/20" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Bookings Yet</h2>
            <p className="text-white/60 mb-8">
              Reserve a room to get started with your bookings.
            </p>
            <Link
              href="/booking"
              data-cursor="button"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-accent to-yellow-500 text-white font-bold uppercase tracking-wider hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" />
              Book Your First Space
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
