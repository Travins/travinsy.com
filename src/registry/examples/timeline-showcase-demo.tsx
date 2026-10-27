import { Check, Code, Flag } from "lucide-react"
import {
  Timeline,
  TimelineItem,
  TimelineMarker,
  TimelineConnector,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
} from "@/registry/ui/timeline/timeline"

export default function TimelineShowcaseDemo() {
  return (
    <div className="flex w-full items-center justify-center bg-dots p-6">
      <Timeline
        className="max-w-xs rounded-lg border border-edge bg-background p-4"
        aria-label="组件发布进度"
      >
        <TimelineItem>
          <TimelineMarker tone="green">
            <Check />
          </TimelineMarker>
          <TimelineConnector />
          <TimelineContent className="pb-4">
            <TimelineTitle>想法，成为代码</TimelineTitle>
            <TimelineDescription>01 / 原语与接口</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem status="current">
          <TimelineMarker status="current">
            <Code />
          </TimelineMarker>
          <TimelineConnector />
          <TimelineContent className="pb-4">
            <TimelineTitle>打磨每一个细节</TimelineTitle>
            <TimelineDescription>02 / 正在构建</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem status="upcoming">
          <TimelineMarker>
            <Flag />
          </TimelineMarker>
          <TimelineContent>
            <TimelineTitle>下一站，发布</TimelineTitle>
            <TimelineDescription>03 / 保持生长</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  )
}
