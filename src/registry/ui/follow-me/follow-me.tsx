import { cn } from "@/lib/utils"

/** 放在内容容器外侧的手写标注，不参与交互和无障碍阅读。 */
function FollowMe({
  className,
  label = "follow me",
}: {
  /** 附加到根元素的样式类名 */
  className?: string
  /**
   * 手写文字内容
   * @default "follow me"
   */
  label?: string
}) {
  return (
    <div
      data-slot="follow-me"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-1 -left-32 hidden w-28 -rotate-12 text-muted-foreground lg:block",
        className,
      )}
    >
      {/* 手写体来自系统字体，用工具类表达，才能跟 className 一起被覆盖。 */}
      <span
        data-slot="follow-me-label"
        className="[font-family:Bradley_Hand,Segoe_Print,cursive] text-2xl italic"
      >
        {label}
      </span>
      <svg
        data-slot="follow-me-arrow"
        viewBox="0 0 100 60"
        fill="none"
        aria-hidden="true"
        className="ml-5 h-14 w-24"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 9C7 37 40 44 53 25c10-15-10-24-12-8-3 20 24 31 49 20M80 30l11 7-9 8" />
      </svg>
    </div>
  )
}

export { FollowMe }
