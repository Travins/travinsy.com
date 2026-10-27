import {
  Globe,
  type GlobeArc,
  type GlobeMarker,
} from "@/registry/ui/globe/globe"

const NODES: GlobeMarker[] = [
  { label: "上海", location: [31.23, 121.47], size: 0.06, showLabel: true },
  { label: "新加坡", location: [1.35, 103.82] },
  { label: "东京", location: [35.68, 139.69] },
  { label: "旧金山", location: [37.77, -122.42], showLabel: true },
  { label: "法兰克福", location: [50.11, 8.68], showLabel: true },
  { label: "圣保罗", location: [-23.55, -46.63] },
  { label: "悉尼", location: [-33.87, 151.21] },
]

// 弧线两端必须落在标记上，数据流向一眼可见；跨洋的用蓝色，亚欧之间用紫色
const LINKS: GlobeArc[] = [
  { from: [31.23, 121.47], to: [37.77, -122.42], tone: "blue" },
  { from: [35.68, 139.69], to: [37.77, -122.42], tone: "blue" },
  { from: [31.23, 121.47], to: [50.11, 8.68], tone: "violet" },
  { from: [1.35, 103.82], to: [50.11, 8.68], tone: "violet" },
  { from: [50.11, 8.68], to: [-23.55, -46.63], tone: "blue" },
  { from: [1.35, 103.82], to: [-33.87, 151.21], tone: "violet" },
]

const REGIONS = [
  { name: "亚太", value: "46 节点" },
  { name: "欧洲", value: "31 节点" },
  { name: "美洲", value: "38 节点" },
]

// 外层加 `dark` 强制暗色：背景、前景和 --flow-* 都取暗色取值，亮暗模式下外观一致
export default function GlobeDarkDemo() {
  return (
    <div className="dark relative grid w-full max-w-4xl overflow-hidden rounded-lg border border-edge bg-background text-foreground md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <div className="relative z-10 flex flex-col justify-between gap-8 p-6 md:p-8">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs tracking-wider text-(--flow-cyan) uppercase">
            Global reach
          </span>
          <p className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
            离用户更近，延迟更低
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            请求先到最近的节点，再沿私有骨干网回源。弧线是当前最繁忙的几条链路。
          </p>
        </div>
        <ul className="grid grid-cols-3 gap-4 border-t border-edge pt-5">
          {REGIONS.map((region) => (
            <li key={region.name} className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                {region.name}
              </span>
              <span className="text-sm font-medium tabular-nums">
                {region.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Globe
        label="跨越亚洲、欧洲、美洲和大洋洲的节点网络，弧线连接上海、东京、新加坡、旧金山、法兰克福等城市"
        markers={NODES}
        arcs={LINKS}
        dotTone="cyan"
        markerTone="amber"
        speed={0.1}
        phi={5.3}
        theta={0.35}
        className="mx-auto w-full max-w-[28rem] md:-my-6"
      />
    </div>
  )
}
