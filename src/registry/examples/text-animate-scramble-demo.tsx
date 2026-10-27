import { TextScramble } from "@/registry/ui/text-animate/text-animate"

export default function TextAnimateScrambleDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-5 px-6 py-10">
      <span className="font-mono text-[10px] text-muted-foreground">
        悬停或聚焦，重新解码
      </span>
      <TextScramble
        trigger="hover"
        charset="symbols"
        className="text-2xl font-semibold text-primary"
      >
        DECODING → 构建完成
      </TextScramble>
      <TextScramble trigger="hover" charset="katakana" className="text-lg">
        代码有序，灵感自由。
      </TextScramble>
      <TextScramble
        trigger="hover"
        charset="digits"
        className="text-sm text-muted-foreground"
      >
        2026 / READY TO SHIP
      </TextScramble>
    </div>
  )
}
