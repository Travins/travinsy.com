import type { ReactNode } from "react"

import { BentoCard, BentoFlowPreview } from "@/components/home/bento-card"
import { profile } from "@/config/profile"
import { entryTitleEn } from "@/lib/source"
import IsometricMarkDemo from "@/registry/examples/isometric-mark-demo"
import { GreetingCard } from "@/registry/ui/greeting/greeting"
import { AnalogClock, LocalTime } from "@/registry/ui/local-time/local-time"
import {
  GridColumns,
  GridContainer,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"
import registry from "../../../registry.json"

type FeaturedSize = (typeof profile.featuredComponents)[number]["size"]

/** 各尺寸在网格里占的格子：宽屏三列，平板两列，手机单列。 */
const cellClass: Record<FeaturedSize, string> = {
  lead: "md:col-span-2 lg:row-span-2",
  tall: "lg:row-span-2",
  cell: "",
}
/** 窄屏下预览区的高度；宽屏由网格的行高撑满。 */
const previewClass: Record<FeaturedSize, string> = {
  lead: "h-64 sm:h-72 lg:h-auto",
  tall: "h-60 lg:h-auto",
  cell: "h-52 lg:h-auto",
}

const CLOCK_ZONES = [
  { label: "上海", timeZone: "Asia/Shanghai" },
  { label: "纽约", timeZone: "America/New_York" },
]

/** 点阵底纹向四周淡出，让预览像摆在图纸上。 */
function DotsBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
    />
  )
}

/** 两只不同时区的表盘，下方是当地时间。 */
function LocalTimePreview() {
  return (
    <div className="relative flex size-full items-center justify-center gap-6 px-4">
      <DotsBackdrop />
      {CLOCK_ZONES.map(({ label, timeZone }) => (
        <figure key={timeZone} className="relative flex flex-col items-center gap-2">
          <AnalogClock
            timeZone={timeZone}
            label={label}
            className="size-24 sm:size-28"
          />
          <figcaption className="flex flex-col items-center gap-0.5 font-mono text-[10px] text-muted-foreground">
            <span>{label}</span>
            <LocalTime
              timeZone={timeZone}
              showSeconds={false}
              showDifference={false}
              className="text-xs text-foreground"
            />
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

/** 线条网格的一个片段：竖线容器、刻度尺与斜纹分隔带、虚线分栏和交点十字。 */
function GridLayoutPreview() {
  return (
    <GridContainer className="h-full bg-background/70 [--grid-width:15rem]">
      <GridSection className="px-4 py-4" crosshair>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground">
          GRID LAYOUT
        </p>
        <p className="mt-1.5 text-base font-semibold tracking-tight">
          让内容，落在线条之间。
        </p>
      </GridSection>
      <GridSeparator pattern="ruler" />
      <GridSection>
        <GridColumns className="grid-cols-2 divide-x divide-y-0">
          <p className="p-3 text-xs font-medium">清晰的结构</p>
          <p className="p-3 text-xs font-medium">恰好的留白</p>
        </GridColumns>
      </GridSection>
      <GridSeparator pattern="hatch" />
    </GridContainer>
  )
}

/** 本站标志挤出成等轴测线条 3D，悬停出高光。 */
function IsometricMarkPreview() {
  return (
    <div className="relative flex size-full items-center justify-center p-4">
      <DotsBackdrop />
      <div className="relative w-full max-w-64">
        <IsometricMarkDemo />
      </div>
    </div>
  )
}

/** 问候卡：色调与时段图标随访客时间变化；窄格里省掉四时段指示条。 */
function GreetingPreview() {
  return (
    <div className="relative flex size-full items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-hatch opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]"
      />
      <GreetingCard
        name="Travins"
        showPeriods={false}
        className="relative w-[min(100%-2rem,22rem)] shadow-xs"
      />
    </div>
  )
}

const previews: Record<string, ReactNode> = {
  "flow-diagram": <BentoFlowPreview />,
  "isometric-mark": <IsometricMarkPreview />,
  "local-time": <LocalTimePreview />,
  "grid-layout": <GridLayoutPreview />,
  greeting: <GreetingPreview />,
}

/** 精选卡片标题：英文名为主（更直观），中文名小一号放在下一行；没有英文名时只显示中文。 */
function EntryTitle({ name, title }: { name: string; title: string }) {
  const titleEn = entryTitleEn("components", name)
  if (!titleEn) return <>{title}</>
  return (
    <>
      <span lang="en" translate="no">
        {titleEn}
      </span>
      <span className="mt-0.5 block text-[13px] font-normal text-muted-foreground">
        {title}
      </span>
    </>
  )
}

/**
 * 首页「精选组件」：Bento 网格，每张卡都是组件的实时预览，整张卡链接到文档。
 * 单元格自带右、下边线，再用负外边距把最外一圈挤出裁剪区，避免和容器的线叠成双线。
 */
function FeaturedBento() {
  // 标题来自 Registry，保持与文档、安装产物同源。
  const items = profile.featuredComponents.map(({ name, size }) => {
    const item = registry.items.find((entry) => entry.name === name)
    if (!item) throw new Error(`未登记的 Registry 条目：${name}`)
    const preview = previews[name]
    if (!preview) throw new Error(`精选组件缺少首页预览：${name}`)
    return { item, size, preview }
  })

  return (
    <div className="overflow-hidden">
      <ul className="-mr-px -mb-px grid grid-cols-1 md:grid-cols-2 lg:auto-rows-[18rem] lg:grid-cols-3">
        {items.map(({ item, size, preview }) => (
          <li
            key={item.name}
            className={`min-w-0 border-r border-b border-edge ${cellClass[size]}`}
          >
            <BentoCard
              href={`/components/${item.name}/`}
              preview={preview}
              previewClassName={previewClass[size]}
            >
              <EntryTitle name={item.name} title={item.title} />
            </BentoCard>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { FeaturedBento }
