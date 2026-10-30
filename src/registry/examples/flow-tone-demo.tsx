import {
  FLOW_TONES,
  flowToneStyle,
  type FlowToneName,
} from "@/registry/lib/flow-tone"

/** 内置色调，顺序即 `FLOW_TONES` 的声明顺序，右侧显示它对应的主题变量 */
const ROWS = (Object.keys(FLOW_TONES) as FlowToneName[]).map((name) => ({
  name,
  value: FLOW_TONES[name],
}))

/** 任意颜色：主题变量、十六进制、oklch 都行，这里用 chart-1 演示 */
const CUSTOM_TONE = "var(--chart-1)"

/**
 * 默认示例：内置色调的对照表。每行在自己的元素上写 `--flow-tone`，里面的色块只是
 * `bg-(--flow-tone)`，看到什么颜色就说明变量已经继承下去；最后一行演示直接传主题变量字符串。
 */
export default function FlowToneDemo() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">色调</p>
          <p className="truncate text-xs text-muted-foreground">
            名字换成 --flow-tone 变量
          </p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground">
          {ROWS.length} 内置
        </p>
      </div>
      <ul className="flex flex-col">
        {ROWS.map((row) => (
          <li
            key={row.name}
            className="flex items-center gap-2.5 py-1"
            style={flowToneStyle(row.name)}
          >
            <span
              aria-hidden="true"
              className="size-3 shrink-0 rounded-sm bg-(--flow-tone)"
            />
            <span className="font-mono text-xs">{row.name}</span>
            <span className="ms-auto truncate font-mono text-[11px] text-muted-foreground">
              {row.value}
            </span>
          </li>
        ))}
      </ul>
      <div
        className="mt-2 flex items-center gap-2.5 border-t border-dashed border-edge pt-3"
        style={flowToneStyle(CUSTOM_TONE)}
      >
        <span
          aria-hidden="true"
          className="size-3 shrink-0 rounded-sm bg-(--flow-tone)"
        />
        <span className="text-xs">任意颜色</span>
        <span className="ms-auto truncate font-mono text-[11px] text-muted-foreground">
          {CUSTOM_TONE}
        </span>
      </div>
    </div>
  )
}
