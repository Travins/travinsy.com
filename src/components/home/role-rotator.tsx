"use client"

import { useState } from "react"

import { TextFlip } from "@/registry/ui/text-animate/text-animate"

/** 播放 / 暂停按钮的读屏名称 */
const LABELS = {
  pauseRoles: "暂停特性标签",
  playRoles: "播放特性标签",
} as const

/**
 * 特性标签轮换：用 TextFlip 每 3.2 秒切换一次，可暂停；系统开启「减少动态效果」时不自动轮换，也不显示暂停按钮。
 * TextFlip 自带读屏全文与宽度过渡；这里额外用隐形副本把占位宽度撑到最长那项，切换时暂停按钮不会左右跳。
 */
function RoleRotator({ roles }: { roles: readonly string[] }) {
  const [paused, setPaused] = useState(false)
  if (!roles.length) return null
  return (
    <div
      data-slot="role-rotator"
      data-paused={paused ? "" : undefined}
      className="flex min-h-7 items-center gap-3 font-mono text-sm text-muted-foreground"
    >
      <span aria-hidden="true" className="text-primary">
        ↳
      </span>
      <span className="grid min-w-0">
        {roles.map((role) => (
          <span
            key={role}
            aria-hidden="true"
            className="invisible col-start-1 row-start-1 px-1"
          >
            {role}
          </span>
        ))}
        <TextFlip
          words={[...roles]}
          paused={paused}
          interval={3200}
          variant="underline"
          className="col-start-1 row-start-1 justify-self-start"
        >
          {roles.join("、")}
        </TextFlip>
      </span>
      {roles.length > 1 ? (
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? LABELS.playRoles : LABELS.pauseRoles}
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
