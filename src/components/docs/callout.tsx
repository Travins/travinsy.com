import { cva, type VariantProps } from "class-variance-authority"
import { Info, Lightbulb, TriangleAlert } from "lucide-react"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

const calloutVariants = cva(
  "not-prose my-4 flex gap-3 rounded-xl border p-4 text-[13px] leading-6 [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded [&_code]:border [&_code]:border-edge [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8125rem] [&_p+p]:mt-2",
  {
    variants: {
      variant: {
        default: "border-edge bg-muted/40",
        tip: "border-primary/25 bg-primary/5",
        warning: "border-destructive/30 bg-destructive/5",
      },
    },
    defaultVariants: { variant: "default" },
  },
)

const calloutIcons = {
  default: { Icon: Info, className: "text-muted-foreground" },
  tip: { Icon: Lightbulb, className: "text-primary" },
  warning: { Icon: TriangleAlert, className: "text-destructive" },
} as const

/**
 * 文档提示卡片：默认用于补充说明，`tip` 用于推荐做法，`warning` 用于容易踩的坑。
 * 颜色全部来自主题变量，类型靠图标 + 标题区分，不只靠颜色。
 */
function Callout({
  className,
  variant = "default",
  title,
  children,
  ...props
}: ComponentProps<"div"> &
  VariantProps<typeof calloutVariants> & {
    /** 卡片标题；不传则只显示正文 */
    title?: string
  }) {
  const { Icon, className: iconClassName } = calloutIcons[variant ?? "default"]
  return (
    <div
      data-slot="callout"
      data-variant={variant}
      role="note"
      className={cn(calloutVariants({ variant }), className)}
      {...props}
    >
      <Icon
        aria-hidden="true"
        className={cn("mt-0.5 size-4 shrink-0", iconClassName)}
      />
      <div className="min-w-0 flex-1">
        {title ? (
          <p className="mb-1 font-medium text-foreground">{title}</p>
        ) : null}
        {children}
      </div>
    </div>
  )
}

export { Callout, calloutVariants }
