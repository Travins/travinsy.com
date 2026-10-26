import {
  GridColumns,
  GridContainer,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"

/** 一屏作品集首页：标题区、带编号的分隔带、分栏卡片与列表，全靠五个原语搭出来。 */
export default function GridLayoutDemo() {
  return (
    <GridContainer className="bg-background [--grid-width:40rem]">
      <GridSection className="px-4 py-8 sm:px-6" crosshair>
        <p className="font-mono text-xs tracking-[0.08em] text-muted-foreground">
          TRAVINS / 2026
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">
          让内容，落在线条之间。
        </h3>
        <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
          独立开发者，做界面、组件与文档。这一页只用了五个布局原语。
        </p>
      </GridSection>

      <GridSeparator label="01 / PROJECTS" />
      <GridSection>
        <GridColumns>
          {projects.map(({ name, note, tag }) => (
            <article key={name} className="p-4 sm:p-6">
              <p className="font-mono text-[11px] text-muted-foreground">
                {tag}
              </p>
              <h4 className="mt-2 font-medium">{name}</h4>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {note}
              </p>
            </article>
          ))}
        </GridColumns>
      </GridSection>

      <GridSeparator pattern="ruler" label="02 / NOTES" />
      <GridSection className="divide-y divide-dashed divide-edge">
        {notes.map(({ date, title }) => (
          <div
            key={title}
            className="flex items-baseline gap-4 px-4 py-3 sm:px-6"
          >
            <time className="shrink-0 font-mono text-xs text-muted-foreground">
              {date}
            </time>
            <span className="text-sm">{title}</span>
          </div>
        ))}
      </GridSection>
    </GridContainer>
  )
}

const projects = [
  {
    name: "线条网格",
    note: "竖线容器、全宽横线与分隔带，页面骨架一次到位。",
    tag: "UI",
  },
  {
    name: "流程图示",
    note: "把请求链路画成会动的节点图，文档里直接嵌入。",
    tag: "Diagram",
  },
]

const notes = [
  { date: "2026.10", title: "为什么我用线条而不是卡片排版" },
  { date: "2026.08", title: "把博客改成纯静态导出的几个坑" },
  { date: "2026.05", title: "写一个能直接复制的组件库" },
]
