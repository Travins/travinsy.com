import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { EntryIcon } from "@/lib/entry-icons"
import { sectionPages } from "@/lib/source"
import {
  GridColumns,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"
import { ComponentThumbnail } from "./component-thumbnail"
import { SectionHeading } from "./section-heading"

export function ComponentGallery() {
  const pages = sectionPages("components").filter(
    (page) => page.slugs.length > 1,
  )
  // GridColumns 只负责一行的分栏，横向分隔交给 GridSection。
  const rows = Array.from({ length: Math.ceil(pages.length / 2) }, (_, index) =>
    pages.slice(index * 2, index * 2 + 2),
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
      {rows.map((row) => (
        <GridSection key={row[0].url}>
          <GridColumns>
            {row.map((page) => {
              const name = page.slugs.at(-1)!
              const titleId = `component-${name}-title`
              const descriptionId = `component-${name}-description`

              return (
                <article
                  key={page.url}
                  className="group relative min-w-0 p-4 sm:p-6"
                >
                  <ComponentThumbnail name={name} />
                  <div className="mt-6 flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-edge bg-muted/40 transition-colors group-hover:border-primary/50 group-hover:text-primary">
                        <EntryIcon name={name} className="size-5" strokeWidth={1.5} />
                      </span>
                      <div className="min-w-0">
                        <h2
                          id={titleId}
                          className="text-lg leading-6 font-medium tracking-tight"
                        >
                          {page.data.title}
                        </h2>
                        {page.data.titleEn ? (
                          <p
                            lang="en"
                            translate="no"
                            className="mt-0.5 truncate font-mono text-xs text-muted-foreground"
                          >
                            {page.data.titleEn}
                          </p>
                        ) : null}
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
                    className="absolute inset-0 z-10 transition-colors hover:bg-muted/10 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
                  />
                </article>
              )
            })}
          </GridColumns>
        </GridSection>
      ))}
    </main>
  )
}
