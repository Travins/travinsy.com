import type { Metadata } from "next"
import type { ReactNode } from "react"
import { ViewThemeSync } from "@/components/docs/view-theme-sync"

// 区块 / 页面的 iframe 内容页：沿用根布局的全局样式与主题脚本，但没有站点页头页脚
export const metadata: Metadata = { robots: { index: false, follow: false } }

export default function ViewLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ViewThemeSync />
      {children}
    </>
  )
}
