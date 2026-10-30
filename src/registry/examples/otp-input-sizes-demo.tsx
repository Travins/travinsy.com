import { OtpInput } from "@/registry/ui/otp-input/otp-input"

/** 三档格子（32 × 36、40 × 44、44 × 52px，触屏上放大一档）、4 位与 3-3 分组。 */
export default function OtpInputSizesDemo() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">尺寸与位数</p>
          <p className="truncate text-xs text-muted-foreground">
            密排的面板用 sm，登录页的主角用 lg
          </p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground">
          sm / default / lg
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <OtpInput size="sm" aria-label="验证码（sm）" defaultValue="2468" />
        <OtpInput aria-label="验证码（default）" defaultValue="2468" />
        <OtpInput size="lg" aria-label="验证码（lg）" defaultValue="2468" />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <OtpInput length={4} aria-label="4 位验证码" defaultValue="80" />
          <OtpInput
            size="sm"
            groupSize={3}
            aria-label="分组的验证码"
            defaultValue="135"
          />
        </div>
      </div>
    </div>
  )
}
