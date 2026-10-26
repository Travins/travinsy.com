import type { ElementType } from "react"

import { cn } from "@/lib/utils"

/**
 * 文章摘要：标题 + 简介 + 标签。博客列表与首页「最新文章」共用，保证两处排版一致。
 * 标题层级由调用方按所在位置指定（列表页 h2，首页 h3）。
 */
export function PostEntry({
  title,
  description,
  tags,
  as: Heading = "h3",
  large = false,
  className,
}: {
  title: string
  description: string
  tags?: string[]
  as?: ElementType
  /** 列表页用大一号的标题 */
  large?: boolean
  className?: string
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <Heading
        className={cn(
          "font-medium tracking-tight text-balance transition-colors group-hover:text-primary",
          large ? "text-xl sm:text-2xl" : "text-base",
        )}
      >
        {title}
      </Heading>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-pretty text-muted-foreground">
        {description}
      </p>
      {tags && tags.length > 0 && (
        <ul
          aria-label="标签"
          className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground"
        >
          {tags.map((tag) => (
            <li key={tag}>#{tag}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
