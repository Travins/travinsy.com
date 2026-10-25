"use client"

import { useEffect, useState } from "react"
import type { TOCItemType } from "fumadocs-core/toc"
import { cn } from "@/lib/utils"

const idOf = (url: string) => decodeURIComponent(url.replace(/^#/, ""))

/** 右侧目录：滚动时高亮当前所在小节。 */
export function DocsToc({ items }: { items: TOCItemType[] }) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(idOf(item.url)))
      .filter((node): node is HTMLElement => node !== null)
    if (headings.length === 0) return
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        const first = headings.find((node) => visible.has(node.id))
        if (first) setActive(first.id)
      },
      { rootMargin: "-80px 0px -65% 0px" },
    )
    headings.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null
  return (
    <nav aria-label="本页目录">
      <p className="mb-3 text-xs font-medium">本页目录</p>
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
