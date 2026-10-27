import { TextScramble } from "@/registry/ui/text-animate/text-animate"

export default function TextAnimateScrambleDemo() {
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-5">
      <p className="text-xs text-muted-foreground">悬停或聚焦，重新解码</p>
      <TextScramble
        trigger="hover"
        charset="symbols"
        className="text-xl font-semibold text-primary sm:text-2xl"
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
