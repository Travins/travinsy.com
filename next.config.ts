import { networkInterfaces } from "node:os"
import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"

/** 本机在局域网里的 IPv4 地址：开发时「手机扫码」用它替换 localhost，手机才打得开 */
function lanAddress() {
  for (const list of Object.values(networkInterfaces())) {
    for (const net of list ?? []) {
      if (net.family === "IPv4" && !net.internal) return net.address
    }
  }
  return ""
}

const nextConfig: NextConfig = {
  // 部署在 Vercel 的 Next.js 运行时：页面在构建时全部预渲染，
  // 只有 /api/github-stars/ 这类需要实时数据的接口按 revalidate 定时刷新
  trailingSlash: true,
  images: { unoptimized: true },
  // 开发时允许局域网里的手机直接打开 dev 服务器真机调试（只影响 next dev，不影响线上）
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  env: {
    NEXT_PUBLIC_DEV_LAN_HOST:
      process.env.NODE_ENV === "production" ? "" : lanAddress(),
  },
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
