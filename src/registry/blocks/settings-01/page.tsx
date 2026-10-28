"use client"

import { Settings01 } from "@/registry/blocks/settings-01/settings-01"

/**
 * 设置页入口：用 onSave 把设置存到你自己的后端。
 * 回调返回 Promise；失败时 throw new Error("中文原因")，原因会显示在底部保存栏上。
 * 想把改动实时应用到页面（例如切换主题），在 onValueChange 里处理。
 */
export default function SettingsPage() {
  return (
    <Settings01
      onSave={async (values) => {
        // TODO: 调用你的接口，例如 await fetch("/api/settings", { method: "PUT", body: JSON.stringify(values) })
        console.info("save settings", values)
        await new Promise((resolve) => setTimeout(resolve, 600))
      }}
    />
  )
}
