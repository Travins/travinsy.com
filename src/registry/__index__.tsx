// 此文件由 scripts/build-registry-index.ts 生成，请勿手改。
"use client"
import { lazy, type ComponentType, type LazyExoticComponent } from "react"

export const registryExamples: Record<string, LazyExoticComponent<ComponentType>> = {
  "contribution-graph-demo": lazy(() => import("./examples/contribution-graph-demo")),
  "follow-me-demo": lazy(() => import("./examples/follow-me-demo")),
  "greeting-demo": lazy(() => import("./examples/greeting-demo")),
  "grid-layout-demo": lazy(() => import("./examples/grid-layout-demo")),
  "icon-link-demo": lazy(() => import("./examples/icon-link-demo")),
  "local-time-demo": lazy(() => import("./examples/local-time-demo")),
}

// 区块 / 页面模板的整页预览，键为 registry 条目名
export const registryViews: Record<string, LazyExoticComponent<ComponentType>> = {
  "auth-01": lazy(() => import("./blocks/auth-01/demo")),
  "feature-columns": lazy(() => import("./blocks/feature-columns/demo")),
  "portfolio-grid": lazy(() => import("./templates/portfolio-grid/demo")),
  "profile-hero": lazy(() => import("./blocks/profile-hero/demo")),
  "social-follow": lazy(() => import("./blocks/social-follow/demo")),
}
