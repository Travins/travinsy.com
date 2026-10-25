"use client"
import { Suspense } from "react"
import { registryViews } from "@/registry/__index__"

/** /view/<name>/ 的整页内容：渲染条目的 demo.tsx（构建时由索引脚本生成映射）。 */
export function ViewFrame({ name }: { name: string }) {
  const View = registryViews[name]
  if (!View) return <p>找不到预览：{name}</p>
  return (
    <Suspense fallback={<p role="status">正在加载预览…</p>}>
      <View />
    </Suspense>
  )
}
