import { useId, type ReactNode } from "react"

import { GridSection } from "@/registry/ui/grid-layout/grid-layout"

import type { ProfileHeroLabels } from "./config"
import { RoleRotator } from "./role-rotator"

/**
 * 个人封面：斜纹横幅 + 头像 + 名字 + 简介 + 职业标签轮播。放在 GridContainer 内使用。
 * 名字、简介、职业标签都是页面数据；按钮文案通过 labels 覆盖。
 */
function ProfileHero({
  name,
  bio,
  roles = [],
  initials,
  avatar,
  tagline = "DESIGN · CODE · REPEAT",
  labels,
  className,
}: {
  /** 显示的名字，会作为页面的 h1 */
  name: string
  /** 一两句话的自我介绍 */
  bio: string
  /** 职业标签，会依次轮播 */
  roles?: readonly string[]
  /** 未传 avatar 时，头像位置显示的缩写（1–2 个字符） */
  initials?: string
  /** 自定义头像节点，传入后替换缩写方块 */
  avatar?: ReactNode
  /** 横幅中间的装饰文字，设为空字符串可隐藏 */
  tagline?: string
  /** 覆盖默认文案，见 config.ts 的 DEFAULT_LABELS */
  labels?: Partial<ProfileHeroLabels>
  className?: string
}) {
  const titleId = useId()
  return (
    <GridSection
      data-slot="profile-hero"
      aria-labelledby={titleId}
      className={className}
    >
      <div
        data-slot="profile-hero-banner"
        aria-hidden="true"
        className="relative flex h-32 items-center justify-center overflow-hidden bg-muted/20 sm:h-44"
      >
        <div className="absolute inset-0 bg-hatch opacity-40" />
        {tagline ? (
          <div className="relative flex items-center gap-5 font-mono text-muted-foreground/70">
            <span className="text-4xl font-extralight sm:text-5xl">{"{ "}</span>
            <span className="text-xs tracking-[0.35em]">{tagline}</span>
            <span className="text-4xl font-extralight sm:text-5xl">{" }"}</span>
          </div>
        ) : null}
      </div>
      <div className="relative flex flex-col gap-5 px-4 pb-7 sm:px-6">
        {avatar ?? (
          <div
            aria-hidden="true"
            className="relative -mt-10 flex size-20 items-center justify-center rounded-2xl border border-edge bg-background font-mono text-3xl font-medium tracking-tighter ring-4 ring-background"
          >
            {initials ?? name.slice(0, 1)}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <h1
            id={titleId}
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
            translate="no"
          >
            {name}
            <span className="text-primary">.</span>
          </h1>
          <p className="text-sm leading-7 text-pretty text-muted-foreground sm:text-base">
            {bio}
          </p>
          <RoleRotator roles={roles} labels={labels} />
        </div>
      </div>
    </GridSection>
  )
}

export { ProfileHero }
