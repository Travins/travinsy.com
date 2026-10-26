import Link from "next/link"
import { EntryIcon } from "@/lib/entry-icons"
import { sectionNav, sectionHome, type NavSectionId } from "./docs-nav"

const pad = (n: number) => String(n).padStart(2, "0")

/**
 * 当前分区的侧栏，做成「索引表」：顶部是英文分区标签 + 条目计数，下挂刻度尺；
 * 每个条目通栏一行，左侧编号栏，行间虚线分隔。选中项的编号栏填斜纹并带主色竖线，悬停填点阵。
 * 样式见 src/styles/docs.css（.docs-nav-*）。
 */
export function DocsSidebarNav({
  current,
  section,
}: {
  current: string
  section: NavSectionId
}) {
  return (
    <nav aria-label={`${sectionHome[section].title}导航`}>
      {sectionNav(section).map((group) => (
        <div key={group.id} className="docs-nav-group">
          <p className="docs-nav-head">
            <span className="docs-nav-eyebrow">
              <span lang="en" translate="no">
                {group.titleEn}
              </span>
              <span className="docs-nav-eyebrow-zh"> / {group.title}</span>
            </span>
            <span className="docs-nav-count">
              <span className="sr-only">，共 </span>
              {pad(group.items.length)}
              <span className="sr-only"> 项</span>
            </span>
          </p>
          <div aria-hidden="true" className="docs-nav-ruler" />
          <div className="docs-nav-scroll">
            <ul className="docs-nav-list">
              {group.items.map((item, index) => (
                <li key={item.url} className="docs-nav-item">
                  <Link
                    className="docs-nav-link"
                    data-bilingual={item.titleEn ? "" : undefined}
                    href={item.url}
                    aria-current={current === item.url ? "page" : undefined}
                  >
                    <span aria-hidden="true" className="docs-nav-index">
                      <span>{pad(index + 1)}</span>
                    </span>
                    <span className="docs-nav-body">
                      {item.icon ? (
                        <span aria-hidden="true" className="docs-nav-icon">
                          <EntryIcon name={item.icon} strokeWidth={1.5} />
                        </span>
                      ) : null}
                      <span className="docs-nav-label">
                        <span className="docs-nav-zh">{item.title}</span>
                        {item.titleEn ? (
                          <span className="docs-nav-en" lang="en" translate="no">
                            {item.titleEn}
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </nav>
  )
}
