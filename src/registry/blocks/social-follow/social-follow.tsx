import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { FollowMe } from "@/registry/ui/follow-me/follow-me"
import { GridSection } from "@/registry/ui/grid-layout/grid-layout"
import { IconLink } from "@/registry/ui/icon-link/icon-link"

export type SocialLink = {
  /** 链接名称，同时作为读屏名称与悬停提示 */
  name: string
  href: string
  /** 图标节点，建议 strokeWidth={1.5} 的线性图标 */
  icon: ReactNode
}

/** 社交方块一行 + 容器外侧手写体 follow me 装饰。放在 GridContainer 内使用。 */
export function SocialFollow({
  socials,
  note = "在别处，也在这里",
  className,
}: {
  socials: readonly SocialLink[]
  /** 右侧的小字说明，设为空字符串可隐藏 */
  note?: string
  className?: string
}) {
  return (
    <GridSection
      aria-label="社交链接"
      className={cn("px-4 py-4 sm:px-6", className)}
    >
      <FollowMe />
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {socials.map((social) => (
            <IconLink
              key={social.name}
              href={social.href}
              label={social.name}
              target="_blank"
              rel="noreferrer noopener"
            >
              {social.icon}
            </IconLink>
          ))}
        </div>
        {note ? (
          <span className="font-mono text-[10px] text-muted-foreground">
            {note} <span aria-hidden="true">↗</span>
          </span>
        ) : null}
      </div>
    </GridSection>
  )
}
