import { FollowMe } from "@/registry/ui/follow-me/follow-me"

export default function FollowMeDemo() {
  return (
    <div className="w-full max-w-sm">
      {/* 演示里改成静态定位，真实页面上它绝对定位在内容容器左侧 */}
      <FollowMe className="static mx-auto block rotate-0" />
      <div className="mt-2 flex items-center gap-2 rounded-md border border-edge bg-muted/30 px-4 py-3">
        <span className="size-8 rounded-md border border-edge bg-background" />
        <span className="size-8 rounded-md border border-edge bg-background" />
        <span className="size-8 rounded-md border border-edge bg-background" />
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">
          社交链接
        </span>
      </div>
    </div>
  )
}
