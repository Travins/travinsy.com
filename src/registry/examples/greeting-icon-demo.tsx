import { Greeting } from "@/registry/ui/greeting/greeting"

export default function GreetingIconDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <p className="text-2xl font-medium tracking-tight">
        <Greeting showIcon name="Travins" suffix="" />
      </p>
      <p className="text-sm leading-7 text-muted-foreground">
        <Greeting
          showIcon
          fallback="嗨"
          morning="早安"
          noon="午安"
          afternoon="午后好"
          evening="夜深了"
          name="Travins"
          nameSeparator=" · "
          suffix="，今天也辛苦了。"
          boundaries={{ morning: 6, noon: 12, afternoon: 15, evening: 20 }}
        />
      </p>
    </div>
  )
}
