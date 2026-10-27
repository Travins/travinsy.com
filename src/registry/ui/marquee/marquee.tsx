"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const MARQUEE_CSS = `
@keyframes tv-marquee-x { to { transform: translateX(-100%) } }
@keyframes tv-marquee-y { to { transform: translateY(-100%) } }
[data-slot="marquee"] { display:flex; overflow:hidden; container-type:inline-size; rotate:var(--marquee-rotate) }
[data-slot="marquee-group"] { display:flex; flex:none; align-items:center; justify-content:space-around; gap:var(--marquee-gap); min-width:100%; padding-inline-end:var(--marquee-gap); animation:tv-marquee-x var(--marquee-duration,30s) linear infinite; animation-direction:var(--marquee-reverse) }
[data-slot="marquee"][data-vertical="true"] { flex-direction:column }
[data-vertical="true"] > [data-slot="marquee-group"] { flex-direction:column; min-width:0; width:100%; min-height:100%; padding-inline-end:0; padding-block-end:var(--marquee-gap); animation-name:tv-marquee-y }
[data-slot="marquee"][data-fade="true"] { mask-image:linear-gradient(to right,transparent,var(--foreground) 8%,var(--foreground) 92%,transparent) }
[data-slot="marquee"][data-vertical="true"][data-fade="true"] { mask-image:linear-gradient(to bottom,transparent,var(--foreground) 8%,var(--foreground) 92%,transparent) }
[data-slot="marquee"]:focus-within > [data-slot="marquee-group"], [data-slot="marquee"][data-paused="true"] > [data-slot="marquee-group"], [data-slot="marquee"][data-hover="true"]:hover > [data-slot="marquee-group"] { animation-play-state:paused }
@media(prefers-reduced-motion:reduce) {
 [data-slot="marquee"] { overflow:auto; mask-image:none!important; rotate:none }
 [data-slot="marquee-group"] { animation:none!important; justify-content:flex-start }
 [data-slot="marquee-group"][aria-hidden="true"] { display:none }
}`

type MarqueeDirection = "left" | "right" | "up" | "down"
type MarqueeProps = React.ComponentProps<"div"> & {
  direction?: MarqueeDirection
  /** 每秒移动的像素数；脚本只测量，不驱动动画。 */
  speed?: number
  pauseOnHover?: boolean
  paused?: boolean
  reverse?: boolean
  /** 总内容组数，至少 2 组。 */
  repeat?: number
  fade?: boolean
  /** 项目之间的像素间距。 */
  gap?: number
  /** 整条带子的旋转角度。 */
  rotate?: number
  label?: string
}

function Marquee({
  direction = "left",
  speed = 48,
  pauseOnHover = true,
  paused = false,
  reverse = false,
  repeat = 3,
  fade = true,
  gap = 32,
  rotate = 0,
  label = "跑马灯",
  children,
  className,
  style,
  ...props
}: MarqueeProps) {
  const root = React.useRef<HTMLDivElement>(null)
  const group = React.useRef<HTMLDivElement>(null)
  const vertical = direction === "up" || direction === "down"
  const backwards = (direction === "right" || direction === "down") !== reverse
  const count = Math.min(20, Math.max(2, Math.floor(repeat) || 2))

  React.useEffect(() => {
    const element = group.current
    const viewport = root.current
    if (!element || !viewport) return
    function measure() {
      if (!element || !viewport) return
      const distance = vertical ? element.offsetHeight : element.offsetWidth
      viewport.style.setProperty(
        "--marquee-duration",
        `${distance / Math.max(1, speed)}s`,
      )
    }
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    observer.observe(viewport)
    measure()
    return () => observer.disconnect()
  }, [speed, vertical])

  return (
    <div
      {...props}
      ref={root}
      data-slot="marquee"
      data-vertical={vertical}
      data-fade={fade}
      data-hover={pauseOnHover}
      data-paused={paused}
      role="region"
      aria-label={label}
      tabIndex={0}
      className={cn(
        "relative w-full min-w-0 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
      style={
        {
          "--marquee-gap": `${Math.max(0, gap)}px`,
          "--marquee-rotate": `${rotate}deg`,
          "--marquee-reverse": backwards ? "reverse" : "normal",
          ...style,
        } as React.CSSProperties
      }
    >
      <style href="travinsy-marquee" precedence="default">
        {MARQUEE_CSS}
      </style>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          ref={index === 0 ? group : undefined}
          data-slot="marquee-group"
          aria-hidden={index > 0 ? true : undefined}
          inert={index > 0 ? true : undefined}
        >
          {children}
        </div>
      ))}
    </div>
  )
}

function MarqueeItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="marquee-item"
      className={cn(
        "flex shrink-0 items-center gap-3 whitespace-nowrap",
        className,
      )}
      {...props}
    />
  )
}

export { Marquee, MarqueeItem }
export type { MarqueeProps, MarqueeDirection }
