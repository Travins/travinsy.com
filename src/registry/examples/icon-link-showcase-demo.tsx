import {
  Blocks,
  BookOpen,
  Bot,
  Code2,
  Globe,
  LayoutTemplate,
  Mail,
  NotebookPen,
  Palette,
  Rss,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { IconLink } from "@/registry/ui/icon-link/icon-link"

const LINKS = [
  { label: "个人网站", href: "/", icon: Globe },
  { label: "邮件", href: "mailto:hi@travinsy.com", icon: Mail },
  { label: "博客订阅", href: "/rss.xml", icon: Rss },
  { label: "组件库", href: "/components/", icon: Code2 },
  { label: "笔记", href: "/blog/", icon: NotebookPen },
  { label: "文档", href: "/docs/", icon: BookOpen },
  { label: "区块", href: "/blocks/", icon: Blocks },
  { label: "模板", href: "/templates/", icon: LayoutTemplate },
  { label: "主题", href: "/themes/", icon: Palette },
  { label: "Agent", href: "/agents/", icon: Bot },
] as const
const FOCUSED = "博客订阅"

/**
 * 图标链接封面：两排方块，悬停或键盘聚焦时在上方显示名称；
 * 没有交互时默认亮出其中一个，让静止的缩略图也能看出提示的样子。
 */
export default function IconLinkShowcaseDemo() {
  return (
    <div className="relative flex size-full items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />
      <ul className="group/list relative grid grid-cols-5 gap-x-3 gap-y-10">
        {LINKS.map(({ label, href, icon: Icon }) => {
          const featured = label === FOCUSED
          return (
            <li key={label} className="group/item relative">
              <IconLink
                href={href}
                label={label}
                className={cn(
                  featured &&
                    "border-primary/60 bg-muted text-foreground group-focus-within/list:not-group-focus-within/item:border-edge group-focus-within/list:not-group-focus-within/item:bg-muted/30 group-hover/list:not-group-hover/item:border-edge group-hover/list:not-group-hover/item:bg-muted/30",
                )}
              >
                <Icon strokeWidth={1.5} />
              </IconLink>
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs whitespace-nowrap text-background opacity-0 transition-opacity group-focus-within/item:opacity-100 group-hover/item:opacity-100 motion-reduce:transition-none",
                  featured &&
                    "opacity-100 group-focus-within/list:not-group-focus-within/item:opacity-0 group-hover/list:not-group-hover/item:opacity-0",
                )}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
