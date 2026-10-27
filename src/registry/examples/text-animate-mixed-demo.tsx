import {
  TextFlip,
  TextReveal,
  TextScramble,
} from "@/registry/ui/text-animate/text-animate"

export default function TextAnimateMixedDemo() {
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-6">
      <p className="text-2xl leading-loose font-medium">
        你好，
        <TextFlip words={["世界", "world", "つくり手"]} variant="underline" />。
      </p>
      <p className="text-sm leading-7 text-muted-foreground">
        <TextReveal by="word">
          用 React 构建界面，把 ideas 变成 reality。
        </TextReveal>
      </p>
      <TextScramble characters="界面UI01/" className="text-xs text-primary">
        SYSTEM READY / 系统就绪
      </TextScramble>
    </div>
  )
}
