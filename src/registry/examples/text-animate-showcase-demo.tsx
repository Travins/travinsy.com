import {
  TextFlip,
  TextHighlight,
} from "@/registry/ui/text-animate/text-animate"

export default function TextAnimateShowcaseDemo() {
  return (
    <div className="relative flex size-full min-w-0 flex-col justify-center gap-4 overflow-hidden bg-dots px-7 py-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_6%,color-mix(in_oklab,var(--flow-blue)_20%,transparent),transparent_52%),radial-gradient(ellipse_at_6%_104%,color-mix(in_oklab,var(--flow-violet)_14%,transparent),transparent_50%)]"
      />
      <span className="relative font-mono text-[9px] tracking-widest text-muted-foreground">
        TEXT / 文字有形
      </span>
      <div className="relative flex flex-col items-start gap-2 text-3xl leading-tight font-semibold tracking-tight">
        <span>把界面</span>
        <span>
          写成{" "}
          <TextFlip
            className="[--primary:var(--flow-blue)]"
            paused
            words={["组件", "系统"]}
          />
        </span>
      </div>
      <span className="relative text-[11px] text-muted-foreground">
        从{" "}
        <TextHighlight tone="amber" className="text-foreground">
          一个词
        </TextHighlight>{" "}
        开始创造。
      </span>
    </div>
  )
}
