"use client"

import type * as React from "react"
import { CheckIcon, PaletteIcon } from "lucide-react"

import { useColorTheme } from "@/components/site/use-color-theme"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { ColorTheme } from "@/lib/themes"
import { cn } from "@/lib/utils"

/** 主题色块：亮 / 暗模式下分别展示各自的 primary。 */
export function ThemeSwatch({
  theme,
  className,
}: {
  theme: Pick<ColorTheme, "preview">
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-4 shrink-0 rounded-full bg-(--swatch-light) ring-1 ring-foreground/15 dark:bg-(--swatch-dark)",
        className
      )}
      style={
        {
          "--swatch-light": theme.preview.light,
          "--swatch-dark": theme.preview.dark,
        } as React.CSSProperties
      }
    />
  )
}

/** 颜色主题选择器。 */
export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useColorTheme()

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="选择颜色主题"
            title="选择颜色主题"
          />
        }
      >
        <PaletteIcon />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-60 gap-2">
        <PopoverTitle className="px-1 text-xs text-muted-foreground">
          颜色主题
        </PopoverTitle>
        <div className="grid grid-cols-2 gap-1">
          {themes.map((item) => {
            const active = item.id === theme
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setTheme(item.id)}
                className={cn(
                  "flex h-8 items-center gap-2 rounded-md px-2 text-left text-sm outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                  active && "bg-muted font-medium"
                )}
              >
                <ThemeSwatch theme={item} />
                <span className="flex-1 truncate">{item.name}</span>
                {active && <CheckIcon className="size-3.5 text-muted-foreground" />}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
