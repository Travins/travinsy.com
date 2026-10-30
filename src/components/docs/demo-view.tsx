"use client"

import { Suspense } from "react"

import { registryExamples } from "@/registry/__index__"
import { PreviewSkeleton } from "./preview-skeleton"

/** 单个示例的全屏页内容：只渲染示例本身，给手机扫码真机体验 */
export function DemoView({ name }: { name: string }) {
  const Demo = registryExamples[name]
  if (!Demo) return <p>找不到示例：{name}</p>
  return (
    <Suspense fallback={<PreviewSkeleton className="min-h-80 w-full" />}>
      <Demo />
    </Suspense>
  )
}
