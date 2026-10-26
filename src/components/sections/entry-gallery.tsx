import { Fragment } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { EntryIcon } from "@/lib/entry-icons"
import { entryTitleEn } from "@/lib/source"
import { BlockViewer } from "@/components/docs/block-viewer"
import {
  entrySections,
  sectionItems,
  type EntrySection,
} from "@/components/docs/registry-items"
import {
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"
import { SectionHeading } from "./section-heading"

const descriptions: Record<EntrySection, string> = {
  blocks:
    "可直接安装的完整区块。切换设备宽度查看布局，或打开代码，把需要的部分带进你的项目。",
  templates:
    "从完整页面开始搭建。打开预览浏览布局与交互，再通过文档安装和调整。",
}

const linkClassName =
  "inline-flex min-h-11 items-center gap-1.5 text-sm underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"

export function EntryGallery({ section }: { section: EntrySection }) {
  const items = sectionItems(section)
  const { label, title } = entrySections[section]

  return (
    <main id="main-content" className="min-w-0">
      <SectionHeading
        label={label}
        count={items.length}
        title={title}
        description={descriptions[section]}
      />
      <GridSeparator />
      {items.map((item, index) => (
        <Fragment key={item.name}>
          {index > 0 ? <GridSeparator /> : null}
          <GridSection className="min-w-0 px-4 py-6 sm:px-6 sm:py-8">
            {section === "blocks" ? (
              <BlockViewer name={item.name} />
            ) : (
              <div
                aria-hidden="true"
                inert
                className="pointer-events-none relative aspect-[16/10] overflow-hidden border border-edge bg-muted/20"
              >
                {/* 同步放大宽高再等比缩小，让窄屏也能看到完整的桌面构图。 */}
                <iframe
                  src={`/view/${item.name}/`}
                  title={`${item.title} 缩略预览`}
                  loading="lazy"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="absolute top-0 left-0 h-[400%] w-[400%] origin-top-left scale-25 border-0 bg-background sm:h-[200%] sm:w-[200%] sm:scale-50 lg:h-[133.333333%] lg:w-[133.333333%] lg:scale-75"
                />
              </div>
            )}
            <div className="mt-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
              <div className="max-w-2xl min-w-0">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-edge bg-muted/40">
                    <EntryIcon
                      name={item.name}
                      className="size-5"
                      strokeWidth={1.5}
                    />
                  </span>
                  <div className="min-w-0">
                    {/* 英文名为主标题（更直观），中文名小一号放在下一行 */}
                    <h2 className="text-xl leading-6 font-medium tracking-tight">
                      {entryTitleEn(section, item.name) ? (
                        <>
                          <span lang="en" translate="no">
                            {entryTitleEn(section, item.name)}
                          </span>
                          <span className="mt-0.5 block text-[13px] leading-5 font-normal tracking-normal text-muted-foreground">
                            {item.title}
                          </span>
                        </>
                      ) : (
                        item.title
                      )}
                    </h2>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-1">
                {section === "templates" ? (
                  <a
                    href={`/view/${item.name}/`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`预览${item.title}（在新窗口中打开）`}
                    className={linkClassName}
                  >
                    预览
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                ) : null}
                <Link
                  href={`/${section}/${item.name}/`}
                  aria-label={`查看${item.title}文档`}
                  className={linkClassName}
                >
                  查看文档
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </div>
          </GridSection>
        </Fragment>
      ))}
    </main>
  )
}
