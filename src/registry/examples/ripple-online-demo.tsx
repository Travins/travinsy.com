import { Ripple, RippleMarker } from "@/registry/ui/ripple/ripple"

export default function RippleOnlineDemo() {
  return (
    <Ripple
      label="Travins 在线，可随时协作"
      tone="green"
      rings={4}
      baseSize={64}
      ringGap={48}
      duration={5}
      background="none"
    >
      <RippleMarker radius={0}>
        <div className="relative flex size-20 items-center justify-center rounded-full border border-edge bg-muted font-mono text-2xl font-medium">
          TY
          <span className="absolute right-1 bottom-1 size-4 rounded-full border-4 border-background bg-(--flow-tone)" />
        </div>
      </RippleMarker>
      <RippleMarker
        angle={180}
        radius={0.73}
        className="rounded-md border border-edge bg-background px-3 py-1 text-xs whitespace-nowrap"
      >
        在线 · 可随时协作
      </RippleMarker>
    </Ripple>
  )
}
