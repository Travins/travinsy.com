import {
  Globe,
  type GlobeArc,
  type GlobeMarker,
} from "@/registry/ui/globe/globe"
import { Ripple, RippleMarker } from "@/registry/ui/ripple/ripple"
import {
  StatBadge,
  StatCard,
  StatHeader,
  StatLabel,
  StatMeta,
  StatProgress,
  StatTrend,
  StatValue,
} from "@/registry/ui/stat-card/stat-card"

const NODES: GlobeMarker[] = [
  { label: "上海", location: [31.23, 121.47], size: 0.06, tone: "green" },
  { label: "深圳", location: [22.54, 114.06], tone: "green" },
  { label: "新加坡", location: [1.35, 103.82], tone: "green" },
  { label: "东京", location: [35.68, 139.69], tone: "green" },
  { label: "法兰克福", location: [50.11, 8.68], tone: "amber" },
  { label: "旧金山", location: [37.77, -122.42], tone: "green" },
]

const LINKS: GlobeArc[] = [
  { from: [31.23, 121.47], to: [35.68, 139.69] },
  { from: [31.23, 121.47], to: [1.35, 103.82] },
  { from: [22.54, 114.06], to: [50.11, 8.68] },
  { from: [35.68, 139.69], to: [37.77, -122.42] },
]

// 三块原语拼一张看板：stat-card 给数字，ripple 做心跳，globe 看分布。
// 格子之间共用细线，不是几张孤立的小卡
const CELL = "flex flex-col gap-3 rounded-none border-0 bg-transparent p-4"

export default function GlobeNodesDemo() {
  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-lg border border-edge bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-edge px-4 py-3">
        <span className="text-sm font-medium">全球节点</span>
        <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-(--flow-green)"
          />
          实时
        </span>
      </div>
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="grid border-b border-edge md:border-r md:border-b-0">
          <StatCard className={`${CELL} border-b border-edge`}>
            <StatHeader className="items-center">
              <StatLabel>在线节点</StatLabel>
              <StatBadge status="ok">运行正常</StatBadge>
            </StatHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <StatValue value="126" unit="/ 128" size="lg" />
                <StatTrend value={1.6}>较昨日</StatTrend>
              </div>
              <Ripple
                label="节点心跳"
                mode="pulse"
                size={96}
                rings={3}
                baseSize={20}
                ringGap={26}
                duration={3}
                background="none"
                className="h-24 w-24 shrink-0 [&_[data-slot=ripple-wave]]:border-(--flow-green)/50 [&_[data-slot=ripple-wave]]:bg-(--flow-green)/8"
              >
                <RippleMarker
                  radius={0}
                  className="size-3 rounded-full bg-(--flow-green)"
                />
              </Ripple>
            </div>
          </StatCard>
          <StatCard className={CELL}>
            <StatHeader className="items-center">
              <StatLabel>平均延迟</StatLabel>
            </StatHeader>
            <StatValue value="38" unit="ms" size="lg" />
            <StatProgress
              value={38}
              max={150}
              tone="health"
              label="延迟占预算 25%"
            />
            <StatMeta>
              <span>预算 150 ms</span>
              <span>P95 112 ms</span>
            </StatMeta>
          </StatCard>
        </div>
        <Globe
          label="六个主要节点之间的链路，上海、深圳、新加坡、东京、法兰克福和旧金山"
          markers={NODES}
          arcs={LINKS}
          markerTone="green"
          arcTone="primary"
          className="mx-auto w-full max-w-[26rem] md:my-[-1rem]"
          draggable
        />
      </div>
    </div>
  )
}
