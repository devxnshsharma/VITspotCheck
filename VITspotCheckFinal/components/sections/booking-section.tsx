"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Calendar, Clock, MapPin, Zap, ChevronRight } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { toast } from "sonner"

const BLOCKS = [
  { id: 'SJT', name: 'SJT', fullName: 'Silver Jubilee Tower' },
  { id: 'AB1', name: 'AB1', fullName: 'Academic Block 1' },
  { id: 'PRP', name: 'PRP', fullName: 'Pearl Research Park' },
  { id: 'TT', name: 'TT', fullName: 'Technology Tower' }
]

export function BookingSection() {
  const { isAuthenticated, user, addKarma } = useAuthStore()
  const [step, setStep] = useState(1)
  const [selectedBlock, setSelectedBlock] = useState('AB1')
  const [selectedFloor, setSelectedFloor] = useState(1)
  const [selectedRoom, setSelectedRoom] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [startHour, setStartHour] = useState(10)
  const [endHour, setEndHour] = useState(12)
  const [purpose, setPurpose] = useState('')
  const [category, setCategory] = useState('')
  const [isLocking, setIsLocking] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const categories = ['Study Group', 'Club Meeting', 'Hackathon Prep', 'Workshop', 'Presentation']
  const generatedRooms = Array.from({ length: 6 }, (_, i) => ({ id: `${selectedBlock}-F${selectedFloor}-R${i+101}`, roomNumber: `${selectedFloor}${String(i+101).padStart(2, '0')}` }))

  const handleConfirm = async () => {
    if (!isAuthenticated) return toast.error("Please login to request domain locks.")
    setIsLocking(true)

    try {
      const res = await fetch('/api/bookings', {
        method: "POST",
        body: JSON.stringify({ 
           email: user?.email, 
           roomName: selectedRoom, 
           startTime: `${selectedDate}T${String(startHour).padStart(2, '0')}:00:00`,
           endTime: `${selectedDate}T${String(endHour).padStart(2, '0')}:00:00`,
           reason: `${category} - ${purpose}`
        }),
        headers: { "Content-Type": "application/json" }
      })

      if (res.ok) {
         await addKarma(50, `Secured Domain: ${selectedRoom}`)
         setIsConfirmed(true)
      } else toast.error("Database denied lock request.")
    } catch {
      toast.error("Network error")
    }

    setIsLocking(false)
  }

  return (
    <section id="booking" className="min-h-screen py-32 px-6 lg:px-12 flex flex-col justify-center relative bg-black overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter italic">
            Space <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Secure</span>
          </h2>
          <p className="mt-8 text-xs text-white/40 uppercase tracking-[0.6em] font-bold">
            Formal node reservation for academic collaboration
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20 items-start">
          
          {/* Stepper Logic */}
          <div className="space-y-16">
            <AnimatePresence mode="wait">
              {!isConfirmed ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="p-10 md:p-16 rounded-[60px] bg-obsidian/80 border border-white/10 backdrop-blur-2xl shadow-2xl"
                >
                  {/* Step 1 */}
                  {step === 1 && (
                    <div className="space-y-12">
                      <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/5">
                         <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/50">Step 01 // Sector Identification</p>
                         <span className="text-amber-500 font-mono text-xs">01/04</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {BLOCKS.map(b => (
                          <button
                            key={b.id}
                            onClick={() => setSelectedBlock(b.id)}
                            className={`p-10 rounded-[32px] border transition-all text-center ${
                              selectedBlock === b.id ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'bg-transparent border-white/10 hover:border-white/30'
                            }`}
                          >
                             <span className={`text-4xl font-black block mb-4 ${selectedBlock === b.id ? 'text-white' : 'text-white/40'}`}>{b.name}</span>
                             <span className="text-[9px] text-white/50 uppercase font-black tracking-widest">{b.fullName}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <div className="space-y-12">
                      <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/5">
                         <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/50">Step 02 // Level & Node Selection</p>
                         <span className="text-amber-500 font-mono text-xs">02/04</span>
                      </div>
                      <div className="flex flex-wrap gap-4 mb-12">
                        {[1,2,3,4,5].map((i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedFloor(i)}
                            className={`px-8 py-4 rounded-full text-[10px] font-black uppercase transition-all border ${
                              selectedFloor === i ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'text-white/40 border-white/10 hover:border-white/30'
                            }`}
                          >
                            Floor 0{i}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                        {generatedRooms.map(room => (
                          <button
                            key={room.id}
                            onClick={() => setSelectedRoom(room.id)}
                            className={`p-8 rounded-[32px] border text-center transition-all ${
                              selectedRoom === room.id ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-white/5 border-white/10 hover:border-white/30'
                            }`}
                          >
                             <span className="text-3xl font-black block">{room.roomNumber}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3 */}
                  {step === 3 && (
                    <div className="space-y-12">
                      <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/5">
                         <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/50">Step 03 // Temporal Alignment</p>
                         <span className="text-amber-500 font-mono text-xs">03/04</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                         <div className="space-y-6">
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">Target Date</p>
                            <input 
                              type="date" 
                              value={selectedDate}
                              onChange={e => setSelectedDate(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white font-black uppercase tracking-widest outline-none focus:border-amber-500 transition-all custom-calendar-icon"
                            />
                         </div>
                         <div className="space-y-12">
                            <div className="space-y-6">
                               <div className="flex justify-between">
                                  <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">Start: {startHour}:00</p>
                                  <Clock size={16} className="text-amber-500" />
                               </div>
                               <input type="range" min={8} max={20} value={startHour} onChange={e => setStartHour(parseInt(e.target.value))} className="w-full accent-amber-500 h-2 bg-white/10 appearance-none rounded-full" />
                            </div>
                            <div className="space-y-6">
                               <div className="flex justify-between">
                                  <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">End: {endHour}:00</p>
                                  <Clock size={16} className="text-amber-500" />
                               </div>
                               <input type="range" min={startHour + 1} max={22} value={endHour} onChange={e => setEndHour(parseInt(e.target.value))} className="w-full accent-amber-500 h-2 bg-white/10 appearance-none rounded-full" />
                            </div>
                         </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4 */}
                  {step === 4 && (
                    <div className="space-y-12">
                      <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/5">
                         <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/50">Step 04 // Protocol Intent</p>
                         <span className="text-amber-500 font-mono text-xs">04/04</span>
                      </div>
                      <div className="space-y-12">
                         <div className="flex flex-wrap gap-4">
                            {categories.map(cat => (
                              <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-8 py-4 rounded-full text-[10px] font-black uppercase border transition-all ${
                                  category === cat ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'text-white/40 border-white/10 hover:border-white/30'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                         </div>
                         <textarea 
                           placeholder="Describe the spatial objective..."
                           value={purpose}
                           onChange={e => setPurpose(e.target.value)}
                           className="w-full bg-white/5 border border-white/10 rounded-[32px] p-10 text-white font-medium outline-none focus:border-amber-500 transition-all min-h-[200px] resize-none"
                         />
                      </div>
                    </div>
                  )}

                  {/* Next Step Logic */}
                  <div className="mt-16 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <button 
                      onClick={() => setStep(s => Math.max(1, s - 1))}
                      className={`text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                      ← Back
                    </button>
                    <button 
                      onClick={() => step === 4 ? handleConfirm() : setStep(s => s + 1)}
                      disabled={isLocking || (step === 1 && !selectedBlock) || (step === 2 && !selectedRoom) || (step === 4 && (!category || !purpose))}
                      className="w-full md:w-auto h-20 px-16 rounded-[32px] bg-white text-black text-xs font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50"
                    >
                      {step === 4 ? (isLocking ? 'Synchronizing...' : 'Lock In Protocol') : 'Continue Flow'} <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-20 rounded-[60px] bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-2xl text-center space-y-12"
                >
                  <div className="w-32 h-32 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto shadow-[0_0_100px_rgba(16,185,129,0.3)]">
                     <Check size={60} className="text-emerald-400" />
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">Space Secured</h3>
                    <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.6em]">Node {selectedRoom} Authorized for Sector {selectedBlock}</p>
                  </div>
                  <button onClick={() => { setIsConfirmed(false); setStep(1); setSelectedRoom(''); }} className="text-white/40 uppercase text-[10px] font-black tracking-widest hover:text-white underline underline-offset-8">Reserve another shard</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Visual Summary */}
          <div className="space-y-10">
             <div className="p-10 rounded-[40px] bg-obsidian/80 border border-white/10 backdrop-blur-xl space-y-12 shadow-2xl">
                <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/40 flex items-center gap-3">
                   <Zap size={16} className="text-amber-500" /> Flux Summary
                </p>
                <div className="space-y-8">
                   <div className="space-y-3">
                      <p className="text-[10px] uppercase font-black tracking-widest text-white/40 flex items-center gap-2 italic"><MapPin size={12} /> Spatial Node</p>
                      <p className="text-2xl font-black text-white italic tracking-tight uppercase">{selectedBlock || '---'} // {selectedRoom ? selectedRoom.split('-')[2] : '---'}</p>
                   </div>
                   <div className="space-y-3">
                      <p className="text-[10px] uppercase font-black tracking-widest text-white/40 flex items-center gap-2 italic"><Calendar size={12} /> Timeline</p>
                      <p className="text-2xl font-black text-white italic tracking-tight uppercase">{selectedDate}</p>
                   </div>
                   <div className="space-y-3">
                      <p className="text-[10px] uppercase font-black tracking-widest text-white/40 flex items-center gap-2 italic"><Clock size={12} /> Transmission Window</p>
                      <p className="text-2xl font-black text-white italic tracking-tight uppercase">{startHour}:00 — {endHour}:00</p>
                   </div>
                </div>
             </div>

             <div className="p-10 rounded-[40px] border border-amber-500/20 bg-amber-500/5 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-8">
                   <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/50 italic">Sync Reward</p>
                   <span className="text-amber-400 font-black text-2xl drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">+50 ✦</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: '25%' }}
                     animate={{ width: isConfirmed ? '100%' : `${(step / 4) * 100}%` }}
                     transition={{ duration: 0.5 }}
                     className="h-full bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.8)]"
                   />
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  )
}
