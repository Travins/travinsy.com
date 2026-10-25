import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

// 作品集类页面（首页、博客）：窄版 48rem
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="[--grid-width:48rem]">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
