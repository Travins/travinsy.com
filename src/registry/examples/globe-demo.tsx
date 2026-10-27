import { Globe, type GlobeMarker } from "@/registry/ui/globe/globe"

// 八个节点都有标记；东亚的几座城市挨得很近，只给上海和新加坡留标签，免得胶囊叠在一起
const NODES: GlobeMarker[] = [
  { label: "上海", location: [31.23, 121.47], size: 0.06, showLabel: true },
  { label: "杭州", location: [30.27, 120.16], size: 0.045 },
  { label: "北京", location: [39.9, 116.4], size: 0.05 },
  { label: "深圳", location: [22.54, 114.06], size: 0.05 },
  { label: "新加坡", location: [1.35, 103.82], size: 0.05, showLabel: true },
  { label: "东京", location: [35.68, 139.69], size: 0.05 },
  { label: "旧金山", location: [37.77, -122.42], size: 0.05, showLabel: true },
  { label: "法兰克福", location: [50.11, 8.68], size: 0.05, showLabel: true },
]

export default function GlobeDemo() {
  return (
    <div className="[container-type:size] relative h-[26rem] w-full max-w-4xl overflow-hidden rounded-lg border border-edge bg-card">
      <div className="relative z-10 flex flex-col gap-4 p-5 sm:p-6">
        <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
          Edge network
        </span>
        <div className="flex flex-col gap-1.5">
          <p className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight tabular-nums">
              128
            </span>
            <span className="text-sm text-muted-foreground">个在线节点</span>
          </p>
          <p className="max-w-[16rem] text-sm leading-6 text-muted-foreground">
            遍布 6 个大洲，就近接入，全球平均延迟 38 ms。
          </p>
        </div>
        <dl className="flex gap-6 text-sm">
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">可用性</dt>
            <dd className="font-medium tabular-nums">99.99%</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">峰值带宽</dt>
            <dd className="font-medium tabular-nums">2.4 Tbps</dd>
          </div>
        </dl>
      </div>
      <Globe
        label="亚洲、欧洲和北美分布着 128 个边缘节点，其中上海、杭州、北京、深圳、新加坡、东京、旧金山和法兰克福为主要城市"
        markers={NODES}
        markerTone="amber"
        className="absolute bottom-0 left-1/2 w-[min(140cqw,115cqh)] -translate-x-1/2 translate-y-[40%] @lg:right-[-16cqh] @lg:bottom-[-44cqh] @lg:left-auto @lg:w-[124cqh] @lg:translate-x-0 @lg:translate-y-0"
      />
    </div>
  )
}
