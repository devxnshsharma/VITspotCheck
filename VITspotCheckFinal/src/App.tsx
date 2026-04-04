import { Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { Providers } from "@/components/providers"
import { KarmaToast } from "@/components/global/karma-toast"

import Home from "./pages/Home"
import Booking from "./pages/Booking"
import MyBookings from "./pages/MyBookings"
import FFCS from "./pages/FFCS"
import RoomDetail from "./pages/RoomDetail"
import Speedtest from "./pages/Speedtest"


export default function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/ffcs" element={<FFCS />} />
        <Route path="/room/:roomId" element={<RoomDetail />} />
        <Route path="/speedtest/:roomId" element={<Speedtest />} />
      </Routes>
      <KarmaToast />
      <Toaster position="bottom-right" theme="dark" />
    </Providers>
  )
}
