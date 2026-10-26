"use client"

import { useEffect, useState } from "react"
import type { TOCItemType } from "fumadocs-core/toc"
import { cn } from "@/lib/utils"

const idOf = (url: string) => decodeURIComponent(url.replace(/^#/, ""))

/** 右侧目录：滚动时高亮当前所在小节。 */
export function DocsToc({
  items,
  title = "本页目录",
}: {
  items: TOCItemType[]
  title?: string
}) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(idOf(item.url)))
      .filter((node): node is HTMLElement => node !== null)
    if (headings.length === 0) return
    // 当前小节 = 顶边已经越过页头下方参考线的最后一个标题；小节很长时高亮不会丢失，滚到底时落在最后一节
    let frame = 0
    const update = () => {
      frame = 0
      const line = 120
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      let current: HTMLElement | null = null
      for (const node of headings) {
        if (node.getBoundingClientRect().top <= line) current = node
      }
      setActive((atBottom ? headings[headings.length - 1] : current)?.id ?? null)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [items])

  if (items.length === 0) return null
  return (
    <nav aria-label={title}>
      <p className="mb-3 text-xs font-medium">{title}</p>
      <ul className="flex flex-col">
        {items.map((item) => {
          const current = active === idOf(item.url)
          return (
            <li
              key={item.url}
              style={{
                paddingInlineStart: `${Math.max(0, item.depth - 2) * 12}px`,
              }}
            >
              <a
                href={item.url}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "block py-1 text-[13px] leading-5 text-muted-foreground transition-colors hover:text-foreground",
                  current && "font-medium text-foreground",
                )}
              >
                {item.title}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
