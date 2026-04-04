"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface UseScrollTriggerOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useScrollTrigger(
  options: UseScrollTriggerOptions = {}
) {
  const { threshold = 0.2, rootMargin = "0px", triggerOnce = true } = options
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    if (triggerOnce && hasTriggered) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setHasTriggered(true)
          if (triggerOnce) {
            observer.unobserve(entry.target)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce, hasTriggered])

  return { ref: elementRef, isVisible }
}

// Hook for tracking section colors for background morphing
export function useSectionObserver(
  sectionColors: { id: string; color: string; threshold?: number }[],
  onColorChange: (color: string) => void
) {
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sectionColors.forEach(({ id, color, threshold = 0.3 }) => {
      const element = document.getElementById(id)
      if (!element) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            onColorChange(color)
          }
        },
        { threshold }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [sectionColors, onColorChange])
}

// Hook for smooth momentum-based scrolling progress
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const lastScrollRef = useRef(0)

  useEffect(() => {
    let rafId: number
    let lastTime = performance.now()

    function update() {
      const currentScroll = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = maxScroll > 0 ? currentScroll / maxScroll : 0
      
      const now = performance.now()
      const deltaTime = now - lastTime
      const currentVelocity = (currentScroll - lastScrollRef.current) / deltaTime
      
      setProgress(currentProgress)
      setVelocity(currentVelocity)
      
      lastScrollRef.current = currentScroll
      lastTime = now
      
      rafId = requestAnimationFrame(update)
    }

    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return { progress, velocity }
}

// Parallax hook
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let rafId: number

    function update() {
      const element = ref.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const distanceFromCenter = elementCenter - windowHeight / 2
      
      setOffset(distanceFromCenter * speed * -0.1)
      rafId = requestAnimationFrame(update)
    }

    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [speed])

  return { ref, offset }
}
