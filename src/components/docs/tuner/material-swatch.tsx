import * as React from "react"

import type { IsometricMaterial } from "@/registry/ui/isometric-mark/isometric-mark"

/** 材质小样：16px 的方块里平铺对应纹理，与组件顶面的线型一致 */
export function MaterialSwatch({ material }: { material: IsometricMaterial }) {
  const id = React.useId()
  const s = 4
  const slash = `M-1 1l2-2M0 ${s}l${s}-${s}M${s - 1} ${s + 1}l2-2`
  const back = `M-1 ${s - 1}l2 2M0 0l${s} ${s}M${s - 1}-1l2 2`
  const tile: Record<IsometricMaterial, React.ReactNode> = {
    hatch: <path d={slash} />,
    "hatch-reverse": <path d={back} />,
    cross: <path d={slash + back} />,
    dots: <circle cx={s / 2} cy={s / 2} r={0.7} fill="currentColor" />,
    lines: <path d={`M0 ${s / 2}H${s}`} />,
    plain: null,
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4 shrink-0 rounded-[3px] border border-edge bg-background text-muted-foreground"
    >
      <defs>
        <pattern id={id} width={s} height={s} patternUnits="userSpaceOnUse">
          <g stroke="currentColor" strokeWidth={0.6}>
            {tile[material]}
          </g>
        </pattern>
      </defs>
      <rect width="16" height="16" fill={`url(#${id})`} />
    </svg>
  )
}
