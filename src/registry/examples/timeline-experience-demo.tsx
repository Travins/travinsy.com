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

const EXPERIENCE = [
  {
    year: "2026",
    title: "维护个人站与组件库",
    detail: "把反复写的交互整理成可以安装的组件。",
  },
  {
    year: "2024",
    title: "独立开发",
    detail: "接前端外包，也维护几个开源小项目，主要用 React 和 Next.js。",
  },
  {
    year: "2021",
    title: "前端工程师",
    detail: "在一个数据产品团队，负责仪表盘和图表组件。",
  },
  {
    year: "2019",
    title: "开始写代码",
    detail: "从一个静态博客开始。",
  },
]

export default function TimelineExperienceDemo() {
  return (
    <Timeline aria-label="个人经历" className="max-w-md">
      {EXPERIENCE.map(({ year, title, detail }) => (
        <TimelineItem
          key={year}
          time={<TimelineTime dateTime={year}>{year}</TimelineTime>}
        >
          <TimelineMarker />
          <TimelineConnector />
          <TimelineContent>
            <TimelineTitle>{title}</TimelineTitle>
            <TimelineDescription>{detail}</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
