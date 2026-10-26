import { Fragment } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { EntryIcon } from "@/lib/entry-icons"
import { sectionPages } from "@/lib/source"
import {
  GridColumns,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"
import { groupEntries } from "@/components/docs/docs-groups"
import { ComponentThumbnail } from "./component-thumbnail"
import { SectionHeading } from "./section-heading"

export function ComponentGallery() {
  const pages = sectionPages("components").filter(
    (page) => page.slugs.length > 1,
  )
  // 分组与侧栏共用 docs-groups.ts 的分组表；没有分组小标题时保持原样。
  const groups = groupEntries("components", pages, (page) => page.data.group)
  const titled = groups.some((group) => group.title)
  const CardTitle = titled ? "h3" : "h2"
  // GridColumns 只负责一行的分栏，横向分隔交给 GridSection。
  const rowsOf = (items: typeof pages) =>
    Array.from({ length: Math.ceil(items.length / 2) }, (_, index) =>
      items.slice(index * 2, index * 2 + 2),
    )

  return (
    <main id="main-content" className="min-w-0">
      <SectionHeading
        label="COMPONENTS"
        count={pages.length}
        title="组件"
        description="从线条、留白与排版开始，构建属于自己的界面。源码开放，复制即用。"
      />
      <GridSeparator />
      {groups.map((group) => (
        <Fragment key={group.id}>
          {group.title ? (
            <GridSection
              aria-labelledby={`component-group-${group.id}`}
              className="flex items-center gap-3 px-4 py-2.5 font-mono text-xs sm:px-6"
            >
              <h2 id={`component-group-${group.id}`} className="uppercase">
                <span lang="en" translate="no">
                  {group.titleEn}
                </span>
                <span className="text-muted-foreground normal-case">
                  {" "}
                  / {group.title}
                </span>
              </h2>
              <span aria-hidden="true" className="h-px flex-1 bg-edge" />
              <span aria-hidden="true" className="text-muted-foreground">
                {String(group.items.length).padStart(2, "0")}
              </span>
            </GridSection>
          ) : null}
          {rowsOf(group.items).map((row) => (
            <GridSection key={row[0].url}>
              <GridColumns>
                {row.map((page) => {
                  const name = page.slugs.at(-1)!
                  const titleId = `component-${name}-title`
                  const descriptionId = `component-${name}-description`

                  return (
                    <article key={page.url} className="min-w-0 p-4 sm:p-6">
                      <ComponentThumbnail
                        name={name}
                        label={`${page.data.title}演示`}
                      />
                      {/* 只有标题区是链接：上方的演示可以直接操作，不会误触跳转 */}
                      <div className="group relative">
                        <div className="mt-6 flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-edge bg-muted/40 transition-colors group-hover:border-primary/50 group-hover:text-primary">
                              <EntryIcon
                                name={name}
                                className="size-5"
                                strokeWidth={1.5}
                              />
                            </span>
                            <div className="min-w-0">
                              {/* 英文名为主标题（更直观），中文名小一号放在下一行 */}
                              <CardTitle
                                id={titleId}
                                className="text-lg leading-6 font-medium tracking-tight"
                              >
                                {page.data.titleEn ? (
                                  <>
                                    <span lang="en" translate="no">
                                      {page.data.titleEn}
                                    </span>
                                    <span className="mt-0.5 block truncate text-[13px] leading-5 font-normal tracking-normal text-muted-foreground">
                                      {page.data.title}
                                    </span>
                                  </>
                                ) : (
                                  page.data.title
                                )}
                              </CardTitle>
                            </div>
                          </div>
                          <ArrowUpRight
                            aria-hidden="true"
                            className="mt-1 size-4 shrink-0 text-muted-foreground group-hover:text-foreground"
                          />
                        </div>
                        <p
                          id={descriptionId}
                          className="mt-2 text-sm leading-7 text-muted-foreground"
                        >
                          {page.data.description}
                        </p>
                        <Link
                          href={page.url}
                          aria-labelledby={titleId}
                          aria-describedby={descriptionId}
                          className="absolute -inset-x-2 -top-4 -bottom-2 z-10 rounded-lg transition-colors hover:bg-muted/30 focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transition-none"
                        />
                      </div>
                    </article>
                  )
                })}
              </GridColumns>
            </GridSection>
          ))}
        </Fragment>
      ))}
    </main>
  )
}
