import {
  GridContainer,
  GridSection,
} from "@/registry/ui/grid-layout/grid-layout"

const chapters = [
  {
    no: "01",
    title: "起点",
    body: "从一个只有首页的个人站开始，先把线条与留白定下来。",
  },
  {
    no: "02",
    title: "抽象",
    body: "反复出现的结构收成五个原语，再往上搭组件与区块。",
  },
  {
    no: "03",
    title: "发布",
    body: "整理成 registry，用一条命令装进任何 shadcn 项目。",
  },
]

export default function GridSectionSidebarDemo() {
  return (
    <GridContainer className="bg-background [--grid-width:32rem]">
      {chapters.map(({ no, title, body }) => (
        <GridSection
          key={no}
          className="grid md:grid-cols-[9rem_1fr] md:divide-x md:divide-edge"
        >
          {/* 编号栏：窄屏移到标题上方，宽屏用竖线与内容隔开 */}
          <div className="px-4 pt-4 sm:px-6 md:py-5">
            <p className="font-mono text-xs tracking-[0.08em] text-muted-foreground">
              {no}
            </p>
            <h4 className="mt-1 font-medium">{title}</h4>
          </div>
          <p className="px-4 pt-1 pb-4 text-sm leading-7 text-muted-foreground sm:px-6 md:py-5">
            {body}
          </p>
        </GridSection>
      ))}
    </GridContainer>
  )
}
