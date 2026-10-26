import { SiteShell } from "@/components/site/site-shell"

// 首页、博客：与文档类页面共用同一宽度（由 SiteShell 统一设置），正文类页面自行限制阅读宽度
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <SiteShell>
      <main>{children}</main>
    </SiteShell>
  )
}
