import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { siteConfig } from "@/config/site"
import { DEFAULT_OG_KEY } from "@/lib/og-cards"
import { OG_IMAGE_SIZE, ogImageUrl } from "@/lib/metadata"
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

const ogImages = [
  { url: ogImageUrl(DEFAULT_OG_KEY), ...OG_IMAGE_SIZE, alt: "Yi UI" },
]
const description = "Yi UI（易）：线条网格风格的 React 组件库，以 shadcn registry 分发，由 Travins 个人维护。"

export const metadata: Metadata = {
  // 让 openGraph / twitter 的相对地址（含 opengraph-image）解析成绝对地址
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Yi UI",
    template: "%s · Yi UI",
  },
  description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "zh_CN",
    title: "Yi UI",
    description,
    images: ogImages,
  },
  twitter: {
    card: "summary_large_image",
    title: "Yi UI",
    description,
    images: ogImages,
  },
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
