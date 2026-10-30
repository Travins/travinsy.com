"use client"

import { useMemo, useState } from "react"
import { Smartphone } from "lucide-react"
import { encode } from "uqr"

import { buttonVariants } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { IconTip } from "./icon-tip"

/** 开发时本机的局域网地址（next.config 注入，线上为空） */
const DEV_LAN_HOST = process.env.NEXT_PUBLIC_DEV_LAN_HOST ?? ""

/**
 * 当前页面给手机打开的地址：线上就是当前地址；开发时把 localhost 换成局域网 IP，
 * 手机连同一个 Wi‑Fi 就能扫开。去掉 hash，打开后从页首看起。
 */
function phoneUrl() {
  const target = new URL(window.location.href)
  target.hash = ""
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(target.hostname)
  if (local && DEV_LAN_HOST) target.hostname = DEV_LAN_HOST
  return target.toString()
}

/** 二维码画成一张 SVG：深色模块用前景色，外面留 4 格安静区，亮暗主题下都是浅底深码 */
function QrCode({ value, className }: { value: string; className?: string }) {
  const matrix = useMemo(() => encode(value, { ecc: "M" }).data, [value])
  const quiet = 4
  const size = matrix.length + quiet * 2
  let path = ""
  matrix.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (dark) path += `M${x + quiet} ${y + quiet}h1v1h-1z`
    }),
  )
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      className={cn(
        // 扫码需要浅底深码：暗色主题下把前景、背景对调
        "rounded-md bg-background text-foreground dark:bg-foreground dark:text-background",
        className,
      )}
    >
      <path d={path} fill="currentColor" />
    </svg>
  )
}

/** 预览框工具栏上的「手机扫码打开」：只在桌面宽度显示，手机上本来就在手机里 */
export function PreviewQrButton() {
  // 打开时才读地址：服务端没有 window，也免得在 effect 里同步状态
  const [url, setUrl] = useState("")
  const local = url.includes("localhost") || url.includes("127.0.0.1")
  return (
    <Popover onOpenChange={(open) => open && setUrl(phoneUrl())}>
      <IconTip label="手机扫码打开">
        <PopoverTrigger
          aria-label="手机扫码打开本页"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-sm" }),
            "text-muted-foreground hover:text-foreground max-md:hidden",
          )}
        >
          <Smartphone className="size-4" />
        </PopoverTrigger>
      </IconTip>
      <PopoverContent align="end" className="w-60 items-center gap-2 p-4">
        {url ? <QrCode value={url} className="size-44" /> : null}
        <p className="text-sm font-medium">手机扫码打开本页</p>
        <p className="text-center text-xs text-muted-foreground">
          {local
            ? "没有取到局域网地址，手机打不开 localhost"
            : "在真机上试触摸、软键盘与底部面板"}
        </p>
        <p className="w-full truncate text-center font-mono text-[11px] text-muted-foreground">
          {url}
        </p>
      </PopoverContent>
    </Popover>
  )
}
