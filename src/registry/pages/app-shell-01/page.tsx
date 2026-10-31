import type { Metadata } from "next"

import { DashboardOverview } from "@/registry/templates/app-shell-01/dashboard-overview"

export const metadata: Metadata = {
  title: "概览",
}

/** 控制台首页：概览仪表盘。按同样的方式在 app/(app)/ 下添加更多页面，它们会自动套上侧栏与顶栏。 */
export default function DashboardPage() {
  return <DashboardOverview />
}
