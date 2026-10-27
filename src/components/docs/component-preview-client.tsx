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
import {
  IsometricTunerPanel,
  IsometricTunerProvider,
  IsometricTunerToggle,
  useIsometricTuner,
} from "./isometric-tuner"
import { PreviewBackdrop } from "./preview-backdrop"
import { V0Icon } from "./v0-icon"

/**
 * 自带满幅背景（点阵、光晕、字符矩阵、地球卡片等）的示例：预览区不留内边距，
 * 示例根元素撑满、去掉自身的圆角与边框，背景直接铺到预览框边缘。
 */
const FULL_BLEED = new Set([
  "isometric-mark-demo",
  "isometric-mark-legacy-demo",
  "glyph-field-demo",
  "glyph-field-icon-demo",
  "glyph-field-binary-demo",
  "glyph-field-cjk-demo",
  "glyph-field-custom-demo",
  "globe-demo",
  "marquee-demo",
  "text-animate-demo",
  "orbit-demo",
  "orbit-half-demo",
  "orbit-icons-demo",
  "orbit-stack-demo",
  "ripple-demo",
  "ripple-online-demo",
  "ripple-pulse-demo",
  "ripple-signal-demo",
  "greeting-card-demo",
  "shuffle-grid-demo",
])

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
  // 等轴测标志的每个示例都带一个可开关的调整面板
  const tuner = useIsometricTuner()
  const tunable = item === "isometric-mark"
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
          {tunable && view === "preview" && (
            <IsometricTunerToggle
              open={tuner.open}
              onOpenChange={tuner.setOpen}
            />
          )}
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
          "relative isolate flex min-h-80 items-center justify-center",
          FULL_BLEED.has(name)
            ? "p-0 *:min-h-80 *:w-full *:max-w-none *:rounded-none *:border-0"
            : "p-4 sm:p-8",
        )}
      >
        <PreviewBackdrop name={item} />
        <IsometricTunerProvider tuning={tuner.tuning}>
          <Suspense fallback={<p role="status">正在加载示例…</p>}>
            {Preview ? <Preview /> : <p>找不到示例：{name}</p>}
          </Suspense>
        </IsometricTunerProvider>
      </TabsContent>
      {tunable && tuner.open && view === "preview" ? (
        <IsometricTunerPanel
          values={tuner.values}
          base={tuner.base}
          onChange={tuner.setValues}
        />
      ) : null}
      <TabsContent value="code" keepMounted className={docFramePanelClass}>
        {code}
      </TabsContent>
    </Tabs>
  )
}
