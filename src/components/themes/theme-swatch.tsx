import type * as React from "react"

import type { ColorTheme } from "@/lib/themes"
import { cn } from "@/lib/utils"

/**
 * 主题色块：亮 / 暗模式下分别展示各自的色值。
 * 彩色主题是 primary 纯色；中性基底是浅 / 中 / 深三段色带，用来看出灰族的色偏。
 */
export function ThemeSwatch({
  theme,
  className,
}: {
  theme: Pick<ColorTheme, "swatch">
  className?: string
}) {
  return (
    <span
      aria-hidden
      data-slot="theme-swatch"
      className={cn(
        "size-3.5 shrink-0 rounded-full bg-(image:--swatch-light) ring-1 ring-foreground/20 dark:bg-(image:--swatch-dark)",
        className
      )}
      style={
        {
          "--swatch-light": theme.swatch.light,
          "--swatch-dark": theme.swatch.dark,
        } as React.CSSProperties
      }
    />
  )
}
