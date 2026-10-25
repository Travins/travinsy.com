"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"

import { resolveLabels, type ProfileHeroLabels } from "./config"

/** 职业标签轮播：每 3.2 秒切换一次，可暂停；系统开启「减少动态效果」时不自动轮播。 */
function RoleRotator({
  roles,
  labels,
}: {
  roles: readonly string[]
  labels?: Partial<ProfileHeroLabels>
}) {
  const text = resolveLabels(labels)
  const reducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (reducedMotion || paused || roles.length < 2) return
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % roles.length),
      3200,
    )
    return () => window.clearInterval(timer)
  }, [paused, reducedMotion, roles.length])
  if (!roles.length) return null
  return (
    <div
      data-slot="profile-hero-role-rotator"
      data-paused={paused ? "" : undefined}
      className="flex min-h-7 items-center gap-3 font-mono text-sm text-muted-foreground"
    >
      <span aria-hidden="true" className="text-primary">
        ↳
      </span>
      {/* 读屏一次性读出全部标签，视觉上的轮播对读屏隐藏 */}
      <span className="sr-only">{roles.join("、")}</span>
      <span aria-hidden="true" className="min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={index}
            className="inline-block"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -5 }}
            transition={{ duration: 0.18 }}
          >
            {roles[index]}
          </motion.span>
        </AnimatePresence>
      </span>
      {roles.length > 1 ? (
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? text.playRoles : text.pauseRoles}
          aria-pressed={paused}
          className="inline-flex size-7 items-center justify-center rounded text-xs text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring motion-reduce:hidden"
        >
          <span aria-hidden="true">{paused ? "▶" : "❚❚"}</span>
        </button>
      ) : null}
    </div>
  )
}

export { RoleRotator }
