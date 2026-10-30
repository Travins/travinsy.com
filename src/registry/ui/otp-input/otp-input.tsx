"use client"

import * as React from "react"
import { OTPField } from "@base-ui/react/otp-field"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

import { DEFAULT_LABELS } from "./config"
import type { OtpInputProps } from "./types"

/**
 * 格子与方条同一套外观（浅灰底、细边框、rounded-md）。三档大小，触屏设备上各放大一档，
 * 手指点得准；字号不小于 16px，iOS 聚焦时不会自动放大页面
 */
const otpInputSlotVariants = cva(
  "min-w-0 rounded-md border border-edge bg-muted/60 text-center font-semibold tabular-nums caret-foreground outline-none transition-[color,box-shadow,border-color] select-none placeholder:text-muted-foreground/40 hover:bg-muted focus:border-ring focus:bg-background focus:ring-3 focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[filled]:bg-background aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:focus:ring-destructive/20 dark:aria-invalid:border-destructive/50",
  {
    variants: {
      size: {
        sm: "h-9 w-8 text-base pointer-coarse:h-11 pointer-coarse:w-10",
        default: "h-11 w-10 text-lg pointer-coarse:h-13 pointer-coarse:w-11",
        lg: "h-13 w-11 text-2xl pointer-coarse:h-14 pointer-coarse:w-12",
      },
    },
    defaultVariants: { size: "default" },
  },
)

/**
 * 验证码输入：一格一位，基于 Base UI 的 OTPField。
 * 支持 iOS / 安卓的短信验证码一键填入（autocomplete="one-time-code"）、粘贴整串自动分格、
 * 填满时回调 `onValueComplete`（可配 `autoSubmit` 直接提交表单）。
 */
function OtpInput({
  length = 6,
  groupSize,
  size = "default",
  error,
  labels: labelsProp,
  className,
  id: idProp,
  "aria-label": ariaLabel,
  "aria-describedby": describedByProp,
  ...props
}: OtpInputProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const autoId = React.useId()
  const id = idProp ?? autoId
  const errorId = `${id}-error`
  const invalid = Boolean(error)
  const describedBy =
    [describedByProp, error ? errorId : undefined].filter(Boolean).join(" ") ||
    undefined

  return (
    <div
      data-slot="otp-input"
      data-size={size}
      data-invalid={invalid ? "" : undefined}
      className={cn("flex flex-col gap-1.5", className)}
    >
      <OTPField.Root
        {...props}
        id={id}
        length={length}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        data-slot="otp-input-group"
        className="flex items-center gap-1.5 pointer-coarse:gap-2"
      >
        {Array.from({ length }, (_, index) => (
          <React.Fragment key={index}>
            {groupSize && index > 0 && index % groupSize === 0 ? (
              <span
                aria-hidden="true"
                data-slot="otp-input-separator"
                className="mx-0.5 h-0.5 w-2 shrink-0 rounded-full bg-muted-foreground/50"
              />
            ) : null}
            <OTPField.Input
              data-slot="otp-input-slot"
              // 第一格的名称由组 / label 提供（Base UI 不让第一格单独带 aria-label）
              aria-label={
                index === 0
                  ? undefined
                  : labels.slot.replace("{index}", String(index + 1))
              }
              aria-invalid={invalid || undefined}
              className={otpInputSlotVariants({ size })}
            />
          </React.Fragment>
        ))}
      </OTPField.Root>
      {error && (
        <p
          id={errorId}
          data-slot="otp-input-error"
          className="text-xs text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export { OtpInput, otpInputSlotVariants }
export type { OtpInputProps, OtpInputSize } from "./types"
