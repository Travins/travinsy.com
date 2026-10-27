import {
  TextFlip,
  TextHighlight,
} from "@/registry/ui/text-animate/text-animate"

export default function TextAnimateShowcaseDemo() {
  return (
    <div className="flex size-full min-w-0 flex-col justify-center gap-4 overflow-hidden bg-dots px-7 py-6">
      <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
        TEXT / 文字有形
      </span>
      <div className="flex flex-col items-start gap-2 text-3xl leading-tight font-semibold tracking-tight">
        <span>把界面</span>
        <span>
          写成 <TextFlip paused words={["组件", "系统"]} />
        </span>
      </div>
      <span className="text-[11px] text-muted-foreground">
        从 <TextHighlight>一个词</TextHighlight> 开始创造。
      </span>
    </div>
  )
}
