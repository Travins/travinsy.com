import { GreetingCard } from "@/registry/ui/greeting/greeting"

// 斜纹底纹向四周渐隐，卡片落在中央；图标、光晕与指示条的色调随访客所在时段变化
export default function GreetingCardDemo() {
  return (
    <div className="relative flex w-full items-center justify-center py-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-hatch opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_72%)]"
      />
      <GreetingCard
        name="Travins"
        className="relative w-full max-w-sm shadow-sm"
      />
    </div>
  )
}
