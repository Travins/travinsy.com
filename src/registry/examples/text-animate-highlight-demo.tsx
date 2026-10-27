import { TextHighlight } from "@/registry/ui/text-animate/text-animate"

export default function TextAnimateHighlightDemo() {
  return (
    <div className="flex w-full flex-col gap-6 px-6 py-12 text-xl leading-loose font-medium">
      <p>
        好设计，让 <TextHighlight>复杂变简单</TextHighlight>。
      </p>
      <p>
        Keep it{" "}
        <TextHighlight tone="violet" variant="underline">
          clear & purposeful
        </TextHighlight>
        .
      </p>
      <p className="text-base text-muted-foreground">
        用 <TextHighlight tone="amber">细节</TextHighlight> 表达态度，用{" "}
        <TextHighlight tone="cyan" variant="underline">
          留白
        </TextHighlight>{" "}
        给内容呼吸。
      </p>
    </div>
  )
}
