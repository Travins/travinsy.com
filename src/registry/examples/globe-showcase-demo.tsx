import { Globe, type GlobeMarker } from "@/registry/ui/globe/globe"

const NODES: GlobeMarker[] = [
  { label: "上海", location: [31.23, 121.47], size: 0.07, showLabel: true },
  { label: "新加坡", location: [1.35, 103.82], size: 0.05 },
  { label: "东京", location: [35.68, 139.69], size: 0.05 },
  { label: "北京", location: [39.9, 116.4], size: 0.05 },
]

/**
 * 列表封面：文字只占左上角一小块。窄缩略图里地球从底部升起，宽缩略图里挪到右下角，
 * 数字都不会压到地球上缘。
 */
export default function GlobeShowcaseDemo() {
  return (
    <div className="[container-type:size] relative size-full overflow-hidden">
      <div className="relative z-10 flex flex-col gap-1 p-4 @lg:gap-2 @lg:p-6">
        <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase @lg:text-xs">
          Edge network
        </span>
        <p className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold tracking-tight tabular-nums @lg:text-4xl">
            128
          </span>
          <span className="text-xs whitespace-nowrap text-muted-foreground @lg:text-sm">
            个在线节点
          </span>
        </p>
      </div>
      <Globe
        label="亚洲分布着 128 个边缘节点，上海为主要城市"
        markers={NODES}
        markerTone="amber"
        className="absolute bottom-0 left-1/2 w-[min(115cqw,130cqh)] -translate-x-1/2 translate-y-[42%] @lg:right-[-10cqh] @lg:bottom-[-42cqh] @lg:left-auto @lg:w-[135cqh] @lg:translate-x-0 @lg:translate-y-0"
      />
    </div>
  )
}
