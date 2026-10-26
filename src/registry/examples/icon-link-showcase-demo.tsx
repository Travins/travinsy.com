import {
  BookOpen,
  Camera,
  Code2,
  Globe,
  Mail,
  MessageCircle,
  Music,
  Podcast,
  Rss,
  Video,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { IconLink } from "@/registry/ui/icon-link/icon-link"

const LINKS = [
  { label: "个人网站", icon: Globe },
  { label: "邮件", icon: Mail },
  { label: "博客订阅", icon: Rss },
  { label: "组件库", icon: Code2 },
  { label: "笔记", icon: BookOpen },
  { label: "相册", icon: Camera },
  { label: "歌单", icon: Music },
  { label: "播客", icon: Podcast },
  { label: "视频", icon: Video },
  { label: "留言", icon: MessageCircle },
] as const
const FOCUSED = "博客订阅"

/**
 * 图标链接封面：两排方块，其中一个处在键盘聚焦态并带名称提示。
 * 聚焦环与提示是静态摆出来的（封面不可交互），真实组件里由浏览器的焦点与 title 提供。
 */
export default function IconLinkShowcaseDemo() {
  return (
    <div className="relative flex size-full items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />
      <ul className="relative grid grid-cols-5 gap-3">
        {LINKS.map(({ label, icon: Icon }) => {
          const focused = label === FOCUSED
          return (
            <li key={label} className="relative">
              <IconLink
                href="#"
                tabIndex={-1}
                label={label}
                className={cn(
                  focused &&
                    "border-primary/60 bg-muted text-foreground outline-2 outline-offset-4 outline-ring",
                )}
              >
                <Icon strokeWidth={1.5} />
              </IconLink>
              {focused ? (
                <span
                  aria-hidden="true"
                  className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs whitespace-nowrap text-background"
                >
                  {label}
                </span>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
