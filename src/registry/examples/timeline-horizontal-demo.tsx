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

const releases = [
  ["v0.1", "原语搭建", "2026-08", "done"],
  ["v0.5", "组件文档", "2026-09", "done"],
  ["v0.9", "交互打磨", "2026-10", "current"],
  ["v1.0", "正式发布", "2026-12", "upcoming"],
] as const
export default function TimelineHorizontalDemo() {
  return (
    <Timeline
      orientation="horizontal"
      className="max-w-2xl"
      aria-label="版本路线图"
    >
      {releases.map(([version, title, date, status]) => (
        <TimelineItem key={version} status={status}>
          <TimelineMarker status={status}>{version.slice(1)}</TimelineMarker>
          <TimelineConnector />
          <TimelineContent>
            <TimelineTime dateTime={date}>{date}</TimelineTime>
            <TimelineTitle className="m-0! text-sm! font-medium!">
              {version} · {title}
            </TimelineTitle>
            <TimelineDescription>
              {status === "done"
                ? "已发布"
                : status === "current"
                  ? "正在构建"
                  : "计划中"}
            </TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
