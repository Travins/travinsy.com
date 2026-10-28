import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { EntryTitle } from "@/components/home/entry-title"
import { LivePreview } from "@/components/home/live-preview"
import { getRegistryItem } from "@/components/docs/registry-items"

/** 首页「区块与模板」的四个入口；section 决定链接去 /blocks/ 还是 /templates/。 */
const SHOWCASE = [
  { section: "blocks", name: "settings-01" },
  { section: "blocks", name: "auth-01" },
  { section: "blocks", name: "agent-chat-01" },
  { section: "templates", name: "app-shell-01" },
] as const

const SECTION_LABEL = { blocks: "BLOCK", templates: "TEMPLATE" } as const

/**
 * 首页「区块与模板」：2×2 的缩小实时预览，整张卡片是进入文档的链接。
 * 单元格自带右、下边线，再用负外边距把最外一圈挤出裁剪区，避免和容器的线叠成双线。
 */
function EntryShowcase() {
  return (
    <div className="overflow-hidden">
      <ul className="-mr-px -mb-px grid grid-cols-1 md:grid-cols-2">
        {SHOWCASE.map(({ section, name }) => {
          const item = getRegistryItem(name)
          const titleId = `showcase-${name}`
          return (
            <li key={name} className="min-w-0 border-r border-b border-edge">
              <div
                data-slot="entry-showcase-card"
                className="group/card relative flex h-full min-w-0 flex-col"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out group-has-[a:focus-visible]/card:scale-x-100 group-has-[a:hover]/card:scale-x-100 motion-reduce:transition-none"
                />
                <LivePreview name={name} title={item.title} />
                <div className="relative flex items-start justify-between gap-3 border-t border-edge px-4 py-3 transition-colors group-has-[a:focus-visible]/card:bg-muted/30 group-has-[a:hover]/card:bg-muted/30 sm:px-5">
                  <h3
                    id={titleId}
                    className="text-sm font-medium tracking-tight group-has-[a:focus-visible]/card:text-primary group-has-[a:hover]/card:text-primary"
                  >
                    <EntryTitle
                      section={section}
                      name={name}
                      title={item.title}
                    />
                  </h3>
                  <span className="mt-0.5 flex shrink-0 items-center gap-2 text-muted-foreground">
                    <span className="font-mono text-[10px] tracking-[0.16em]">
                      {SECTION_LABEL[section]}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 transition-transform motion-safe:group-has-[a:hover]/card:-translate-y-0.5 motion-safe:group-has-[a:hover]/card:translate-x-0.5"
                    />
                  </span>
                </div>
                {/* 链接盖住整张卡片，包括上面的预览 */}
                <Link
                  href={`/${section}/${name}/`}
                  aria-labelledby={titleId}
                  className="absolute inset-0 z-20 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring"
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { EntryShowcase }
