import { Ripple, RippleMarker } from "@/registry/ui/ripple/ripple"

export default function RippleDemo() {
  return (
    <Ripple
      label="累计 1.2 万余次组件安装"
      rings={5}
      baseSize={80}
      ringGap={44}
    >
      <RippleMarker
        radius={0}
        className="flex flex-col items-center gap-2 rounded-full bg-background/90 p-4 whitespace-nowrap"
      >
        <span className="font-mono text-4xl font-semibold tracking-tighter">
          1.2万<span className="text-primary">+</span>
        </span>
        <span className="text-xs text-muted-foreground">次组件安装</span>
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
          持续生长中
        </span>
      </RippleMarker>
    </Ripple>
  )
}
