import Link from "next/link"
import { EntryIcon } from "@/lib/entry-icons"
import { sectionNav, sectionHome, type NavSectionId } from "./docs-nav"

/** 当前分区的侧栏：纯文本分组标题 + 当前页高亮；条目带专属图标与英文副标。 */
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
          <p className="docs-nav-title">{group.title}</p>
          <ul>
            {group.items.map((item) => (
              <li key={item.url}>
                <Link
                  className="docs-nav-link"
                  data-bilingual={item.titleEn ? "" : undefined}
                  href={item.url}
                  aria-current={current === item.url ? "page" : undefined}
                >
                  {item.icon ? (
                    <EntryIcon
                      name={item.icon}
                      strokeWidth={1.5}
                      className="docs-nav-icon"
                    />
                  ) : null}
                  <span className="docs-nav-label">
                    {item.title}
                    {item.titleEn ? (
                      <span className="docs-nav-en" lang="en" translate="no">
                        {item.titleEn}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
