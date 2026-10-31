"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

import { useAppShellLabels, type AppShellLabels } from "./config"

/** 亮 / 暗模式切换，依赖项目里已有的 next-themes ThemeProvider。用 CSS 切换图标，避免水合不一致。 */
function ThemeToggle({
  labels,
  ...props
}: React.ComponentProps<typeof Button> & {
  labels?: Partial<AppShellLabels>
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const { toggleTheme } = useAppShellLabels(labels)
  return (
    <Button
      data-slot="app-shell-theme-toggle"
      variant="ghost"
      size="icon"
      aria-label={toggleTheme}
      title={toggleTheme}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      {...props}
    >
      <SunIcon className="dark:hidden" />
      <MoonIcon className="hidden dark:block" />
    </Button>
  )
}

export { ThemeToggle }
