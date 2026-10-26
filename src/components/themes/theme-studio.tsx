"use client"

import { useState, useSyncExternalStore } from "react"
import { CheckIcon, CodeIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { useColorTheme } from "@/components/site/use-color-theme"
import { ThemeCodePanel } from "@/components/themes/theme-code-panel"
import { ThemePicker } from "@/components/themes/theme-picker"
import { ThemePalette, ThemePreviewCards } from "@/components/themes/theme-preview"
import { Button } from "@/components/ui/button"
import { COLOR_THEMES, type ColorThemeId } from "@/lib/themes"
import { cn } from "@/lib/utils"
import {
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"

type Mode = "light" | "dark"

const noopSubscribe = () => () => {}

/** 水合期间返回 false：next-themes 的 resolvedTheme 在服务端为 undefined，客户端首帧就能读到，直接用会导致水合不一致。 */
function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
}

const MODES = [
  { value: "light", label: "亮色", Icon: SunIcon },
  { value: "dark", label: "暗色", Icon: MoonIcon },
] as const

/**
 * /themes 的交互部分。
 * - 预览主题 / 预览亮暗只通过 data-theme-scope 与 .dark/.light 作用于预览容器，不改变整站。
 * - 「应用到整站」才调用 setTheme。
 */
export function ThemeStudio() {
  const { theme: siteTheme, setTheme } = useColorTheme()
  const { resolvedTheme } = useTheme()
  const hydrated = useHydrated()
  // null 表示跟随整站，直到用户主动选择
  const [selectedId, setSelectedId] = useState<ColorThemeId | null>(null)
  const [modeOverride, setModeOverride] = useState<Mode | null>(null)
  const [codeOpen, setCodeOpen] = useState(false)

  const activeId = selectedId ?? siteTheme
  const active = COLOR_THEMES.find((item) => item.id === activeId) ?? COLOR_THEMES[0]
  const siteMode: Mode = hydrated && resolvedTheme === "dark" ? "dark" : "light"
  const mode = modeOverride ?? siteMode
  const applied = activeId === siteTheme

  return (
    <>
      <GridSection className="flex flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-3">
          <h2 className="font-mono text-xs text-muted-foreground">
            选择主题 · 仅预览
          </h2>
          <ThemePicker value={activeId} onChange={setSelectedId} />
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div
            role="group"
            aria-label="预览亮暗模式"
            className="flex items-center gap-1 rounded-lg border border-edge p-0.5"
          >
            {MODES.map(({ value, label, Icon }) => (
              <Button
                key={value}
                type="button"
                variant={mode === value ? "secondary" : "ghost"}
                size="sm"
                aria-pressed={mode === value}
                onClick={() => setModeOverride(value)}
              >
                <Icon data-icon="inline-start" />
                {label}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <Button
              type="button"
              variant="outline"
              aria-expanded={codeOpen}
              aria-controls="theme-code-panel"
              onClick={() => setCodeOpen((open) => !open)}
            >
              <CodeIcon data-icon="inline-start" />
              {codeOpen ? "收起代码" : "复制代码"}
            </Button>
            <Button
              type="button"
              disabled={applied}
              onClick={() => setTheme(active.id)}
            >
              {applied && <CheckIcon data-icon="inline-start" />}
              {applied ? `整站正在使用「${active.name}」` : `应用「${active.name}」到整站`}
            </Button>
          </div>
        </div>
      </GridSection>

      {codeOpen && (
        <GridSection
          id="theme-code-panel"
          aria-label={`${active.name}主题代码`}
          className="px-4 py-6 sm:px-6"
        >
          <ThemeCodePanel theme={active} />
        </GridSection>
      )}

      <GridSeparator />

      {/* 局部作用域：data-theme-scope 在 themes.css 中定义，不影响 Header 等整站颜色 */}
      <div
        data-theme-scope={active.id}
        className={cn("bg-background text-foreground", modeOverride)}
      >
        <GridSection className="flex items-center gap-2 px-4 py-3 sm:px-6">
          <span aria-hidden className="size-2 rounded-full bg-primary" />
          <p className="font-mono text-xs text-muted-foreground">
            预览 · {active.name} {active.title} · {mode === "dark" ? "暗色" : "亮色"}
          </p>
        </GridSection>
        <GridSection>
          <ThemePreviewCards />
        </GridSection>
        <GridSection className="px-4 py-6 sm:px-6">
          <ThemePalette />
        </GridSection>
      </div>
    </>
  )
}
