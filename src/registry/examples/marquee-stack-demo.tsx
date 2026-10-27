import MarqueeMotionDemo from "./marquee-motion-demo"
import { Braces, Code, Database, Layers, Palette, Terminal } from "lucide-react"
import { Marquee, MarqueeItem } from "@/registry/ui/marquee/marquee"

const TOOLS = [
  { name: "Next.js", icon: Layers },
  { name: "TypeScript", icon: Braces },
  { name: "Tailwind CSS", icon: Palette },
  { name: "React", icon: Code },
  { name: "Node.js", icon: Terminal },
  { name: "PostgreSQL", icon: Database },
]

export default function MarqueeStackDemo() {
  return (
    <MarqueeMotionDemo>
      <div className="flex w-full min-w-0 flex-col gap-3 py-10">
        {[false, true].map((reverse) => (
          <Marquee
            key={String(reverse)}
            reverse={reverse}
            speed={26}
            gap={12}
            label="技术栈工具列表"
          >
            {(reverse ? TOOLS.toReversed() : TOOLS).map(
              ({ name, icon: Icon }) => (
                <MarqueeItem
                  key={name}
                  className="rounded-lg border border-edge bg-card px-4 py-3 text-sm"
                >
                  <Icon className="size-4 text-primary" aria-hidden />
                  {name}
                </MarqueeItem>
              ),
            )}
          </Marquee>
        ))}
      </div>
    </MarqueeMotionDemo>
  )
}
