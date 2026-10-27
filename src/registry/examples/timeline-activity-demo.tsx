import { FileText, GitPullRequest, Rocket } from "lucide-react"
import {
  Timeline,
  TimelineItem,
  TimelineMarker,
  TimelineConnector,
  TimelineContent,
  TimelineTitle,
  TimelineTime,
  TimelineDescription,
  TimelineAttachment,
} from "@/registry/ui/timeline/timeline"

export default function TimelineActivityDemo() {
  return (
    <div className="w-full max-w-lg rounded-lg border border-edge bg-card p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h3 className="m-0! text-sm! font-medium!">工作动态</h3>
        <span className="font-mono text-xs text-muted-foreground">
          3 条记录
        </span>
      </div>
      <Timeline aria-label="工作动态">
        <TimelineItem>
          <TimelineMarker tone="green">
            <Rocket />
          </TimelineMarker>
          <TimelineConnector />
          <TimelineContent>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <TimelineTitle className="m-0! text-sm! font-medium!">
                部署成功
              </TimelineTitle>
              <TimelineTime dateTime="2026-10-27T10:57:00+08:00">
                3 分钟前
              </TimelineTime>
            </div>
            <TimelineDescription>
              组件文档已更新至生产环境。
            </TimelineDescription>
            <TimelineAttachment>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-edge bg-muted/30 px-2 py-1.5 font-mono">
                <FileText
                  className="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                build.log<span className="text-muted-foreground">2.4 KB</span>
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
              <TimelineTitle className="m-0! text-sm! font-medium!">
                代码评审
              </TimelineTitle>
              <TimelineTime dateTime="2026-10-27T10:20:00+08:00">
                40 分钟前
              </TimelineTime>
            </div>
            <TimelineDescription>
              时间线组件的交互细节已确认。
            </TimelineDescription>
            <TimelineAttachment>
              <div className="flex items-center gap-2.5 rounded-md border border-edge bg-muted/20 px-3 py-2">
                <span
                  className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-mono text-primary"
                  aria-hidden="true"
                >
                  LC
                </span>
                <div>
                  <p className="font-medium">林川</p>
                  <p className="mt-0.5 text-muted-foreground">
                    前端开发 · 已通过
                  </p>
                </div>
              </div>
            </TimelineAttachment>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineMarker tone="primary">03</TimelineMarker>
          <TimelineContent>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <TimelineTitle className="m-0! text-sm! font-medium!">
                新建项目
              </TimelineTitle>
              <TimelineTime dateTime="2026-10-26">昨天</TimelineTime>
            </div>
            <TimelineDescription>
              和小伙伴一起整理下一批组件。
            </TimelineDescription>
            <TimelineAttachment>
              <div
                className="flex -space-x-1.5"
                aria-label="参与者：林川、许言、周宁"
              >
                <span className="flex size-7 items-center justify-center rounded-full border-2 border-card bg-secondary font-mono text-[10px]">
                  LC
                </span>
                <span className="flex size-7 items-center justify-center rounded-full border-2 border-card bg-primary/10 font-mono text-[10px] text-primary">
                  XY
                </span>
                <span className="flex size-7 items-center justify-center rounded-full border-2 border-card bg-muted font-mono text-[10px]">
                  ZN
                </span>
              </div>
              <span className="text-muted-foreground">3 人协作</span>
            </TimelineAttachment>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  )
}
