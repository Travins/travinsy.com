import Link from "next/link"

import { sectionPages } from "@/lib/source"
import {
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"

/** 站点路由统一带末尾斜杠，fumadocs 生成的 page.url 不一定带。 */
const withSlash = (url: string) => (url.endsWith("/") ? url : `${url}/`)

/** 两位序号：列表里像一条编号，而不是第几个数字。 */
const ordinal = (index: number) => String(index + 1).padStart(2, "0")

/**
 * Agent 分区首页：上方是分区标题，下方是指南列表。
 * 标题与简介取自 content/docs/agents/index.mdx 的 frontmatter，
 * 列表取自同目录其余文档，新增一篇 MDX 就会自动出现在这里。
 */
export function AgentsLanding() {
  const pages = sectionPages("agents")
  const home = pages.find((page) => page.slugs.length === 1)
  const guides = pages.filter((page) => page.slugs.length > 1)
  return (
    <main id="main-content">
      <GridSection className="px-4 py-10 sm:px-6 sm:py-14">
        <p className="mb-4 font-mono text-xs text-muted-foreground">
          AGENTS / {guides.length}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {home?.data.title ?? "Agent"}
        </h1>
        {home?.data.description ? (
          <p className="mt-4 max-w-xl leading-7 text-pretty text-muted-foreground">
            {home.data.description}
          </p>
        ) : null}
      </GridSection>
      <GridSeparator />
      <GridSection aria-labelledby="agents-guides-title">
        <div className="flex items-center justify-between gap-3 border-b border-edge px-4 py-4 sm:px-6">
          <h2 id="agents-guides-title" className="text-sm font-medium">
            指南
          </h2>
          <span
            aria-hidden="true"
            className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground"
          >
            GUIDES
          </span>
        </div>
        {guides.length > 0 ? (
          <ul className="divide-y divide-edge">
            {guides.map((guide, index) => (
              <li key={guide.url} className="min-w-0">
                <Link
                  href={withSlash(guide.url)}
                  className="group grid min-w-0 gap-4 px-4 py-8 transition-colors hover:bg-muted/30 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-8 sm:px-6 sm:py-10"
                >
                  <span className="flex items-center gap-2 font-mono sm:flex-col sm:items-start sm:gap-1.5 sm:pt-0.5">
                    <span className="text-xs text-primary tabular-nums">
                      {ordinal(index)}
                    </span>
                    <span className="text-[10px] tracking-[0.2em] text-muted-foreground">
                      指南
                    </span>
                  </span>
                  <div className="flex min-w-0 flex-col gap-3">
                    <h3 className="text-lg font-medium tracking-tight text-balance transition-colors group-hover:text-primary">
                      {guide.data.title}
                    </h3>
                    <p className="max-w-xl text-sm leading-7 text-pretty text-muted-foreground">
                      {guide.data.description}
                    </p>
                    <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      阅读指南
                      <span
                        aria-hidden="true"
                        className="transition-transform motion-safe:group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-10 text-sm text-muted-foreground sm:px-6">
            指南正在整理中。
          </p>
        )}
      </GridSection>
    </main>
  )
}
