import type { Metadata } from "next"
import { siteConfig } from "@/config/site"

export const OG_IMAGE_SIZE = { width: 1200, height: 630 }

/** 分享卡片地址：key 对应 src/lib/og-cards.ts，由 /og/[...slug] 在构建时生成；相对地址会经 metadataBase 变成绝对地址 */
export function ogImageUrl(key: string) {
  return `/og/${key}.png`
}

/**
 * 页面级 metadata：title / description 同时落到 openGraph 与 twitter。
 * Next 对 openGraph、twitter 是整个对象替换而不是逐字段合并，所以站点级字段与分享图在这里补全。
 * （[[...slug]] 路由不能用 opengraph-image 文件约定，所以分享图统一走 /og/ 路由。）
 */
export function pageMetadata({
  title,
  description,
  path,
  ogKey,
  type = "website",
}: {
  title: string
  description: string
  /** 站内路径，如 /components/foo/ */
  path: string
  /** 分享卡片 key，见 src/lib/og-cards.ts */
  ogKey: string
  type?: "website" | "article"
}): Metadata {
  const url = `${siteConfig.url}${path}`
  const images = [{ url: ogImageUrl(ogKey), ...OG_IMAGE_SIZE, alt: title }]
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "zh_CN",
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  }
}
