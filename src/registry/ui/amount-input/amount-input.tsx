"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/hooks/use-controllable-state"
import { toRmbUppercase } from "@/registry/lib/chinese-number"
import { formatStat } from "@/registry/lib/data-display"

import {
  AmountInputReadout,
  amountInputControlVariants,
} from "./amount-input-parts"
import { DEFAULT_LABELS } from "./config"
import type { AmountInputProps } from "./types"
import {
  compareAmount,
  finalizeText,
  formatAmount,
  sameAmount,
  sanitizeAmount,
  textToValue,
  toDecimalString,
  type SanitizeOptions,
} from "./utils"

/** 读屏播报大写的防抖时间（毫秒）：停手这么久才报一次，敲字过程中不打断读屏。 */
const ANNOUNCE_DELAY = 800

/** 金额输入框：实时千分位、光标不乱跳，下方同步显示人民币大写与大数估读。 */
function AmountInput({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  min,
  max,
  decimals: decimalsProp = 2,
  symbol = "¥",
  label,
  size = "default",
  showUppercase = true,
  showApproximate = true,
  approximateFrom = 10_000,
  readoutPlacement = "below",
  error,
  padDecimals = true,
  labels: labelsProp,
  className,
  id: idProp,
  name,
  form,
  disabled,
  readOnly,
  placeholder,
  inputMode,
  "aria-invalid": ariaInvalid,
  "aria-describedby": describedByProp,
  onFocus,
  onBlur,
  onKeyDown,
  ref,
  ...props
}: AmountInputProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const decimals = Math.max(0, Math.floor(decimalsProp))
  const minText = min === undefined ? undefined : toDecimalString(min)
  const maxText = max === undefined ? undefined : toDecimalString(max)
  const allowNegative = minText !== undefined && minText.startsWith("-")
  const options: SanitizeOptions = { decimals, allowNegative }

  const autoId = React.useId()
  const id = idProp ?? autoId
  const inputRef = React.useRef<HTMLInputElement>(null)
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  })
  const [focused, setFocused] = React.useState(false)
  const [touched, setTouched] = React.useState(false)
  const [text, setText] = React.useState(() =>
    formatAmount(value, options, padDecimals),
  )
  // 外部改了 value（受控）才同步显示文本；内部输入产生的变化文本已经是最新的，不会触发。
  // 只在 value 变化的那一次比较，避免 value 的位数超过 decimals 时反复改写
  const [seenValue, setSeenValue] = React.useState(value)
  if (seenValue !== value) {
    setSeenValue(value)
    if (!sameAmount(value, textToValue(text)))
      setText(formatAmount(value, options, padDecimals && !focused))
  }

  // 整理后要恢复的光标位置；每次都是新对象，保证即使文本没变（敲了非法字符）也会重设光标
  const [caret, setCaret] = React.useState<{ position: number } | null>(null)
  React.useLayoutEffect(() => {
    const input = inputRef.current
    if (caret && input && document.activeElement === input)
      input.setSelectionRange(caret.position, caret.position)
  }, [caret])

  const composing = React.useRef(false)
  const [edits, setEdits] = React.useState(0)

  const commit = (raw: string, rawCaret: number) => {
    const next = sanitizeAmount(raw, rawCaret, options)
    setText(next.text)
    setCaret({ position: next.caret })
    setValue(textToValue(next.text))
    setEdits((count) => count + 1)
  }

  const amount = textToValue(text)
  const numeric = amount === "" ? 0 : Number(amount)
  const uppercase = showUppercase && amount !== "" ? toRmbUppercase(amount) : ""
  const approximate =
    showApproximate && amount !== "" && Math.abs(numeric) >= approximateFrom
      ? `${labels.approximate} ${formatStat(numeric, { digits: 1 })}`
      : ""

  // 越界：超过 max 立即提示（再敲只会更大）；低于 min 要等失焦，否则敲第一位数字就报错。
  // 无论提示与否，越界值都通过 setCustomValidity 拦住表单提交
  const tooLow =
    amount !== "" && minText !== undefined && compareAmount(amount, minText) < 0
  const tooHigh =
    amount !== "" && maxText !== undefined && compareAmount(amount, maxText) > 0
  const limitText = (limit: string) => {
    const digits = Math.max(decimals, limit.split(".")[1]?.length ?? 0)
    const formatted = formatAmount(
      limit,
      { decimals: digits, allowNegative: true },
      true,
    )
    return `${typeof symbol === "string" ? symbol : ""}${formatted}`
  }
  const rangeMessage = tooHigh
    ? labels.aboveMax.replace("{max}", limitText(maxText!))
    : tooLow
      ? labels.belowMin.replace("{min}", limitText(minText!))
      : ""
  React.useEffect(() => {
    inputRef.current?.setCustomValidity(rangeMessage)
  }, [rangeMessage])

  const errorMessage = error || (tooHigh || touched ? rangeMessage : "")
  const invalid =
    Boolean(errorMessage) || ariaInvalid === true || ariaInvalid === "true"

  // 读屏：大写行通过 aria-describedby 在聚焦时朗读；敲字时不逐字播报，
  // 停手 ANNOUNCE_DELAY 毫秒后用 polite 的状态区报一次最新的大写
  const [announcement, setAnnouncement] = React.useState("")
  React.useEffect(() => {
    if (edits === 0 || !focused) return
    const timer = window.setTimeout(
      () =>
        setAnnouncement(uppercase ? `${labels.uppercase} ${uppercase}` : ""),
      ANNOUNCE_DELAY,
    )
    return () => window.clearTimeout(timer)
  }, [edits, focused, uppercase, labels.uppercase])

  // 非受控的表单重置：回到 defaultValue。监听器只挂一次，通过 ref 拿到最新的设置
  const resetRef = React.useRef(() => {})
  React.useEffect(() => {
    resetRef.current = () => {
      setText(formatAmount(defaultValue, options, padDecimals))
      setValue(defaultValue)
    }
  })
  const controlled = valueProp !== undefined
  React.useEffect(() => {
    const element = inputRef.current?.form
    if (!element || controlled) return
    // reset 事件在表单清空之前触发，等一帧再覆盖
    const reset = () => window.setTimeout(() => resetRef.current())
    element.addEventListener("reset", reset)
    return () => element.removeEventListener("reset", reset)
  }, [controlled])

  const uppercaseId = `${id}-uppercase`
  const errorId = `${id}-error`
  const describedBy =
    [
      describedByProp,
      showUppercase && uppercase ? uppercaseId : undefined,
      errorMessage ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined

  const readout =
    showUppercase || approximate ? (
      <AmountInputReadout
        uppercase={uppercase}
        uppercaseId={uppercaseId}
        uppercaseLabel={labels.uppercase}
        placeholder={labels.uppercasePlaceholder}
        showUppercase={showUppercase}
        approximate={approximate}
      />
    ) : null

  return (
    <div
      data-slot="amount-input"
      data-size={size}
      data-invalid={invalid ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      className={cn("flex w-full flex-col gap-1.5", className)}
    >
      {label && (
        <label
          data-slot="amount-input-label"
          htmlFor={id}
          className="text-sm leading-none font-medium"
        >
          {label}
        </label>
      )}
      {readoutPlacement === "above" && readout}
      <div
        data-slot="amount-input-control"
        className={cn(
          amountInputControlVariants({ size }),
          invalid
            ? "border-destructive ring-3 ring-destructive/20 dark:border-destructive/50 dark:ring-destructive/40"
            : "border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          disabled &&
            "cursor-not-allowed bg-input/50 opacity-50 dark:bg-input/80",
          readOnly && "bg-muted/40",
        )}
      >
        {symbol != null && (
          <span
            data-slot="amount-input-symbol"
            aria-hidden="true"
            className="shrink-0 text-muted-foreground select-none"
          >
            {symbol}
          </span>
        )}
        <input
          {...props}
          ref={inputRef}
          id={id}
          data-slot="amount-input-input"
          type="text"
          inputMode={
            inputMode ??
            (allowNegative ? "text" : decimals > 0 ? "decimal" : "numeric")
          }
          autoComplete="off"
          spellCheck={false}
          value={text}
          placeholder={
            placeholder ?? (decimals > 0 ? `0.${"0".repeat(decimals)}` : "0")
          }
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className="h-full min-w-0 flex-1 bg-transparent font-medium tabular-nums outline-none placeholder:font-normal placeholder:text-muted-foreground disabled:cursor-not-allowed"
          onChange={(event) => {
            const input = event.currentTarget
            // 输入法组词期间不整理，否则会打断候选词；组词结束时再统一处理
            if (composing.current) return setText(input.value)
            commit(input.value, input.selectionStart ?? input.value.length)
          }}
          onCompositionStart={() => {
            composing.current = true
          }}
          onCompositionEnd={(event) => {
            composing.current = false
            const input = event.currentTarget
            commit(input.value, input.selectionStart ?? input.value.length)
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event)
            const input = event.currentTarget
            const { selectionStart: start, selectionEnd: end } = input
            if (
              event.defaultPrevented ||
              composing.current ||
              disabled ||
              readOnly ||
              start === null ||
              start !== end ||
              event.altKey ||
              event.ctrlKey ||
              event.metaKey
            )
              return
            // 光标紧贴千分位逗号时，退格 / 删除越过逗号去删旁边的数字，
            // 否则只删了逗号、整理后又长回来，用户会觉得按键没反应
            const current = input.value
            if (event.key === "Backspace" && current[start - 1] === ",") {
              event.preventDefault()
              commit(
                current.slice(0, start - 2) + current.slice(start),
                start - 2,
              )
            } else if (event.key === "Delete" && current[start] === ",") {
              event.preventDefault()
              commit(current.slice(0, start) + current.slice(start + 2), start)
            }
          }}
          onFocus={(event) => {
            setFocused(true)
            onFocus?.(event)
          }}
          onBlur={(event) => {
            setFocused(false)
            setTouched(true)
            const finished = finalizeText(text, decimals, padDecimals)
            if (finished !== text) {
              setText(finished)
              setValue(textToValue(finished))
            }
            onBlur?.(event)
          }}
        />
      </div>
      {readoutPlacement === "below" && readout}
      {errorMessage && (
        <p
          id={errorId}
          data-slot="amount-input-error"
          className="text-xs text-destructive"
        >
          {errorMessage}
        </p>
      )}
      {name && (
        <input
          type="hidden"
          data-slot="amount-input-value"
          name={name}
          form={form}
          value={amount}
          disabled={disabled}
        />
      )}
      <span data-slot="amount-input-status" role="status" className="sr-only">
        {announcement}
      </span>
    </div>
  )
}

export { AmountInput, amountInputControlVariants }
export type { AmountInputProps, AmountInputSize } from "./types"
