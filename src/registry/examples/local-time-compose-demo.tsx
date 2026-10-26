import { WorldClock, WorldClockItem } from "@/registry/ui/local-time/local-time"

export default function LocalTimeComposeDemo() {
  return (
    <WorldClock
      hour12
      showSeconds={false}
      title="TEAM / 团队时区"
      className="w-full max-w-sm"
    >
      <WorldClockItem timeZone="Asia/Shanghai" label="上海" highlighted />
      <WorldClockItem timeZone="Asia/Kolkata" label="班加罗尔" />
      <WorldClockItem timeZone="Europe/Berlin" label="柏林" />
      <WorldClockItem timeZone="Pacific/Auckland" label="奥克兰" />
    </WorldClock>
  )
}
