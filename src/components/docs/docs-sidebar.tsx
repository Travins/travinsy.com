import Link from "next/link"
import { sectionNav, sectionHome, type NavSectionId } from "./docs-nav"

/** 当前分区的侧栏：纯文本分组标题 + 当前页高亮。 */
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
                  href={item.url}
                  aria-current={current === item.url ? "page" : undefined}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
