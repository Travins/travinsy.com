"use client"
import { Suspense, useState, type ReactNode } from "react"
import { registryExamples } from "@/registry/__index__"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CopyButton } from "./copy-button"
import {
  DocFrameBar,
  DocTabsList,
  DocTabsTrigger,
  docFrameClass,
  docFramePanelClass,
} from "./doc-frame"
import { IconTip } from "./icon-tip"
import { v0Url } from "./registry-items"
import { V0Icon } from "./v0-icon"

export function ComponentPreviewClient({
  name,
  item,
  source,
  code,
}: {
  name: string
  item?: string
  source: string
  code: ReactNode
}) {
  const Preview = registryExamples[name]
  const [view, setView] = useState("preview")
  return (
    <Tabs
      value={view}
      onValueChange={(value) => setView(String(value))}
      className={docFrameClass}
    >
      <DocFrameBar>
        <DocTabsList aria-label="组件示例">
          <DocTabsTrigger value="preview">预览</DocTabsTrigger>
          <DocTabsTrigger value="code">代码</DocTabsTrigger>
        </DocTabsList>
        <div className="flex items-center gap-0.5">
          {item && (
            <IconTip label="在 v0 中打开">
              <a
                href={v0Url(item)}
                target="_blank"
                rel="noreferrer"
                aria-label="在 v0 中打开（在新标签页中打开）"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon-sm" }),
                  "text-muted-foreground hover:text-foreground",
                )}
              >
                <V0Icon className="size-4" />
              </a>
            </IconTip>
          )}
          {view === "code" && <CopyButton value={source} />}
        </div>
      </DocFrameBar>
      <TabsContent
        value="preview"
        keepMounted
        className={cn(
          docFramePanelClass,
          "flex min-h-80 items-center justify-center p-4 sm:p-8",
        )}
      >
        <Suspense fallback={<p role="status">正在加载示例…</p>}>
          {Preview ? <Preview /> : <p>找不到示例：{name}</p>}
        </Suspense>
      </TabsContent>
      <TabsContent value="code" keepMounted className={docFramePanelClass}>
        {code}
      </TabsContent>
    </Tabs>
  )
}
