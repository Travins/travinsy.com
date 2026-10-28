import type * as React from "react"
import { Monitor, Moon, Sparkles, Sun } from "lucide-react"

import { cn } from "@/lib/utils"
import { flowToneStyle } from "@/registry/ui/flow-diagram/tone"

import type { Settings01Labels } from "./config"
import type { Density, Settings01Values, ThemeMode } from "./types"

const DENSITY_CLASSES: Record<Density, string> = {
  compact: "gap-2 p-3",
  comfortable: "gap-3 p-4",
  spacious: "gap-4 p-5",
}

const MODE_ICONS: Record<ThemeMode, React.ComponentType<{ className?: string }>> =
  { light: Sun, dark: Moon, system: Monitor }

/** 预览卡片的外框：标题栏 + 内容区。纯展示，对读屏隐藏。 */
function PreviewFrame({
  title,
  badge,
  dark = false,
  className,
  style,
  children,
}: {
  title: string
  badge?: React.ReactNode
  /** 在卡片内套用深色主题变量 */
  dark?: boolean
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <div
      aria-hidden="true"
      data-slot="settings-01-preview"
      className={cn(
        "overflow-hidden rounded-lg border border-edge bg-muted/40 text-foreground",
        dark && "dark bg-background",
        className,
      )}
      style={style}
    >
      <div className="flex h-10 items-center justify-between gap-2 border-b border-edge px-3 text-xs text-muted-foreground">
        <span className="truncate">{title}</span>
        {badge ? (
          <span className="flex shrink-0 items-center gap-1 [&_svg]:size-3.5">
            {badge}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  )
}

/**
 * 外观预览：一张小卡片，随主题模式、强调色、字号、圆角、信息密度和动态效果实时变化。
 * 深色用 `.dark` 变量在卡片内套用；站点本身已是深色时，浅色无法在卡片里反向还原，所以标题栏另外写出当前模式。
 */
function AppearancePreview({
  values,
  labels,
}: {
  values: Settings01Values
  labels: Settings01Labels
}) {
  const ModeIcon = MODE_ICONS[values.theme]
  const modeLabel = {
    light: labels.previewModeLight,
    dark: labels.previewModeDark,
    system: labels.previewModeSystem,
  }[values.theme]
  return (
    <PreviewFrame
      title={labels.previewTitle}
      dark={values.theme === "dark"}
      badge={
        <>
          <ModeIcon />
          {modeLabel}
        </>
      }
      style={
        {
          ...flowToneStyle(values.accent),
          "--preview-radius": `${values.radius}px`,
        } as React.CSSProperties
      }
    >
      <div className="p-3">
        <div
          className={cn(
            "flex flex-col rounded-(--preview-radius) border border-edge bg-background shadow-xs transition-[gap,padding] duration-200 motion-reduce:transition-none",
            DENSITY_CLASSES[values.density],
          )}
          style={{ fontSize: values.fontSize }}
        >
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-(--preview-radius) bg-(--flow-tone)/15 text-(--flow-tone)">
              <Sparkles className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[1.1em] leading-tight font-medium">
                {labels.previewHeading}
              </p>
              <p className="flex items-center gap-1.5 text-[0.8em] text-muted-foreground">
                <span
                  className={cn(
                    "size-1.5 rounded-full bg-(--flow-tone)",
                    !values.reduceMotion && "animate-pulse motion-reduce:animate-none",
                  )}
                />
                {labels.previewLive}
              </p>
            </div>
          </div>
          <p className="text-[1em] leading-snug text-muted-foreground">
            {labels.previewBody}
          </p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[0.8em] text-muted-foreground">
              <span>{labels.previewProgress}</span>
              <span className="tabular-nums">72%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[72%] rounded-full bg-(--flow-tone)" />
            </div>
          </div>
          {/* 模拟按钮：高度取默认档 32px，圆角跟随预览圆角 */}
          <span className="inline-flex h-8 items-center justify-center self-start rounded-(--preview-radius) border border-(--flow-tone) bg-(--flow-tone)/10 px-3 text-[0.9em] font-medium">
            {labels.previewAction}
          </span>
        </div>
      </div>
    </PreviewFrame>
  )
}

/** 示例代码：level 是嵌套层级 */
const SAMPLE_CODE = [
  { level: 0, text: "function greet(name) {" },
  { level: 1, text: "if (name) {" },
  { level: 2, text: "return `Hi, ${name}`" },
  { level: 1, text: "}" },
  { level: 1, text: 'return "Hi"' },
  { level: 0, text: "}" },
] as const

const INDENT_WIDTH = { "2": 2, "4": 4, tab: 4 } as const

/** 编辑器预览：缩进宽度、行高与空白字符的显示会实时变化。 */
function EditorPreview({
  values,
  labels,
}: {
  values: Settings01Values
  labels: Settings01Labels
}) {
  const width = INDENT_WIDTH[values.indent]
  const marker = values.indent === "tab" ? "→" : "·".repeat(width)
  return (
    <PreviewFrame title={labels.editorPreviewTitle}>
      <pre
        className="overflow-hidden bg-background p-3 font-mono text-xs"
        style={{ lineHeight: values.lineHeight }}
      >
        {SAMPLE_CODE.map((line, index) => (
          <div key={index} className="flex">
            <span className="w-5 shrink-0 pe-2 text-end text-muted-foreground/60 tabular-nums select-none">
              {index + 1}
            </span>
            {Array.from({ length: line.level }, (_, unit) => (
              <span
                key={unit}
                className="inline-block shrink-0 overflow-hidden text-muted-foreground/50"
                style={{ width: `${width}ch` }}
              >
                {values.showTabs ? marker : ""}
              </span>
            ))}
            <span className="whitespace-pre">{line.text}</span>
          </div>
        ))}
      </pre>
    </PreviewFrame>
  )
}

export { AppearancePreview, EditorPreview }
