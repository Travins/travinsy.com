import type { ReactNode } from "react"

import { BentoCard } from "@/components/home/bento-card"
import { EntryTitle } from "@/components/home/entry-title"
import { PreviewBackdrop } from "@/components/docs/preview-backdrop"
import { profile } from "@/config/profile"
import { cn } from "@/lib/utils"
import AngleDialDemo from "@/registry/examples/angle-dial-demo"
import GlobeDemo from "@/registry/examples/globe-demo"
import GlyphFieldDemo from "@/registry/examples/glyph-field-demo"
import XyPadDemo from "@/registry/examples/xy-pad-demo"
import registry from "../../../registry.json"

type FeaturedSize = (typeof profile.featuredComponents)[number]["size"]

/**
 * 各尺寸在网格里占的格子：宽屏六列两行（上行 2+4、下行 3+3；视口不足 1100px 时下行的拖拽板堆叠成上下两段，行高加大），平板两列各占一格，手机单列。
 * `side` 是上行窄的那张卡片，`wide` 是上行的满幅大图，`half` 是下行平分的两张。
 */
const cellClass: Record<FeaturedSize, string> = {
  side: "lg:col-span-2",
  wide: "lg:col-span-4",
  half: "lg:col-span-3",
}
/** 窄屏下预览区至少多高；卡片类示例由内容撑开，满幅示例给一个固定画框。宽屏由网格行高撑满。 */
const previewMinClass: Record<FeaturedSize, string> = {
  side: "",
  wide: "min-h-80",
  half: "",
}

/**
 * 本身就是满幅背景的示例：铺满格子、去掉自身的圆角与边框。
 * `*:` 作用在示例根元素上，`**:data-[slot=…]` 让示例里固定高度的画布跟着撑满。
 */
const fillClasses: Record<string, string> = {
  // 窄屏格子只有 20rem 高：地球往右下角挪，露出大半个球面，又不压到左上的指标
  globe:
    "*:h-full! *:max-w-none *:rounded-none *:border-0 max-lg:**:data-[slot=globe]:left-auto max-lg:**:data-[slot=globe]:-right-[18%] max-lg:**:data-[slot=globe]:w-[95cqh] max-lg:**:data-[slot=globe]:translate-x-0 max-lg:**:data-[slot=globe]:translate-y-[36%]",
  "glyph-field": "*:h-full *:rounded-none **:data-[slot=glyph-field]:h-full",
}

const demos: Record<string, ReactNode> = {
  "angle-dial": <AngleDialDemo />,
  globe: <GlobeDemo />,
  "xy-pad": <XyPadDemo />,
  "glyph-field": <GlyphFieldDemo />,
}

/** 预览：满幅示例铺满格子，卡片类示例居中摆在点阵底纹上。 */
function FeaturedPreview({ name }: { name: string }) {
  const demo = demos[name]
  if (!demo) throw new Error(`精选组件缺少首页预览：${name}`)
  const fill = fillClasses[name]
  if (fill)
    return <div className={cn("absolute inset-0 flex", fill)}>{demo}</div>
  return (
    <div className="relative isolate flex size-full items-center justify-center bg-muted/20 px-4 py-8 sm:px-6 lg:px-2">
      <PreviewBackdrop name={name} />
      {demo}
    </div>
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
    return { item, size }
  })

  return (
    // flow-root 挡住 ul 的 -mb-px 外边距折叠出去：overflow-clip 不像 overflow-hidden 那样会建立格式化上下文，
    // 少了它负外边距会穿出容器，最后一行的下边线不被裁掉，和下一节的分隔线叠成双线
    <div className="flow-root overflow-clip">
      <ul className="-mr-px -mb-px grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:grid-rows-[30rem_23rem] lg:max-[1099px]:grid-rows-[30rem_32rem]">
        {items.map(({ item, size }) => (
          <li
            key={item.name}
            className={`min-w-0 border-r border-b border-edge ${cellClass[size]}`}
          >
            <BentoCard
              href={`/components/${item.name}/`}
              label={`${item.title}演示`}
              preview={<FeaturedPreview name={item.name} />}
              previewClassName={previewMinClass[size]}
            >
              <EntryTitle
                section="components"
                name={item.name}
                title={item.title}
              />
            </BentoCard>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { FeaturedBento }
