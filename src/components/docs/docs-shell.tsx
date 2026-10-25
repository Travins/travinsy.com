import Link from "next/link"
import type { ReactNode } from "react"
import type { TOCItemType } from "fumadocs-core/toc"
import { GridSection } from "@/registry/ui/grid-layout/grid-layout"
import {
  docsNeighbours,
  sectionHome,
  withSlash,
  type NavSectionId,
} from "./docs-nav"
import { DocsMobileNav } from "./docs-mobile-nav"
import { DocsSidebarNav } from "./docs-sidebar"
import { DocsToc } from "./docs-toc"
import { PageActions } from "./page-actions"

type DocsShellProps = {
  section: NavSectionId
  url: string
  title: string
  description: string
  /** 概览页：没有「复制页面」、上下页和返回链接 */
  overview?: boolean
  /** 本页 Markdown 原文，供「复制页面」使用 */
  markdown?: string
  links?: Record<string, string>
  toc?: TOCItemType[]
  children: ReactNode
}

const sectionNoun: Record<NavSectionId, string> = {
  docs: "文档",
  components: "组件",
  blocks: "区块",
  templates: "模板",
  agents: "文档",
}

/** 所有文档类页面共用的外壳：统一侧栏、页头动作条、上一页 / 下一页、右侧目录。 */
export function DocsShell({
  section,
  url: rawUrl,
  title,
  description,
  overview = false,
  markdown,
  links,
  toc = [],
  children,
}: DocsShellProps) {
  const url = withSlash(rawUrl)
  const home = sectionHome[section]
  const { previous, next } = overview ? {} : docsNeighbours(url)
  return (
    <GridSection className="docs-layout">
      <DocsMobileNav>
        <DocsSidebarNav current={url} />
      </DocsMobileNav>
      <aside className="docs-sidebar">
        <DocsSidebarNav current={url} />
      </aside>
      <main id="main-content" className="docs-main">
        <PageActions
          back={url === home.url ? undefined : home}
          markdown={overview ? undefined : markdown}
          url={url}
          noun={sectionNoun[section]}
          previous={previous}
          next={next}
        />
        <header className="docs-header">
          <h1>{title}</h1>
          <p>{description}</p>
          {links && (
            <div className="mt-4 flex flex-wrap gap-4">
              {Object.entries(links).map(([label, href]) => (
                <a
                  key={label}
                  className="text-[13px] underline underline-offset-4"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {label} ↗
                </a>
              ))}
            </div>
          )}
        </header>
        {children}
        {(previous || next) && (
          <nav
            aria-label="相邻文档"
            className="mt-14 grid grid-cols-2 gap-4 border-t border-edge pt-6"
          >
            {previous ? (
              <Link href={previous.url} className="text-sm">
                <span className="mb-1.5 block text-xs text-muted-foreground">
                  ← 上一页
                </span>
                {previous.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={next.url} className="text-right text-sm">
                <span className="mb-1.5 block text-xs text-muted-foreground">
                  下一页 →
                </span>
                {next.title}
              </Link>
            )}
          </nav>
        )}
      </main>
      <aside className="docs-toc">
        <DocsToc items={toc} />
      </aside>
    </GridSection>
  )
}

/** 概览页的条目卡片 */
export function DocsCard({
  href,
  eyebrow,
  title,
  description,
}: {
  href: string
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="group border border-edge p-5 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
    >
      <p className="mb-5 font-mono text-xs text-muted-foreground">{eyebrow}</p>
      <h2 className="text-base font-medium">
        {title}{" "}
        <span
          aria-hidden
          className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
        >
          ↗
        </span>
      </h2>
      <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
        {description}
      </p>
    </Link>
  )
}
