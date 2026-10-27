import type { ReactNode } from "react"

import { BentoCard, BentoFlowPreview } from "@/components/home/bento-card"
import { profile } from "@/config/profile"
import { entryTitleEn } from "@/lib/source"
import IsometricMarkShowcaseDemo from "@/registry/examples/isometric-mark-showcase-demo"
import { GreetingCard } from "@/registry/ui/greeting/greeting"
import { AnalogClock, LocalTime } from "@/registry/ui/local-time/local-time"
import registry from "../../../registry.json"

type FeaturedSize = (typeof profile.featuredComponents)[number]["size"]

/** 各尺寸在网格里占的格子：宽屏六列（lead 4×2、tall 2×2、cell 各占半行），平板两列（lead、tall 通栏），手机单列。 */
const cellClass: Record<FeaturedSize, string> = {
  lead: "md:col-span-2 lg:col-span-4 lg:row-span-2",
  tall: "md:col-span-2 lg:col-span-2 lg:row-span-2",
  cell: "lg:col-span-3",
}
/** 窄屏下预览区的高度；宽屏由网格的行高撑满。 */
const previewClass: Record<FeaturedSize, string> = {
  lead: "h-64 sm:h-72 lg:h-auto",
  tall: "h-60 md:h-64 lg:h-auto",
  cell: "h-80 md:h-88 lg:h-auto",
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
    <div className="relative flex size-full items-center justify-center gap-8 px-6 py-10 sm:gap-14 md:gap-8 lg:gap-16">
      <DotsBackdrop />
      {CLOCK_ZONES.map(({ label, timeZone }) => (
        <figure key={timeZone} className="relative flex flex-col items-center gap-3">
          <AnalogClock
            timeZone={timeZone}
            label={label}
            className="size-20 sm:size-24 md:size-20 lg:size-28"
          />
          <figcaption className="flex flex-col items-center gap-0.5 font-mono text-[11px] text-muted-foreground">
            <span>{label}</span>
            <LocalTime
              timeZone={timeZone}
              showSeconds={false}
              showDifference={false}
              className="text-sm text-foreground"
            />
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

/** 本站标志挤出成等轴测线条 3D，悬停出高光。 */
function IsometricMarkPreview() {
  return (
    <div className="relative size-full p-4">
      <IsometricMarkShowcaseDemo />
    </div>
  )
}

/** 问候：去掉卡片外框，内容直接铺在格子里；色调与时段图标随访客时间变化，底部是四时段指示条。 */
function GreetingPreview() {
  return (
    <div className="relative flex size-full items-center px-6 py-10 sm:px-10 lg:px-12">
      <GreetingCard
        name="Travins"
        className="w-full max-w-md overflow-visible rounded-none border-0 bg-transparent p-0"
      />
    </div>
  )
}

const previews: Record<string, ReactNode> = {
  "flow-diagram": <BentoFlowPreview />,
  "isometric-mark": <IsometricMarkPreview />,
  "local-time": <LocalTimePreview />,
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
 * 首页「精选组件」：Bento 网格，每张卡都是组件的实时预览，可以直接操作；卡片底部的标题行链接到文档。
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
      <ul className="-mr-px -mb-px grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:grid-rows-[17rem_17rem_22rem]">
        {items.map(({ item, size, preview }) => (
          <li
            key={item.name}
            className={`min-w-0 border-r border-b border-edge ${cellClass[size]}`}
          >
            <BentoCard
              href={`/components/${item.name}/`}
              label={`${item.title}演示`}
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
