"use client"

import * as React from "react"
import { animate, motion, useMotionValue, useTransform } from "motion/react"

function CardStackLayer({
  children,
  level,
  visible,
  depth,
  offset,
  scale,
  reduced,
  draggable,
  label,
  roleDescription,
  advance,
}: {
  children: React.ReactNode
  level: number
  visible: boolean
  depth: number
  offset: number
  scale: number
  reduced: boolean
  draggable: boolean
  label: string
  roleDescription: string
  advance: () => void
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-250, 250], reduced ? [0, 0] : [-12, 12])
  const busy = React.useRef(false)
  const top = level === 0
  const position = Math.min(level, depth - 1)
  return (
    <motion.div
      data-slot="card-stack-layer"
      data-active={top}
      data-draggable={draggable}
      role="group"
      aria-roledescription={roleDescription}
      aria-label={label}
      aria-hidden={!top}
      inert={!top}
      className="col-start-1 row-start-1 min-w-0 origin-bottom data-[active=false]:pointer-events-none data-[active=true]:pointer-events-auto data-[draggable=true]:select-none"
      style={{
        x,
        rotate,
        zIndex: top ? depth + 1 : depth - position,
        touchAction: draggable ? "pan-y" : undefined,
      }}
      initial={false}
      animate={{
        y: reduced ? 0 : position * offset,
        scale: reduced ? 1 : 1 - position * scale,
        opacity: visible && (!reduced || top) ? 1 : 0,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      drag={draggable && top ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      dragMomentum={false}
      onDragEnd={async (_, info) => {
        if (busy.current) return
        if (Math.abs(info.offset.x) < 80) {
          animate(
            x,
            0,
            reduced
              ? { duration: 0 }
              : { type: "spring", stiffness: 400, damping: 30 },
          )
          return
        }
        busy.current = true
        if (!reduced)
          await animate(
            x,
            Math.sign(info.offset.x) * Math.max(600, window.innerWidth),
            { duration: 0.2 },
          )
        advance()
        x.set(0)
        busy.current = false
      }}
    >
      {children}
    </motion.div>
  )
}

export { CardStackLayer }
