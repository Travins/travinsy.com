import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // 纯静态导出，部署到阿里云 OSS
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // 静态导出不支持 PPR，因此不开启 cacheComponents / partialPrefetching
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
