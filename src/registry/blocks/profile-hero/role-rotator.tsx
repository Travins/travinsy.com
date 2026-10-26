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
      {/* 所有标签叠在同一个 grid 单元里：隐形副本把宽度撑到最长那项，切换时暂停按钮不会左右跳 */}
      <span aria-hidden="true" className="grid min-w-0">
        {roles.map((role) => (
          <span key={role} className="invisible col-start-1 row-start-1">
            {role}
          </span>
        ))}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={index}
            className="col-start-1 row-start-1"
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
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring motion-reduce:hidden"
        >
          {/* 两个图标同一画布、同一尺寸、同为实心，切换时按钮外观不跳动 */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="size-3.5"
          >
            {paused ? (
              <path d="M7 5.6v12.8a1 1 0 0 0 1.5.86l10.8-6.4a1 1 0 0 0 0-1.72L8.5 4.74A1 1 0 0 0 7 5.6Z" />
            ) : (
              <>
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </>
            )}
          </svg>
        </button>
      ) : null}
    </div>
  )
}

export { RoleRotator }
