"use client"

import { ThemeSwatch } from "@/components/site/theme-switcher"
import { COLOR_THEMES, type ColorThemeId } from "@/lib/themes"
import { cn } from "@/lib/utils"

/** 主题色块网格：点击只改变预览区，不影响整站。 */
export function ThemePicker({
  value,
  onChange,
}: {
  value: ColorThemeId
  onChange: (id: ColorThemeId) => void
}) {
  return (
    <div
      role="group"
      aria-label="选择预览主题"
      className="grid grid-cols-2 gap-2 sm:grid-cols-5"
    >
      {COLOR_THEMES.map((theme) => {
        const active = theme.id === value
        return (
          <button
            key={theme.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(theme.id)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg border border-edge bg-background px-3 py-2.5 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none",
              active && "border-foreground/60 bg-muted"
            )}
          >
            <ThemeSwatch theme={theme} className="size-5" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                {theme.name}
              </span>
              <span className="block truncate font-mono text-xs text-muted-foreground">
                {theme.title}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
