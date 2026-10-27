import type * as React from "react"

import { cn } from "@/lib/utils"

// 站点标志：抽象「易」——上三道细斜杠是「日」，下三道粗斜杠是「勿」，右端齐平贯穿。
// 上组跟前景色（currentColor），下组跟主题色（primary）。源稿见 design/logo/final-yi-bars/
export function SiteLogo({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 416 584"
      fill="currentColor"
      aria-hidden="true"
      className={cn("h-8 w-auto overflow-visible", className)}
      {...props}
    >
      <path
        data-part="upper"
        d="M156 130 416 0 416 36 156 166ZM156 192 416 62 416 98 156 228ZM156 254 416 124 416 160 156 290Z"
      />
      <path
        data-part="lower"
        className="fill-primary"
        d="M0 394 416 186 416 258 0 466ZM78 453 416 284 416 356 78 525ZM156 512 416 382 416 454 156 584Z"
      />
    </svg>
  )
}
