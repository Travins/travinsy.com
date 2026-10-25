import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

// 作品集类页面（首页、博客）：64rem（正文类页面自行限制阅读宽度）
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="[--grid-width:64rem]">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
