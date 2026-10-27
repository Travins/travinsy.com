import {
  Globe,
  GlobeLegend,
  type GlobeMarker,
} from "@/registry/ui/globe/globe"

// 城市之间保持距离，开启 `labels` 后标签胶囊不会叠在一起
const CITIES: GlobeMarker[] = [
  { label: "上海", location: [31.23, 121.47] },
  { label: "新加坡", location: [1.35, 103.82] },
  { label: "法兰克福", location: [50.11, 8.68] },
  { label: "旧金山", location: [37.77, -122.42] },
  { label: "悉尼", location: [-33.87, 151.21] },
]

export default function GlobeDemo() {
  return (
    <div className="grid w-full max-w-xl items-center gap-6 sm:grid-cols-[minmax(0,1fr)_11rem]">
      <Globe
        label="分布在亚洲、欧洲、北美和大洋洲的节点"
        markers={CITIES}
        markerTone="amber"
        labels
      />
      {/* 文字版本：不依赖颜色与动画，读屏也能获取 */}
      <GlobeLegend markers={CITIES} markerTone="amber" coordinates />
    </div>
  )
}
