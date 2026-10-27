import { FolderPlus, GitPullRequest, Rocket } from "lucide-react"

import {
  Timeline,
  TimelineAttachment,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@/registry/ui/timeline/timeline"

export default function TimelineActivityDemo() {
  return (
    <Timeline aria-label="工作动态" className="max-w-lg">
      <TimelineItem>
        <TimelineMarker tone="green">
          <Rocket />
        </TimelineMarker>
        <TimelineConnector />
        <TimelineContent>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <TimelineTitle>部署成功</TimelineTitle>
            <TimelineTime dateTime="2026-10-27T10:57:00+08:00">
              3 分钟前
            </TimelineTime>
          </div>
          <TimelineDescription>组件文档已更新到生产环境。</TimelineDescription>
          <TimelineAttachment>
            <span className="rounded-md border border-edge bg-muted/30 px-2 py-1.5 font-mono">
              build.log
              <span className="ml-2 text-muted-foreground">2.4 KB</span>
            </span>
          </TimelineAttachment>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineMarker tone="violet">
          <GitPullRequest />
        </TimelineMarker>
        <TimelineConnector />
        <TimelineContent>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <TimelineTitle>代码评审</TimelineTitle>
            <TimelineTime dateTime="2026-10-27T10:20:00+08:00">
              40 分钟前
            </TimelineTime>
          </div>
          <TimelineDescription>
            时间线组件的交互细节已确认。
          </TimelineDescription>
          <TimelineAttachment>
            <span
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] text-primary"
            >
              LC
            </span>
            <span className="text-muted-foreground">林川 · 已通过</span>
          </TimelineAttachment>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineMarker>
          <FolderPlus />
        </TimelineMarker>
        <TimelineContent>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <TimelineTitle>新建项目</TimelineTitle>
            <TimelineTime dateTime="2026-10-26">昨天</TimelineTime>
          </div>
          <TimelineDescription>开始整理下一批组件。</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}
