import { Code2, Globe, Mail, Rss } from "lucide-react"

import { FollowMe } from "@/registry/ui/follow-me/follow-me"
import {
  GridContainer,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"
import { IconLink } from "@/registry/ui/icon-link/icon-link"

const LINKS = [
  { label: "个人网站", href: "/", icon: Globe },
  { label: "邮件", href: "mailto:hi@travinsy.com", icon: Mail },
  { label: "博客订阅", href: "/rss.xml", icon: Rss },
  { label: "组件库", href: "/components/", icon: Code2 },
] as const

/**
 * 手写标注封面：线条网格容器里，一行社交图标上方有手写的 follow me，
 * 箭头的弧线落在最右的图标旁。真实页面里标注在容器外侧，封面里挪进容器以便窄屏也看得全。
 */
export default function FollowMeShowcaseDemo() {
  return (
    <div className="flex size-full justify-center">
      <GridContainer className="flex h-full w-80 flex-col bg-background/70 [--grid-width:20rem]">
        <GridSection className="flex flex-1 items-end px-4 pt-4 pb-1">
          {/* 演示里改成静态定位；稍微放大，让笔迹在缩略图里也看得清 */}
          <FollowMe className="static block w-32 origin-bottom-left scale-125 -rotate-6 rotate-0" />
        </GridSection>
        <GridSection className="flex items-center gap-2 px-4 py-4">
          {LINKS.map(({ label, href, icon: Icon }, index) => (
            <IconLink
              key={label}
              href={href}
              label={label}
              // 最后一个图标是箭头指向的目标，用主色强调
              className={
                index === LINKS.length - 1
                  ? "border-primary/50 bg-primary/5 text-primary"
                  : undefined
              }
            >
              <Icon strokeWidth={1.5} />
            </IconLink>
          ))}
        </GridSection>
        <GridSeparator />
      </GridContainer>
    </div>
  )
}
