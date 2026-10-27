import {
  Timeline,
  TimelineItem,
  TimelineMarker,
  TimelineConnector,
  TimelineContent,
  TimelineTitle,
  TimelineTime,
  TimelineDescription,
} from "@/registry/ui/timeline/timeline"

const updates = [
  ["2026-10-27", "时间线与卡片堆叠", "用更轻的结构呈现经历、活动与作品。"],
  ["2026-10-18", "数据展示原语", "补齐指标、趋势和紧凑图表。"],
  ["2026-10-09", "主题系统更新", "让每一种颜色都适应亮暗环境。"],
]
export default function TimelineAlternateDemo() {
  return (
    <Timeline align="alternate" className="max-w-2xl" aria-label="更新日志">
      {updates.map(([date, title, detail], index) => (
        <TimelineItem key={date}>
          <TimelineMarker tone={index === 0 ? "primary" : "muted"}>
            {String(3 - index).padStart(2, "0")}
          </TimelineMarker>
          <TimelineConnector />
          <TimelineContent>
            <TimelineTime dateTime={date}>{date}</TimelineTime>
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
