import MarqueeMotionDemo from "./marquee-motion-demo"
import { Marquee, MarqueeItem } from "@/registry/ui/marquee/marquee"

const WORDS = ["简洁", "CLARITY", "克制", "LESS", "精确", "PRECISION"]

export default function MarqueeTypeDemo() {
  return (
    <MarqueeMotionDemo>
      <div className="flex w-full min-w-0 flex-col gap-3 overflow-hidden py-10">
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
                className="gap-7 text-5xl font-semibold tracking-tighter sm:text-6xl"
              >
                <span
                  className={
                    index % 2
                      ? "text-transparent [-webkit-text-stroke:1px_var(--foreground)]"
                      : "text-foreground"
                  }
                >
                  {word}
                </span>
                <span aria-hidden className="text-xl text-primary">
                  ✦
                </span>
              </MarqueeItem>
            ))}
          </Marquee>
        ))}
      </div>
    </MarqueeMotionDemo>
  )
}
