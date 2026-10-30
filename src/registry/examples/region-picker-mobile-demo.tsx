"use client"

import * as React from "react"
import { BatteryFull, ChevronLeft, Signal, Wifi } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RegionPicker } from "@/registry/ui/region-picker/region-picker"

const loadRegions = () =>
  import("@/registry/lib/china-regions").then((m) => m.chinaRegions)

/** 文本框也做成方条：标签在条内左侧、内容靠右，和选择器排在一起是一套样式 */
const FIELD =
  "flex h-9 items-center gap-3 rounded-md border border-edge bg-muted/60 px-3 text-sm pointer-coarse:h-11 focus-within:border-foreground/25 focus-within:bg-background dark:focus-within:bg-input/30"
const FIELD_INPUT =
  "min-w-0 flex-1 bg-transparent text-right text-base outline-none placeholder:text-muted-foreground md:text-sm"

/**
 * 手机上的体验：在桌面页面里放一台 6.3 英寸的「手机」（402 × 874pt，与当前标准款 iPhone 的逻辑分辨率一致），
 * 选择器固定用底部面板，并挂进手机屏幕里，不用切换设备也能试分步选择、字母索引、点步骤回退。
 */
export default function RegionPickerMobileDemo() {
  const screenRef = React.useRef<HTMLDivElement>(null)
  const [code, setCode] = React.useState<string | null>(null)

  return (
    <div className="max-w-full rounded-[3.875rem] border border-edge bg-muted p-2 shadow-lg max-sm:contents">
      {/* 屏幕：relative + overflow-clip，让底部面板和遮罩只盖住它；clip 不像 hidden 那样能被滚动。
          页面比手机窄时（真在手机上看）随宽度收窄 */}
      <div
        ref={screenRef}
        className="relative flex aspect-[402/874] w-[402px] max-w-full flex-col overflow-clip rounded-[3.375rem] bg-background max-sm:aspect-auto max-sm:h-[calc(100dvh-3rem)] max-sm:w-full max-sm:rounded-none"
      >
        {/* 状态栏 54pt，灵动岛 126 × 37pt；宽度按屏幕比例取，页面比手机窄时一起收窄 */}
        <div className="relative flex h-[54px] shrink-0 items-center justify-between px-[8%] pt-1 text-[15px] font-semibold tabular-nums max-sm:hidden">
          <span>9:41</span>
          <span
            aria-hidden="true"
            className="absolute top-[11px] left-1/2 h-[37px] w-[31%] -translate-x-1/2 rounded-full bg-foreground dark:bg-background dark:ring-1 dark:ring-border"
          />
          <span aria-hidden="true" className="flex items-center gap-1.5">
            <Signal className="size-4" strokeWidth={2.5} />
            <Wifi className="size-4" strokeWidth={2.5} />
            <BatteryFull className="size-5" />
          </span>
        </div>
        <div className="flex h-11 shrink-0 items-center gap-1 border-b border-border px-3">
          <ChevronLeft
            aria-hidden="true"
            className="size-6 text-muted-foreground"
          />
          <p className="text-[17px] font-semibold">新增收货地址</p>
        </div>

        <div className="flex flex-1 flex-col gap-2.5 px-4 pt-5">
          <label className={FIELD}>
            <span className="shrink-0 text-muted-foreground">收货人</span>
            <input defaultValue="王小明" className={FIELD_INPUT} />
          </label>
          <label className={FIELD}>
            <span className="shrink-0 text-muted-foreground">手机号</span>
            <input
              defaultValue="138 0000 0000"
              inputMode="tel"
              className={FIELD_INPUT}
            />
          </label>
          <RegionPicker
            label="所在地区"
            regions={loadRegions}
            presentation="sheet"
            container={screenRef}
            size="lg"
            value={code}
            onValueChange={setCode}
          />
          <label className={FIELD}>
            <span className="shrink-0 text-muted-foreground">详细地址</span>
            <input placeholder="街道、门牌号" className={FIELD_INPUT} />
          </label>
        </div>

        {/* 底部留出 34pt 的主屏指示条安全区 */}
        <div className="shrink-0 px-4 pt-3 pb-[34px] max-sm:pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button type="button" size="lg" className="w-full">
            保存地址
          </Button>
        </div>
        {/* 主屏指示条盖在底部面板之上，和真机一样 */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 left-1/2 z-[60] h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-foreground max-sm:hidden"
        />
      </div>
    </div>
  )
}
