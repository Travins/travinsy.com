import { Check, Code, Flag } from "lucide-react"
import {
  Timeline,
  TimelineItem,
  TimelineMarker,
  TimelineConnector,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
  type TimelineStatus,
} from "@/registry/ui/timeline/timeline"

const steps = [
  {
    title: "需求整理",
    detail: "已完成 · 明确范围与交付清单",
    icon: Check,
    status: "done",
  },
  {
    title: "组件实现",
    detail: "进行中 · 补齐键盘与移动端交互",
    icon: Code,
    status: "current",
  },
  {
    title: "发布上线",
    detail: "待开始 · 构建、检查与文档验收",
    icon: Flag,
    status: "upcoming",
  },
] as const
export default function TimelineProgressDemo() {
  return (
    <Timeline className="max-w-md" aria-label="项目进度">
      {steps.map(({ title, detail, icon: Icon, status }) => (
        <TimelineItem key={title} status={status as TimelineStatus}>
          <TimelineMarker
            status={status}
            tone={status === "done" ? "green" : "primary"}
          >
            <Icon />
          </TimelineMarker>
          <TimelineConnector />
          <TimelineContent>
            <TimelineTitle className="m-0! text-sm! font-medium!">
              {title}
            </TimelineTitle>
            <TimelineDescription>{detail}</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
