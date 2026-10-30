"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RegionPicker } from "@/registry/ui/region-picker/region-picker"

const loadRegions = () =>
  import("@/registry/lib/china-regions").then((m) => m.chinaRegions)

/**
 * 手机上的体验：在桌面页面里放一台「手机」，选择器固定用底部面板，并挂进手机屏幕里，
 * 不用切换设备也能试分步选择、字母索引、点步骤回退。
 */
export default function RegionPickerMobileDemo() {
  const screenRef = React.useRef<HTMLDivElement>(null)
  const [code, setCode] = React.useState<string | null>(null)

  return (
    <div className="rounded-[2.5rem] border border-edge bg-muted p-2 shadow-lg">
      {/* 屏幕：relative + overflow-clip，让底部面板和遮罩只盖住它；clip 不像 hidden 那样能被滚动 */}
      <div
        ref={screenRef}
        className="relative flex h-[600px] w-[300px] flex-col overflow-clip rounded-[2rem] bg-background"
      >
        <div className="flex h-9 shrink-0 items-center justify-between px-6 font-mono text-[11px] font-medium">
          <span>9:41</span>
          <span
            aria-hidden="true"
            className="h-4 w-16 rounded-full bg-foreground/90"
          />
          <span>5G</span>
        </div>
        <div className="flex h-11 shrink-0 items-center gap-1 border-b border-border px-2">
          <ChevronLeft
            aria-hidden="true"
            className="size-5 text-muted-foreground"
          />
          <p className="text-[15px] font-medium">新增收货地址</p>
        </div>

        <div className="flex flex-1 flex-col gap-4 px-4 pt-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="mobile-consignee" className="text-xs font-medium">
              收货人
            </label>
            <Input
              id="mobile-consignee"
              defaultValue="王小明"
              className="h-9"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="mobile-region" className="text-xs font-medium">
              所在地区
            </label>
            <RegionPicker
              id="mobile-region"
              regions={loadRegions}
              presentation="sheet"
              container={screenRef}
              size="lg"
              value={code}
              onValueChange={setCode}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="mobile-detail" className="text-xs font-medium">
              详细地址
            </label>
            <Input
              id="mobile-detail"
              placeholder="街道、门牌号"
              className="h-9"
            />
          </div>
        </div>

        <div className="shrink-0 px-4 pb-6">
          <Button type="button" size="lg" className="w-full">
            保存地址
          </Button>
        </div>
      </div>
    </div>
  )
}
