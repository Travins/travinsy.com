import { GreetingPeriods } from "@/registry/ui/greeting/greeting"

export default function GreetingPeriodsDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <GreetingPeriods />
      <GreetingPeriods
        boundaries={{ morning: 6, noon: 12, afternoon: 15, evening: 20 }}
        showProgress={false}
        labels={{
          names: {
            morning: "Morning",
            noon: "Noon",
            afternoon: "Afternoon",
            evening: "Night",
          },
        }}
      />
    </div>
  )
}
