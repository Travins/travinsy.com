"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
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
 * 给手机打开的地址：线上就是本站地址；开发时把 localhost 换成局域网 IP，
 * 手机连同一个 Wi‑Fi 就能扫开。
 */
function phoneUrl(path: string) {
  const target = new URL(path, window.location.origin)
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

/**
 * 预览框工具栏上的「手机体验」：指向这个示例的全屏页（/demo/<示例名>/），打开后只有这一个示例。
 * 桌面上点开是二维码，用手机扫；手机上已经在手机里了，点一下直接进全屏页
 */
export function PreviewQrButton({ name }: { name: string }) {
  // 打开时才读地址：服务端没有 window，也免得在 effect 里同步状态
  const [url, setUrl] = useState("")
  const local = url.includes("localhost") || url.includes("127.0.0.1")
  return (
    <>
      <IconTip label="全屏体验">
        <Link
          href={`/demo/${name}/`}
          aria-label="全屏体验这个示例"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-sm" }),
            "text-muted-foreground hover:text-foreground md:hidden",
          )}
        >
          <Smartphone className="size-4" />
        </Link>
      </IconTip>
      <Popover
        onOpenChange={(open) => open && setUrl(phoneUrl(`/demo/${name}/`))}
      >
        <IconTip label="手机扫码体验">
          <PopoverTrigger
            aria-label="手机扫码体验这个示例"
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
          <p className="text-sm font-medium">手机扫码体验这个示例</p>
          <p className="text-center text-xs text-muted-foreground">
            {local
              ? "没有取到局域网地址，手机打不开 localhost"
              : "在真机上试触摸、软键盘与底部面板"}
          </p>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="w-full truncate text-center font-mono text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {url}
          </a>
        </PopoverContent>
      </Popover>
    </>
  )
}
