"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation, useParams } from "react-router-dom"
import { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
  transitionColor?: string
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as any,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
}

const overlayVariants = {
  initial: {
    scaleY: 0,
    originY: 0,
  },
  enter: {
    scaleY: [0, 1, 1, 0],
    originY: [0, 0, 1, 1],
    transition: {
      duration: 1.2,
      ease: [0.76, 0, 0.24, 1] as any,
      times: [0, 0.5, 0.51, 1],
    },
  },
}

export function PageTransition({ children, transitionColor = "#06B6D4" }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
      >
        {/* Transition color overlay */}
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          style={{ backgroundColor: transitionColor }}
          initial="initial"
          animate="enter"
          variants={overlayVariants}
        />
        
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Staggered content wrapper for individual elements
export const staggerChildVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: [0.16, 1, 0.3, 1] as any 
    } 
  },
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerChildVariants} className={className}>
      {children}
    </motion.div>
  )
}
