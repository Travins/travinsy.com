import {
  ShuffleGrid,
  type ShuffleGridItem,
} from "@/registry/ui/shuffle-grid/shuffle-grid"

const TONES = ["blue", "violet", "cyan", "green", "amber", "rose"] as const

// 不放内容：每个条目就是一块纯色方块，数量比格子少，在 12×6 的盘面上快速出没
const BLOCKS: ShuffleGridItem[] = Array.from({ length: 30 }, (_, index) => ({
  id: `block-${index}`,
  tone: TONES[index % TONES.length],
}))

export default function ShuffleGridPixelDemo() {
  return (
    <ShuffleGrid
      label="彩色像素块在 12 列 6 行的方格里快速出现并消失"
      variant="pixels"
      rows={6}
      cols={12}
      items={BLOCKS}
      activeCount={26}
      litCount={12}
      interval={420}
      seed={5}
      className="max-w-xl"
    />
  )
}
