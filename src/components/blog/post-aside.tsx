import type { TOCItemType } from "fumadocs-core/toc"

import { formatBlogDate } from "@/lib/blog"

/**
 * 文章左栏（≥1280px 显示，随页面吸顶）：文章元信息；返回列表的按钮放在正文标题上方。
 * 版式沿用文档侧栏的「标签行 + 虚线分行」，窄屏的同一份信息由正文头部的 PostMeta 展示。
 */
export function PostAside({
  date,
  minutes,
  tags,
}: {
  date: string
  minutes: number
  tags?: string[]
}) {
  return (
    <aside className="post-meta">
      <div className="post-meta-inner">
        <p className="docs-nav-head">
          <span className="docs-nav-eyebrow">
            <span lang="en" translate="no">
              ARTICLE
            </span>
            <span className="docs-nav-eyebrow-zh"> / 文章</span>
          </span>
        </p>
        <dl className="post-meta-list">
          <div>
            <dt>发布</dt>
            <dd>
              <time dateTime={date}>{formatBlogDate(date)}</time>
            </dd>
          </div>
          <div>
            <dt>阅读</dt>
            <dd>约 {minutes} 分钟</dd>
          </div>
          {tags && tags.length > 0 && (
            <div>
              <dt>标签</dt>
              <dd>
                <ul className="flex flex-wrap gap-x-3 gap-y-1">
                  {tags.map((tag) => (
                    <li key={tag}>#{tag}</li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </aside>
  )
}

/** 窄屏（<1280px）：目录折叠在正文上方，点开后是普通锚点链接。 */
export function PostTocMobile({ items }: { items: TOCItemType[] }) {
  if (items.length === 0) return null
  return (
    <details className="post-toc-mobile">
      <summary>本文目录</summary>
      <ul>
        {items.map((item) => (
          <li
            key={item.url}
            style={{ paddingInlineStart: `${Math.max(0, item.depth - 2) * 12}px` }}
          >
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </details>
  )
}
