import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * 输入框是一条方条：与方条开关、分段选择同一套外观（浅灰底、细边框、标签在条内左侧），
 * 放进同一个面板里能对齐。高度只来自既有三档：28 / 32 / 36px；
 * 手机上字号保持 16px，iOS 聚焦时才不会自动放大页面
 */
const amountInputControlVariants = cva(
  "flex w-full min-w-0 cursor-text items-center gap-1.5 rounded-md border bg-muted/60 px-3 transition-colors",
  {
    variants: {
      size: {
        sm: "h-7 text-base md:text-xs",
        default: "h-8 text-base md:text-sm",
        lg: "h-9 text-base md:text-sm",
      },
    },
    defaultVariants: { size: "default" },
  },
)

function AmountInputReadout({
  className,
  uppercase,
  uppercaseId,
  uppercaseLabel,
  placeholder,
  showUppercase,
  approximate,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** 人民币大写；空串时显示 `placeholder` */
  uppercase: string
  uppercaseId: string
  uppercaseLabel: string
  placeholder: string
  showUppercase: boolean
  /** 大数估读，如「约 1.2万」；空串不显示 */
  approximate: string
}) {
  return (
    <div
      data-slot="amount-input-readout"
      className={cn(
        "flex items-start justify-between gap-x-3 gap-y-0.5 rounded-md border border-dashed border-edge bg-muted/30 px-2.5 py-1.5 text-xs max-sm:flex-wrap",
        className,
      )}
      {...props}
    >
      {showUppercase && (
        <p
          id={uppercaseId}
          data-slot="amount-input-uppercase"
          className="min-w-0 flex-1 leading-5 break-words"
        >
          <span className="mr-2 text-muted-foreground">{uppercaseLabel}</span>
          {uppercase ? (
            <span className="font-medium text-foreground">{uppercase}</span>
          ) : (
            <span className="text-muted-foreground/70">{placeholder}</span>
          )}
        </p>
      )}
      {approximate && (
        <p
          data-slot="amount-input-approximate"
          className="shrink-0 leading-5 text-muted-foreground tabular-nums"
        >
          {approximate}
        </p>
      )}
    </div>
  )
}

export { AmountInputReadout, amountInputControlVariants }
