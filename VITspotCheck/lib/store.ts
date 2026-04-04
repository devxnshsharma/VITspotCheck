"use client"

import { create } from "zustand"

// Types
export type RoomStatus = "empty" | "occupied" | "unverified" | "conflict"

export interface Room {
  id: string
  name: string
  block: string
  floor: number
  capacity: number
  status: RoomStatus
  type: "classroom" | "lab"
  lastVerified?: string
  lastVerifiedBy?: string
  utilities: {
    wifi: number
    sockets: number
    ac: number
    quietness: number
    lighting: number
  }
  network?: {
    download: number
    upload: number
    ping: number
  }
}

export interface Building {
  id: string
  name: string
  shortName: string
  totalRooms: number
  emptyRooms: number
  floors: number[]
}

export interface User {
  id: string
  name: string
  avatar?: string
  karma: number
  trustTier: "newcomer" | "verified" | "trusted" | "elite"
  verificationsCount: number
  joinedAt: string
}

export interface Booking {
  id: string
  roomId: string
  userId: string
  date: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  purpose?: string
}

export interface FeedEvent {
  id: string
  type: "verification" | "speedtest" | "booking" | "status_change"
  userId: string
  userName: string
  roomId: string
  roomName: string
  action: string
  karma?: number
  timestamp: string
  data?: Record<string, unknown>
}

// Room Store
interface RoomState {
  rooms: Record<string, Room>
  buildings: Building[]
  selectedBuilding: string | null
  selectedFloor: number | null
  setRooms: (rooms: Room[]) => void
  setBuildings: (buildings: Building[]) => void
  updateRoomStatus: (roomId: string, status: RoomStatus) => void
  selectBuilding: (buildingId: string | null) => void
  selectFloor: (floor: number | null) => void
  getRoomsByBuilding: (buildingId: string) => Room[]
  getRoomsByFloor: (buildingId: string, floor: number) => Room[]
}

export const useRoomStore = create<RoomState>((set, get) => ({
  rooms: {},
  buildings: [],
  selectedBuilding: null,
  selectedFloor: null,

  setRooms: (rooms) =>
    set({
      rooms: rooms.reduce((acc, room) => ({ ...acc, [room.id]: room }), {}),
    }),

  setBuildings: (buildings) => set({ buildings }),

  updateRoomStatus: (roomId, status) =>
    set((state) => ({
      rooms: {
        ...state.rooms,
        [roomId]: { ...state.rooms[roomId], status },
      },
    })),

  selectBuilding: (buildingId) =>
    set({ selectedBuilding: buildingId, selectedFloor: null }),

  selectFloor: (floor) => set({ selectedFloor: floor }),

  getRoomsByBuilding: (buildingId) => {
    const { rooms } = get()
    return Object.values(rooms).filter((room) => room.block === buildingId)
  },

  getRoomsByFloor: (buildingId, floor) => {
    const { rooms } = get()
    return Object.values(rooms).filter(
      (room) => room.block === buildingId && room.floor === floor
    )
  },
}))

// User Store
interface UserState {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  addKarma: (amount: number) => void
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  addKarma: (amount) =>
    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, karma: state.currentUser.karma + amount }
        : null,
    })),
}))

// UI Store
interface UIState {
  isMenuOpen: boolean
  isPreloaderComplete: boolean
  dominantColor: "black" | "cyan" | "amber" | "green"
  activeToast: { message: string; type: "karma" | "success" | "error" } | null
  toggleMenu: () => void
  setPreloaderComplete: (complete: boolean) => void
  setDominantColor: (color: "black" | "cyan" | "amber" | "green") => void
  showToast: (message: string, type: "karma" | "success" | "error") => void
  hideToast: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isMenuOpen: false,
  isPreloaderComplete: false,
  dominantColor: "black",
  activeToast: null,

  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),

  setPreloaderComplete: (complete) => set({ isPreloaderComplete: complete }),

  setDominantColor: (color) => set({ dominantColor: color }),

  showToast: (message, type) => {
    set({ activeToast: { message, type } })
    setTimeout(() => set({ activeToast: null }), 3000)
  },

  hideToast: () => set({ activeToast: null }),
}))

// Feed Store
interface FeedState {
  events: FeedEvent[]
  addEvent: (event: FeedEvent) => void
  setEvents: (events: FeedEvent[]) => void
}

export const useFeedStore = create<FeedState>((set) => ({
  events: [],

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events].slice(0, 50), // Keep last 50 events
    })),

  setEvents: (events) => set({ events }),
}))

// Booking Store
interface BookingState {
  bookings: Booking[]
  currentBookingStep: number
  selectedRoom: string | null
  selectedDate: string | null
  selectedTimeSlot: { start: string; end: string } | null
  setBookings: (bookings: Booking[]) => void
  addBooking: (booking: Booking) => void
  cancelBooking: (bookingId: string) => void
  setBookingStep: (step: number) => void
  setSelectedRoom: (roomId: string | null) => void
  setSelectedDate: (date: string | null) => void
  setSelectedTimeSlot: (slot: { start: string; end: string } | null) => void
  resetBookingFlow: () => void
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  currentBookingStep: 1,
  selectedRoom: null,
  selectedDate: null,
  selectedTimeSlot: null,

  setBookings: (bookings) => set({ bookings }),

  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),

  cancelBooking: (bookingId) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" as const } : b
      ),
    })),

  setBookingStep: (step) => set({ currentBookingStep: step }),

  setSelectedRoom: (roomId) => set({ selectedRoom: roomId }),

  setSelectedDate: (date) => set({ selectedDate: date }),

  setSelectedTimeSlot: (slot) => set({ selectedTimeSlot: slot }),

  resetBookingFlow: () =>
    set({
      currentBookingStep: 1,
      selectedRoom: null,
      selectedDate: null,
      selectedTimeSlot: null,
    }),
}))
