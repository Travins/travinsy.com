import Link from "next/link"
import { docsNav } from "./docs-nav"

/** 全站文档共用的侧栏：纯文本分组标题 + 当前页高亮。 */
export function DocsSidebarNav({ current }: { current: string }) {
  return (
    <nav aria-label="文档导航">
      {docsNav().map((group) => (
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
