import {
  Globe,
  type GlobeArc,
  type GlobeMarker,
} from "@/registry/ui/globe/globe"

const NODES: GlobeMarker[] = [
  { label: "上海", location: [31.23, 121.47], size: 0.06 },
  { label: "新加坡", location: [1.35, 103.82] },
  { label: "旧金山", location: [37.77, -122.42] },
  { label: "法兰克福", location: [50.11, 8.68] },
  { label: "圣保罗", location: [-23.55, -46.63] },
]

// 弧线两端必须落在标记上；跨洋的用蓝色，亚欧之间用紫色
const LINKS: GlobeArc[] = [
  { from: [31.23, 121.47], to: [37.77, -122.42], tone: "blue" },
  { from: [31.23, 121.47], to: [50.11, 8.68], tone: "violet" },
  { from: [1.35, 103.82], to: [50.11, 8.68], tone: "violet" },
  { from: [50.11, 8.68], to: [-23.55, -46.63], tone: "blue" },
]

// 外层加 `dark` 强制暗色：背景、前景和 --flow-* 都取暗色取值，亮暗模式下外观一致
export default function GlobeDarkDemo() {
  return (
    <div className="dark w-full max-w-sm rounded-xl bg-background p-3 text-foreground">
      <Globe
        label="上海、新加坡、旧金山、法兰克福和圣保罗之间的链路"
        markers={NODES}
        arcs={LINKS}
        dotTone="cyan"
        markerTone="amber"
        speed={0.1}
        phi={5.3}
        theta={0.35}
        draggable
      />
    </div>
  )
}
