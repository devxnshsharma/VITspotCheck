import { useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { SpeedtestEngine } from "@/components/speedtest/speedtest-engine"
import { useRoomStore } from "@/lib/store"

export default function SpeedtestPage() {
  const { roomId } = useParams()
  const { rooms } = useRoomStore()
  const room = rooms[roomId || ""]

  return (
    <div className="min-h-screen pt-20 px-6 lg:px-12 bg-[#06060A]">
      <div className="max-w-4xl mx-auto py-12">
        <Link 
          to={roomId ? `/room/${roomId}` : "/"} 
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Room
        </Link>
        <SpeedtestEngine 
          roomId={roomId || ""} 
          roomName={room?.name || "Unknown Room"} 
        />
      </div>
    </div>
  )
}

