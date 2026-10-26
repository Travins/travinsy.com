"use client"

import { ThemeRadioGroup } from "@/components/themes/theme-radio-group"
import type { ColorThemeId } from "@/lib/themes"

/** /themes 页面的主题选择：分组色块卡片，点击只改变预览区，不影响整站。 */
export function ThemePicker({
  value,
  onChange,
}: {
  value: ColorThemeId
  onChange: (id: ColorThemeId) => void
}) {
  return (
    <ThemeRadioGroup
      variant="card"
      label="选择预览主题"
      value={value}
      onValueChange={onChange}
    />
  )
}
