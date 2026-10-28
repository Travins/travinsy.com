import type { Metadata } from "next"
import Link from "next/link"

import { SiteShell } from "@/components/site/site-shell"
import { buttonVariants } from "@/components/ui/button"
import {
  GridContainer,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"

export const metadata: Metadata = {
  title: "页面不存在",
  description: "这一页不存在，可能是地址写错了，或者内容已经移走。",
}

// 根级 not-found 只会套上根布局（没有站点页头页脚），所以这里自己包一层 SiteShell；
// 静态导出时它会生成 out/404.html，OSS 把它配成错误页
export default function NotFound() {
  return (
    <SiteShell>
      <main id="main-content" className="flex flex-1 flex-col">
        {/* 撑满页头与页脚之间的高度，竖线一直画到页脚，内容垂直居中 */}
        <GridContainer className="flex flex-1 flex-col">
          <GridSection className="flex flex-1 flex-col justify-center px-4 py-20 sm:px-6 sm:py-32">
            <p className="font-mono text-xs text-muted-foreground">
              ERROR / 404
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
              这一页不存在
              <span className="text-muted-foreground"> · Page not found</span>
            </h1>
            <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
              地址可能写错了，或者这里的内容已经移走。从下面的入口继续逛吧。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className={buttonVariants({ size: "lg" })}>
                回到首页
              </Link>
              <Link
                href="/components/"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                组件列表
              </Link>
              <Link
                href="/blog/"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                博客
              </Link>
            </div>
          </GridSection>
          <GridSeparator />
        </GridContainer>
      </main>
    </SiteShell>
  )
}
