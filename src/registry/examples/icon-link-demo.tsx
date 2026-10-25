import { Code2, Globe, Link2, Mail, Rss } from "lucide-react"
import { IconLink } from "@/registry/ui/icon-link/icon-link"

const links = [
  { label: "个人网站", href: "https://travinsy.com", icon: Globe },
  { label: "邮件", href: "mailto:hi@travinsy.com", icon: Mail },
  { label: "博客订阅", href: "https://travinsy.com/blog/", icon: Rss },
  { label: "组件库", href: "https://travinsy.com/components/", icon: Code2 },
]

export default function IconLinkDemo() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-2">
        {links.map(({ label, href, icon: Icon }) => (
          <IconLink key={label} href={href} label={label}>
            <Icon strokeWidth={1.5} />
          </IconLink>
        ))}
      </div>
      <p className="font-mono text-[10px] text-muted-foreground">
        Tab 聚焦，悬浮显示名称
      </p>
      {/* 尺寸与配色都可以用 className 覆盖 */}
      <IconLink
        href="https://travinsy.com"
        label="更小的图标链接"
        className="size-9 rounded-sm"
      >
        <Link2 strokeWidth={1.5} />
      </IconLink>
    </div>
  )
}
