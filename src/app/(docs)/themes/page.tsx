import type { Metadata } from "next"

import { ThemeStudio } from "@/components/themes/theme-studio"
import { siteConfig } from "@/config/site"
import { COLOR_THEMES } from "@/lib/themes"
import { GridSection } from "@/registry/ui/grid-layout/grid-layout"

const description =
  "在页面里预览每套颜色主题在登录表单、统计、任务和图表上的表现，一键应用到整站，或复制 CSS 变量与 shadcn 安装命令。中性基底负责灰阶色偏，彩色主题按色相环排列。"

export const metadata: Metadata = {
  title: "主题",
  description,
  alternates: { canonical: `${siteConfig.url}/themes/` },
}

export default function ThemesPage() {
  return (
    <main id="main-content">
      <GridSection className="px-4 py-10 sm:px-6 sm:py-14">
        <p className="mb-4 font-mono text-xs text-muted-foreground">
          THEMES / {COLOR_THEMES.length}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          主题 <span className="text-muted-foreground">· Themes</span>
        </h1>
        <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
          {description}
        </p>
      </GridSection>
      <ThemeStudio />
    </main>
  )
}
