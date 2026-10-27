import {
  GridColumns,
  GridContainer,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"

// 圆点取自 --flow-* 色调，与主题色无关，亮暗模式下都清楚
const PROJECTS = [
  { name: "线条网格", note: "页面骨架，一次到位。", tag: "UI", tone: "blue" },
  {
    name: "流程图示",
    note: "会动的请求链路图。",
    tag: "Diagram",
    tone: "violet",
  },
  { name: "实时时间", note: "时区、时差与表盘。", tag: "Time", tone: "amber" },
] as const

const NOTES = [
  { date: "2026.10", title: "为什么我用线条而不是卡片排版" },
  { date: "2026.08", title: "把博客改成纯静态导出的几个坑" },
]

/** 一屏作品集首页缩影：标题区、点阵与刻度尺分隔带、三栏项目与笔记列表，只用五个布局原语搭成。 */
export default function GridLayoutDemo() {
  return (
    <GridContainer className="bg-background [--grid-width:40rem]">
      <GridSection className="px-4 py-4 sm:px-6 sm:py-5" crosshair>
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-xs tracking-[0.08em] whitespace-nowrap text-muted-foreground">
            TRAVINS / 2026
          </p>
          <span className="flex items-center gap-1.5 rounded-full border border-edge px-2 py-0.5 text-[11px] whitespace-nowrap text-muted-foreground">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-(--flow-green)"
            />
            接受新项目
          </span>
        </div>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">
          让内容，落在线条之间。
        </h3>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          独立开发者，做界面与组件。
        </p>
      </GridSection>

      <GridSeparator label="01 / PROJECTS" />
      <GridSection>
        <GridColumns className="sm:grid-cols-3">
          {PROJECTS.map(({ name, note, tag, tone }) => (
            <article
              key={name}
              className="flex flex-col gap-1 px-4 py-3.5 max-sm:flex-row max-sm:items-center max-sm:gap-3 max-sm:py-2.5 sm:px-5"
            >
              <p className="flex w-20 shrink-0 items-center gap-1.5 font-mono text-[11px] text-muted-foreground sm:w-auto">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: `var(--flow-${tone})` }}
                />
                {tag}
              </p>
              <h4 className="text-sm font-medium">{name}</h4>
              <p className="text-xs leading-5 text-muted-foreground max-sm:hidden">
                {note}
              </p>
            </article>
          ))}
        </GridColumns>
      </GridSection>

      <GridSeparator pattern="ruler" label="02 / NOTES" />
      <GridSection className="divide-y divide-dashed divide-edge">
        {NOTES.map(({ date, title }, index) => (
          <div
            key={title}
            className={`flex items-baseline gap-4 px-4 py-2.5 sm:px-6 ${index > 0 ? "max-sm:hidden" : ""}`}
          >
            <time className="shrink-0 font-mono text-xs text-muted-foreground">
              {date}
            </time>
            <span className="min-w-0 truncate text-sm">{title}</span>
          </div>
        ))}
      </GridSection>
    </GridContainer>
  )
}
