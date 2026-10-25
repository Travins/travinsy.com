import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { ThemeProvider } from "@/components/site/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { COLOR_THEME_INIT_SCRIPT } from "@/lib/themes"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "travinsy",
    template: "%s · travinsy",
  },
  description: "travinsy 的个人作品集，以及一套线条网格风格的 shadcn 组件库。",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning：内联脚本与 next-themes 会在 hydration 前修改 <html> 的属性
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        {/* 首帧前同步设置 data-theme，避免颜色主题闪烁 */}
        <script dangerouslySetInnerHTML={{ __html: COLOR_THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-svh">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
