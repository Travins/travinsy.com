import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/lib/utils"

/** 有明确名称和键盘焦点的图标链接方块。 */
export function IconLink({
  label,
  children,
  className,
  ...props
}: ComponentProps<"a"> & { label: string; children: ReactNode }) {
  return (
    <a
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-md border border-edge bg-muted/30 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring [&_svg]:size-5",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true">{children}</span>
    </a>
  )
}
