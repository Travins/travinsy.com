import {
  FlowBeam,
  FlowDiagram,
  FlowNode,
  flowArrival,
  flowRoute,
  type FlowBackgroundName,
} from "@/registry/ui/flow-diagram/flow-diagram"

const FIRST = flowRoute([
  [56, 45],
  [76, 45],
])
const SECOND = flowRoute([
  [124, 45],
  [144, 45],
])

// 时间轴（秒）：同一张小图在不同底纹下反复播放，方便对比
const FIRST_AT = 0.5
const MIDDLE_AT = flowArrival(FIRST_AT, FIRST)
const SECOND_AT = MIDDLE_AT + 0.2
const LAST_AT = flowArrival(SECOND_AT, SECOND)
const REST = LAST_AT + 0.8
const EXIT = REST + 0.2
const DURATION = EXIT + 0.8

const TILES: {
  caption: string
  background: FlowBackgroundName | "custom"
  fade?: boolean
}[] = [
  { caption: 'background="dots"', background: "dots" },
  { caption: 'background="grid"', background: "grid" },
  { caption: 'background="lines"', background: "lines" },
  { caption: 'background="hatch"', background: "hatch" },
  { caption: 'background="none"', background: "none" },
  { caption: "自定义元素 · fade={false}", background: "custom", fade: false },
]

/** 底纹选项：内置的四种底纹、不要底纹，以及传入自定义元素。 */
export default function FlowDiagramBackgroundDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
      {TILES.map(({ caption, background, fade }) => (
        <figure key={caption} className="flex flex-col gap-2">
          <FlowDiagram
            width={200}
            height={90}
            duration={DURATION}
            exit={EXIT}
            rest={REST}
            fit="contain"
            background={
              background === "custom" ? (
                // 自定义底纹是一个铺满外框的元素，这里用两个多彩色调做斜向渐变
                <div className="size-full bg-linear-to-br from-(--flow-blue)/15 to-(--flow-violet)/15" />
              ) : (
                background
              )
            }
            fade={fade}
            className="aspect-[20/9] w-full rounded-lg border border-edge"
          >
            <FlowBeam route={FIRST} at={FIRST_AT} />
            <FlowBeam route={SECOND} at={SECOND_AT} />
            <FlowNode x={32} y={45} width={48} litAt={0.2} label="输入" />
            <FlowNode
              x={100}
              y={45}
              width={48}
              litAt={MIDDLE_AT}
              label="处理"
            />
            <FlowNode x={168} y={45} width={48} litAt={LAST_AT} label="输出" />
          </FlowDiagram>
          <figcaption className="text-center font-mono text-xs text-muted-foreground">
            {caption}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
