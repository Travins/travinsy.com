import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // 部署在 Vercel 的 Next.js 运行时：页面在构建时全部预渲染，
  // 只有 /api/github-stars/ 这类需要实时数据的接口按 revalidate 定时刷新
  trailingSlash: true,
  images: { unoptimized: true },
  // 基础安全响应头；/view/ 预览页会被本站 iframe 嵌入，所以只允许同源嵌套
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ]
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

export default createMDX()(nextConfig)
