import { cn } from "@/lib/utils"

const levels = [
  { label: "弱", bar: "bg-destructive" },
  { label: "一般", bar: "bg-destructive/50" },
  { label: "较强", bar: "bg-primary/60" },
  { label: "强", bar: "bg-primary" },
] as const

/** 按长度与字符种类打分：0 表示尚未输入，1–4 对应 弱 / 一般 / 较强 / 强。 */
export function getPasswordStrength(password: string) {
  if (!password) return 0
  const score =
    Number(password.length >= 8) +
    Number(password.length >= 12) +
    Number(/[a-z]/.test(password) && /[A-Z]/.test(password)) +
    Number(/\d/.test(password)) +
    Number(/[^A-Za-z0-9]/.test(password))
  return Math.min(4, Math.max(1, score <= 1 ? 1 : score >= 4 ? 4 : score))
}

/** 四段强度条 + 文字说明；颜色从 destructive 过渡到主色，跟随主题。 */
export function PasswordStrength({ password }: { password: string }) {
  const strength = getPasswordStrength(password)
  const level = strength ? levels[strength - 1] : null
  return (
    <div className="flex items-center gap-3">
      <div aria-hidden="true" className="grid flex-1 grid-cols-4 gap-1">
        {levels.map((item, index) => (
          <span
            key={item.label}
            className={cn(
              "h-1 rounded-full bg-muted transition-colors motion-reduce:transition-none",
              index < strength && item.bar,
            )}
          />
        ))}
      </div>
      <span
        aria-live="polite"
        className="w-16 text-xs whitespace-nowrap text-muted-foreground"
      >
        {level ? `强度：${level.label}` : "强度：—"}
      </span>
    </div>
  )
}
