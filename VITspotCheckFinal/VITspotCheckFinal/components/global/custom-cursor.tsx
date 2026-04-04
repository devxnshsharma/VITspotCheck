"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

type CursorState = "default" | "link" | "button" | "room-card" | "input" | "loading"

import { useAuthStore } from "@/lib/auth-store"
import { useUIStore } from "@/lib/store"

interface CursorTextInfo {
  text: string
  color: string
}

const STATUS_COLORS: Record<string, string> = {
  empty: "#34D399",
  occupied: "#FB923C",
  unverified: "#FBBF24",
  conflict: "#FB7185",
}

export function CustomCursor() {
  const cursorInnerRef = useRef<HTMLDivElement>(null)
  const cursorOuterRef = useRef<HTMLDivElement>(null)
  const cursorTextRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const cursorPosRef = useRef({ x: 0, y: 0 })
  const cursorPosOuterRef = useRef({ x: 0, y: 0 })
  const lagFactorRef = useRef(0.15)
  const animationRef = useRef<number | undefined>(undefined)
  const { isMenuOpen, toggleMenu } = useUIStore()
  
  const [state, setState] = useState<CursorState>("default")
  const [textInfo, setTextInfo] = useState<CursorTextInfo | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const showAuthModal = useAuthStore((state) => state.showAuthModal)

  // Detect touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
    }
    checkTouch()
    window.addEventListener("touchstart", () => setIsTouchDevice(true), { once: true })
    return () => {}
  }, [])

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  // Hover detection
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    const cursorTarget = target.closest("[data-cursor]") as HTMLElement | null
    
    if (cursorTarget) {
      const cursorType = cursorTarget.getAttribute("data-cursor") as CursorState
      setState(cursorType)
      
      if (cursorType === "room-card") {
        const status = cursorTarget.getAttribute("data-room-status") || "empty"
        setTextInfo({
          text: status.toUpperCase(),
          color: STATUS_COLORS[status] || STATUS_COLORS.empty,
        })
      } else if (cursorType === "button") {
        const buttonText = cursorTarget.getAttribute("data-cursor-text")
        if (buttonText) {
          setTextInfo({ text: buttonText, color: "#FB923C" })
        } else {
          setTextInfo(null)
        }
      } else if (cursorType === "input") {
        lagFactorRef.current = 1.0 // Immediate for typing precision
      } else {
        setTextInfo(null)
      }
    }
  }, [])

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    const cursorTarget = target.closest("[data-cursor]")
    
    if (cursorTarget) {
      setState("default")
      setTextInfo(null)
      lagFactorRef.current = 0.15
    }
  }, [])

  // Animation loop
  useEffect(() => {
    if (isTouchDevice) return

    const inner = cursorInnerRef.current
    const outer = cursorOuterRef.current
    const textEl = cursorTextRef.current
    
    if (!inner || !outer) return

    function animate() {
      // Lerp inner cursor (faster)
      cursorPosRef.current.x += (mouseRef.current.x - cursorPosRef.current.x) * lagFactorRef.current
      cursorPosRef.current.y += (mouseRef.current.y - cursorPosRef.current.y) * lagFactorRef.current
      
      // Lerp outer cursor (slower)
      cursorPosOuterRef.current.x += (mouseRef.current.x - cursorPosOuterRef.current.x) * 0.08
      cursorPosOuterRef.current.y += (mouseRef.current.y - cursorPosOuterRef.current.y) * 0.08

      if (inner) {
        inner.style.transform = `translate3d(${cursorPosRef.current.x}px, ${cursorPosRef.current.y}px, 0) translate(-50%, -50%)`
      }
      if (outer) {
        outer.style.transform = `translate3d(${cursorPosOuterRef.current.x}px, ${cursorPosOuterRef.current.y}px, 0) translate(-50%, -50%)`
      }
      if (textEl) {
        textEl.style.transform = `translate3d(${cursorPosRef.current.x}px, ${cursorPosRef.current.y}px, 0) translate(-50%, -50%)`
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseover", handleMouseOver)
    document.addEventListener("mouseout", handleMouseOut)
    
    // Add cursor-hidden class to body if auth modal is NOT showing
    if (!showAuthModal) {
      document.body.classList.add("cursor-hidden")
    } else {
      document.body.classList.remove("cursor-hidden")
    }
    
    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mouseout", handleMouseOut)
      document.body.classList.remove("cursor-hidden")
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isTouchDevice, handleMouseMove, handleMouseOver, handleMouseOut, showAuthModal])

  if (isTouchDevice || showAuthModal) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Outer ring */}
      <div
        ref={cursorOuterRef}
        className={cn(
          "absolute rounded-full border-2 transition-all duration-300 ease-out",
          state === "default" && "w-14 h-14 border-primary/50 opacity-0",
          state === "link" && "w-14 h-14 border-accent opacity-100",
          state === "button" && "w-12 h-12 border-accent opacity-100",
          state === "room-card" && "w-0 h-0 opacity-0",
          state === "input" && "w-0 h-0 opacity-0",
          state === "loading" && "w-8 h-8 border-primary opacity-100 animate-spin"
        )}
        style={{ willChange: "transform, width, height, opacity" }}
      />
      
      {/* Inner dot */}
      <div
        ref={cursorInnerRef}
        className={cn(
          "absolute rounded-full transition-all duration-200 ease-out",
          state === "default" && "w-3 h-3 bg-primary shadow-[0_0_12px_rgba(6,182,212,0.6)]",
          state === "link" && "w-0 h-0",
          state === "button" && "w-12 h-12 bg-accent shadow-[0_0_24px_rgba(251,146,60,0.8)]",
          state === "room-card" && "w-20 h-20 bg-black/75 backdrop-blur-sm",
          state === "input" && "w-0.5 h-5 rounded-sm bg-primary"
        )}
        style={{ willChange: "transform, width, height, background" }}
      />
      
      {/* Text overlay for room cards */}
      {textInfo && (state === "room-card" || state === "button") && (
        <div
          ref={cursorTextRef}
          className={cn(
            "absolute flex items-center justify-center text-xs font-bold tracking-widest transition-opacity duration-200",
            state === "room-card" ? "w-20 h-20" : "w-12 h-12"
          )}
          style={{ 
            color: textInfo.color,
            willChange: "transform",
            opacity: textInfo ? 1 : 0
          }}
        >
          {textInfo.text}
        </div>
      )}
    </div>
  )
}
