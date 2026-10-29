import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const amountInputControlVariants = cva(
  "flex w-full min-w-0 items-center gap-1.5 rounded-lg border bg-transparent transition-colors dark:bg-input/30",
  {
    variants: {
      // 高度只来自既有三档：28 / 32 / 36px
      size: {
        sm: "h-7 px-2 text-base md:text-sm",
        default: "h-8 px-2.5 text-base md:text-sm",
        lg: "h-9 px-3 text-base",
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
