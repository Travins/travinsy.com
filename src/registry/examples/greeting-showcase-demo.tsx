import { GreetingCard } from "@/registry/ui/greeting/greeting"

/** 列表封面：问候卡片放在斜纹底纹上，时段图标、色调与四时段指示随访客时间变化。 */
export default function GreetingShowcaseDemo() {
  return (
    <div className="relative flex size-full items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-hatch [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)] opacity-60"
      />
      <GreetingCard
        name="Travins"
        className="relative w-[min(100%-2rem,22rem)] shadow-xs"
      />
    </div>
  )
}
