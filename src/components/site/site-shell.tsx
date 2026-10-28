import type { ReactNode } from "react"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

/**
 * 站点外壳：页头 + 页脚 + 跳转链接，并统一全站内容区宽度。
 * `--grid-width` 只在这里设置一次（80rem），所有栏目共用，切换页面时竖线位置不会跳动；
 * registry 组件自身的默认值（48rem）不受影响，站点通过变量覆盖。
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    // 至少一屏高：内容很短的页面（如 404）页脚也落在底部，正文用 flex-1 填满中间
    <div className="flex min-h-svh flex-col [--grid-width:80rem]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-background focus:p-3"
      >
        跳至正文
      </a>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  )
}
