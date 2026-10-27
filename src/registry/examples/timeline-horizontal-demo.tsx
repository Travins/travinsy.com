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

const RELEASES = [
  {
    version: "v0.1",
    title: "原语搭建",
    date: "2026-08",
    note: "已发布",
    status: "done",
  },
  {
    version: "v0.5",
    title: "组件文档",
    date: "2026-09",
    note: "已发布",
    status: "done",
  },
  {
    version: "v0.9",
    title: "交互打磨",
    date: "2026-10",
    note: "正在构建",
    status: "current",
  },
  {
    version: "v1.0",
    title: "正式发布",
    date: "2026-12",
    note: "计划中",
    status: "upcoming",
  },
] as const

export default function TimelineHorizontalDemo() {
  return (
    <Timeline
      orientation="horizontal"
      aria-label="版本路线图"
      className="max-w-2xl"
    >
      {RELEASES.map(({ version, title, date, note, status }) => (
        <TimelineItem key={version} status={status}>
          <TimelineMarker status={status}>{version.slice(1)}</TimelineMarker>
          <TimelineConnector />
          <TimelineContent>
            <TimelineTime dateTime={date}>{date}</TimelineTime>
            <TimelineTitle>
              {version} · {title}
            </TimelineTitle>
            <TimelineDescription>{note}</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
