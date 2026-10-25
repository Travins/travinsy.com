import { Greeting } from "@/registry/ui/greeting/greeting"

export default function GreetingDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <p className="text-2xl font-medium tracking-tight">
        <Greeting />
      </p>
      <p className="text-sm leading-7 text-muted-foreground">
        <Greeting fallback="你好" suffix="，今天想写点什么？" />
      </p>
    </div>
  )
}
