import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@/registry/ui/timeline/timeline"

const UPDATES = [
  {
    date: "2026-10-27",
    title: "时间线与卡片堆叠",
    detail: "用更轻的结构呈现经历、活动与作品。",
  },
  {
    date: "2026-10-18",
    title: "数据展示原语",
    detail: "补齐指标、趋势和紧凑图表。",
  },
  {
    date: "2026-10-09",
    title: "主题系统更新",
    detail: "让每一种颜色都适应亮暗环境。",
  },
]

export default function TimelineAlternateDemo() {
  return (
    <Timeline align="alternate" aria-label="更新日志" className="max-w-2xl">
      {UPDATES.map(({ date, title, detail }, index) => (
        <TimelineItem key={date}>
          <TimelineMarker tone={index === 0 ? "primary" : "muted"} />
          <TimelineConnector />
          <TimelineContent>
            <TimelineTime dateTime={date}>{date}</TimelineTime>
            <TimelineTitle>{title}</TimelineTitle>
            <TimelineDescription>{detail}</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
