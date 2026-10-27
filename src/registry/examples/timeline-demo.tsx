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

const milestones = [
  {
    year: "2022",
    title: "从第一个页面开始",
    detail: "学习前端，把设计稿变成可以点击的界面。",
  },
  {
    year: "2024",
    title: "开始做自己的工具",
    detail: "写下开发笔记，也把反复使用的交互整理成组件。",
  },
  {
    year: "2026",
    title: "让作品持续生长",
    detail: "搭建个人站与组件库，记录每一次小而具体的进步。",
  },
]

export default function TimelineDemo() {
  return (
    <Timeline aria-label="个人经历" className="max-w-lg">
      {milestones.map((item, index) => (
        <TimelineItem
          key={item.year}
          status={index === 2 ? "current" : "done"}
          time={<TimelineTime dateTime={item.year}>{item.year}</TimelineTime>}
        >
          <TimelineMarker status={index === 2 ? "current" : "done"}>
            {String(index + 1).padStart(2, "0")}
          </TimelineMarker>
          <TimelineConnector />
          <TimelineContent>
            <TimelineTitle className="m-0! text-sm! font-medium!">
              {item.title}
            </TimelineTitle>
            <TimelineDescription>{item.detail}</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
