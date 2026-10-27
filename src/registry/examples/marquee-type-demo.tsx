import { Marquee, MarqueeItem } from "@/registry/ui/marquee/marquee"

const WORDS = ["简洁", "CLARITY", "克制", "LESS", "精确", "PRECISION"]

// 描边字：用背景色填充并先画描边，字形重叠处的内部轮廓会被盖住
const OUTLINE =
  "text-background [-webkit-text-stroke:1.5px_var(--foreground)] [paint-order:stroke_fill]"

export default function MarqueeTypeDemo() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-3 py-6">
      {[false, true].map((reverse) => (
        <Marquee
          key={String(reverse)}
          reverse={reverse}
          speed={38}
          gap={28}
          label="简洁、克制、精确"
        >
          {WORDS.map((word, index) => (
            <MarqueeItem
              key={word}
              className="gap-7 text-5xl font-semibold tracking-tight sm:text-6xl"
            >
              <span className={index % 2 ? OUTLINE : undefined}>{word}</span>
              <span aria-hidden className="text-xl text-primary">
                ✦
              </span>
            </MarqueeItem>
          ))}
        </Marquee>
      ))}
    </div>
  )
}
