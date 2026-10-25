import { cn } from "@/lib/utils"

/** 放在内容容器外侧的手写标注，不参与交互和无障碍阅读。 */
export function FollowMe({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-1 -left-32 hidden w-28 -rotate-12 text-muted-foreground lg:block",
        className,
      )}
    >
      <span
        className="text-2xl italic"
        style={{ fontFamily: '"Bradley Hand", "Segoe Print", cursive' }}
      >
        follow me
      </span>
      <svg
        viewBox="0 0 100 60"
        fill="none"
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
