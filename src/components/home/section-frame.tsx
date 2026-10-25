import { useId, type ComponentProps, type ReactNode } from "react"

import { cn } from "@/lib/utils"
import { GridSection } from "@/registry/ui/grid-layout/grid-layout"

/**
 * 首页章节：宽屏左侧是窄的编号栏（01 + 英文名），内容在右；窄屏编号移到标题上方。
 * 编号栏用一条竖线与内容隔开，像规格书里的章节边栏。
 */
function SectionFrame({
  index,
  name,
  title,
  action,
  children,
  className,
  ...props
}: Omit<ComponentProps<typeof GridSection>, "title"> & {
  /** 章节编号，如 `01` */
  index: string
  /** 编号下方的英文小标题，如 `FOCUS` */
  name: string
  title: ReactNode
  /** 标题行右侧的操作，如「全部文章」链接 */
  action?: ReactNode
}) {
  const titleId = useId()
  return (
    <GridSection
      data-slot="section-frame"
      aria-labelledby={titleId}
      className={cn("md:grid md:grid-cols-[9rem_minmax(0,1fr)]", className)}
      {...props}
    >
      <div className="px-4 pt-5 sm:px-6 md:border-r md:border-edge md:px-5 md:py-5">
        <div
          aria-hidden="true"
          className="flex items-baseline gap-2 font-mono md:sticky md:top-20 md:flex-col md:gap-1"
        >
          <span className="text-xs text-primary tabular-nums md:text-3xl md:font-light">
            {index}
          </span>
          <span className="text-[10px] tracking-[0.2em] text-muted-foreground">
            {name}
          </span>
        </div>
      </div>
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3 border-b border-edge px-4 py-4 sm:px-6">
          <h2 id={titleId} className="text-sm font-medium">
            {title}
          </h2>
          {action}
        </div>
        {children}
      </div>
    </GridSection>
  )
}

export { SectionFrame }
