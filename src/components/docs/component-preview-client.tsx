"use client"
import { Suspense, type ReactNode } from "react"
import { registryExamples } from "@/registry/__index__"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function ComponentPreviewClient({
  name,
  code,
}: {
  name: string
  code: ReactNode
}) {
  const Preview = registryExamples[name]
  return (
    <Tabs defaultValue="preview" className="not-prose my-6 min-w-0">
      <TabsList aria-label="组件示例" variant="line">
        <TabsTrigger value="preview">预览</TabsTrigger>
        <TabsTrigger value="code">代码</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div className="docs-preview bg-muted/30">
          <Suspense fallback={<p role="status">正在加载示例…</p>}>
            {Preview ? <Preview /> : <p>找不到示例：{name}</p>}
          </Suspense>
        </div>
      </TabsContent>
      <TabsContent value="code">{code}</TabsContent>
    </Tabs>
  )
}
