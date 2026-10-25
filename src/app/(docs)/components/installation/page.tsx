import Link from "next/link"
import type { Metadata } from "next"
import { siteConfig } from "@/config/site"
import { GridSection } from "@/registry/ui/grid-layout/grid-layout"

// 静态导出无法配置 301：旧地址保留一个 meta refresh 跳转页，不进入 sitemap。
const target = "/docs/installation/"

export const metadata: Metadata = {
  title: "安装",
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteConfig.url}${target}` },
}

export default function Page() {
  return (
    <GridSection className="px-4 py-16 sm:px-6">
      <meta httpEquiv="refresh" content={`0;url=${target}`} />
      <main id="main-content" className="mx-auto max-w-xl text-sm">
        <p className="text-muted-foreground">该页面已移至新的地址。</p>
        <p className="mt-3">
          <Link href={target} className="underline underline-offset-4">
            前往「安装」→
          </Link>
        </p>
      </main>
    </GridSection>
  )
}
