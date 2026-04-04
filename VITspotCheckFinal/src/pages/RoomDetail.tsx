import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Wifi, Users, Clock, ShieldCheck, Zap } from "lucide-react"
import { useRoomStore, useUIStore } from "@/lib/store"
import { useEffect } from "react"
import { SpeedtestSection } from "@/components/sections/speedtest-section"

export default function RoomDetailPage() {
  const { roomId } = useParams()
  const { rooms } = useRoomStore()
  const { setDominantColor } = useUIStore()

  const room = rooms[roomId || ""]

  useEffect(() => {
    if (room) {
      const colors: Record<string, string> = {
        empty: "green",
        occupied: "amber",
        unverified: "cyan",
        conflict: "black"
      }
      setDominantColor((colors[room.status] as any) || "black")
    }
    return () => setDominantColor("black")
  }, [room, setDominantColor])

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Room Not Found</h1>
          <Link to="/" className="text-accent hover:underline">Return to Campus Map</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-6 lg:px-12 bg-[#06060A]">
      <div className="max-w-6xl mx-auto">
        {/* Back navigation */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campus Map
        </Link>

        {/* Room Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                room.status === 'empty' ? 'bg-status-empty/20 text-status-empty' : 
                room.status === 'occupied' ? 'bg-status-occupied/20 text-status-occupied' :
                'bg-status-unverified/20 text-status-unverified'
              }`}>
                {room.status}
              </span>
              <span className="text-white/40 flex items-center gap-1 text-sm">
                <Clock className="w-3.5 h-3.5" />
                Updated 5m ago
              </span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold text-white uppercase tracking-tighter">
              {room.name}
            </h1>
            <div className="flex items-center gap-4 mt-4 text-white/60">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-accent" />
                {room.block} - Floor {room.floor}
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-accent" />
                Capacity {room.capacity}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
             <Link
               to="/booking"
               className="px-8 py-3 rounded-full bg-accent text-white font-bold uppercase tracking-wider hover:scale-105 transition-transform"
             >
               Book Now
             </Link>
          </div>
        </div>

        {/* Room Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Wifi className="w-16 h-16" />
                  </div>
                  <h3 className="text-white/60 text-sm font-medium mb-1">Network Speed</h3>
                  <div className="text-3xl font-bold text-white mb-2">420 <span className="text-sm font-normal text-white/40">Mbps</span></div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full">
                    <div className="h-full w-[85%] bg-accent rounded-full shadow-[0_0_8px_#FB923C]" />
                  </div>
               </div>
               <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldCheck className="w-16 h-16" />
                  </div>
                  <h3 className="text-white/60 text-sm font-medium mb-1">Truth Density</h3>
                  <div className="text-3xl font-bold text-white mb-2">98.4 <span className="text-sm font-normal text-white/40">%</span></div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full">
                    <div className="h-full w-[98%] bg-status-empty rounded-full shadow-[0_0_8px_#10B981]" />
                  </div>
               </div>
            </div>

            {/* Network Analysis (Speedtest) */}
            <SpeedtestSection />
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            <div className="glass-panel-amber p-6 rounded-2xl">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <Zap className="w-5 h-5 text-accent" />
                 Smart Availability
               </h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Current FFCS Cycle</span>
                    <span className="text-white font-medium">Slot A1 (Theory)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Next Conflict</span>
                    <span className="text-white font-medium">None (until 2:00 PM)</span>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/40 leading-relaxed">
                      Based on current FFCS schedule and real-time room reporting, this space remains stable for the next 1h 45m.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
