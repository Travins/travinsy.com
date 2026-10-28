import { cn } from "@/lib/utils"

/**
 * 统一的加载占位：撑满调用方给定的尺寸（不引起布局跳动），淡色底 + 轻微脉冲。
 * 延迟 150ms 才显示（纯 CSS，见 src/styles/docs.css），快速加载时不会一闪而过；减少动态效果时不脉冲。
 */
function PreviewSkeleton({
  className,
  label = "正在加载…",
}: {
  className?: string
  label?: string
}) {
  return (
    <div
      data-slot="preview-skeleton"
      role="status"
      className={cn("preview-skeleton size-full bg-muted/30", className)}
    >
      <span className="sr-only">{label}</span>
    </div>
  )
}
export { PreviewSkeleton }
