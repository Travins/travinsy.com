"use client"

import { PaletteIcon } from "lucide-react"

import { useColorTheme } from "@/components/site/use-color-theme"
import { ThemeRadioGroup } from "@/components/themes/theme-radio-group"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

/** 颜色主题选择器（顶栏）。 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useColorTheme()

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
      <PopoverContent
        align="end"
        className="max-h-(--available-height) w-80 gap-3 overflow-y-auto"
      >
        <PopoverTitle className="px-1 text-xs text-muted-foreground">
          颜色主题 · Color theme
        </PopoverTitle>
        <ThemeRadioGroup
          label="颜色主题"
          value={theme}
          onValueChange={setTheme}
        />
      </PopoverContent>
    </Popover>
  )
}
