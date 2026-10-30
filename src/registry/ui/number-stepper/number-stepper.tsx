"use client"

import * as React from "react"
import { NumberField } from "@base-ui/react/number-field"
import { cva } from "class-variance-authority"
import { Loader2, Minus, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import type { NumberStepperLabels, NumberStepperProps } from "./types"
import { useNumberStepper } from "./use-number-stepper"

const DEFAULT_LABELS: NumberStepperLabels = {
  decrement: "减少",
  increment: "增加",
  input: "数量",
  pending: "正在保存数量",
  commitError: "保存失败，请重试",
}

const numberStepperControlVariants = cva(
  "flex min-w-0 items-center rounded-md border border-edge bg-muted/60 text-sm transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50 data-pointer-focus:has-[:focus-visible]:ring-0 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        sm: "h-7 pointer-coarse:h-9",
        default: "h-8 pointer-coarse:h-10",
        lg: "h-9 pointer-coarse:h-11",
      },
    },
    defaultVariants: { size: "default" },
  },
)

/** 带边界、长按步进和异步回滚的方条数量选择。 */
function NumberStepper({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  onValueCommit,
  onCommitError,
  min = 0,
  max,
  step = 1,
  smallStep = step === "any" ? 1 : step,
  largeStep = step === "any" ? 10 : step * 10,
  allowWheelScrub = false,
  locale = "zh-CN",
  label,
  size = "default",
  disabled = false,
  readOnly = false,
  error,
  labels: labelsProp,
  className,
  id: idProp,
  "aria-label": ariaLabel,
  "aria-labelledby": labelledBy,
  "aria-invalid": ariaInvalid,
  "aria-describedby": describedBy,
  ...props
}: NumberStepperProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const autoId = React.useId()
  const id = idProp ?? autoId
  const inputRef = React.useRef<HTMLInputElement>(null)
  // 最近一次是按哪个键改的数：保存时让那个按钮转圈，数字照常显示，用户看得到自己改成了几
  // 点加减按钮时 Base UI 会把焦点移到中间的输入框，而文本输入框一聚焦就匹配 :focus-visible，
  // 焦点环会在每次点按后出现。记下「这次焦点是点按钮带来的」，按任意键后恢复
  const [pointerFocus, setPointerFocus] = React.useState(false)
  const [lastAction, setLastAction] = React.useState<"decrement" | "increment">(
    "increment",
  )
  const { value, pending, commitError, change, commit, reset } =
    useNumberStepper({
      value: valueProp,
      defaultValue,
      onValueChange,
      onValueCommit,
      onCommitError,
    })
  const resetRef = React.useRef(reset)
  React.useEffect(() => {
    resetRef.current = reset
  })
  React.useEffect(() => {
    const form = inputRef.current?.form
    if (!form || valueProp !== undefined) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const onReset = (event: Event) => {
      timer = setTimeout(() => {
        if (!event.defaultPrevented) {
          // 先结束手动编辑，让 NumberField 恢复文本同步；reset 会取消这次失焦提交。
          inputRef.current?.blur()
          resetRef.current()
        }
      })
    }
    form.addEventListener("reset", onReset)
    return () => {
      clearTimeout(timer)
      form.removeEventListener("reset", onReset)
    }
  }, [valueProp, props.form])

  const message =
    error ||
    (commitError?.cause instanceof Error
      ? commitError.cause.message || labels.commitError
      : commitError
        ? labels.commitError
        : null)
  const invalid =
    Boolean(message) ||
    (ariaInvalid !== undefined &&
      ariaInvalid !== false &&
      ariaInvalid !== "false")
  const errorId = `${id}-error`
  const description =
    [describedBy, message ? errorId : undefined].filter(Boolean).join(" ") ||
    undefined
  const buttonSize =
    size === "sm" ? "icon-sm" : size === "lg" ? "icon-lg" : "icon"
  const buttonClass = buttonVariants({
    variant: "ghost",
    size: buttonSize,
    // 方条边框已占 2px；按钮高度取自 size，负边距让点击区仍覆盖整条高度。
    className:
      "-my-px touch-manipulation rounded-none border-0 border-edge text-muted-foreground transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-40 disabled:opacity-40",
  })

  function handleCommit(next: number | null) {
    if (disabled || readOnly || pending) return
    // NumberField 只在步进时 snap，直接输入失焦时在这里按 min 对齐。
    const snapped =
      next === null || step === "any" || step <= 0
        ? next
        : Number((min + Math.round((next - min) / step) * step).toPrecision(15))
    commit(
      snapped === null
        ? null
        : Math.min(max ?? Infinity, Math.max(min, snapped)),
    )
  }

  return (
    <NumberField.Root
      {...props}
      id={id}
      data-slot="number-stepper"
      data-size={size}
      data-invalid={invalid ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      data-readonly={readOnly || pending ? "" : undefined}
      aria-busy={pending || undefined}
      className={cn(
        "inline-flex max-w-full flex-col gap-1.5 align-middle",
        label && "w-full",
        className,
      )}
      value={value}
      min={min}
      max={max}
      step={step}
      smallStep={smallStep}
      largeStep={largeStep}
      snapOnStep
      locale={locale}
      allowWheelScrub={allowWheelScrub}
      disabled={disabled}
      readOnly={readOnly || pending}
      onValueChange={change}
      onValueCommitted={handleCommit}
    >
      <NumberField.Group
        data-slot="number-stepper-control"
        data-pointer-focus={pointerFocus ? "" : undefined}
        aria-invalid={invalid || undefined}
        onPointerDown={(event) => {
          if ((event.target as Element).closest("button")) setPointerFocus(true)
        }}
        // 用捕获阶段：方向键会被 Base UI 在输入框上处理掉，冒泡阶段收不到
        onKeyDownCapture={() => setPointerFocus(false)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setPointerFocus(false)
        }}
        className={cn(
          numberStepperControlVariants({ size }),
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        {label && (
          <label
            data-slot="number-stepper-label"
            htmlFor={id}
            className="mr-auto min-w-0 truncate px-3 text-muted-foreground"
          >
            {label}
          </label>
        )}
        <NumberField.Decrement
          data-slot="number-stepper-decrement"
          onPointerDown={() => setLastAction("decrement")}
          aria-label={labels.decrement}
          disabled={pending || readOnly || (value !== null && value <= min)}
          className={cn(
            buttonClass,
            "-ml-px border-r border-edge first:rounded-l-md",
          )}
        >
          {pending && lastAction === "decrement" ? (
            <Loader2
              data-slot="number-stepper-spinner"
              aria-hidden="true"
              className="motion-safe:animate-spin"
            />
          ) : (
            <Minus aria-hidden="true" />
          )}
        </NumberField.Decrement>
        <div className="relative min-w-0">
          <NumberField.Input
            ref={inputRef}
            data-slot="number-stepper-input"
            role="spinbutton"
            aria-roledescription={undefined}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value ?? undefined}
            aria-label={ariaLabel ?? (label ? undefined : labels.input)}
            aria-labelledby={labelledBy}
            aria-invalid={invalid || undefined}
            aria-describedby={description}
            inputMode="numeric"
            form={props.form}
            className={cn(
              "field-sizing-content min-h-0 max-w-24 min-w-10 bg-transparent px-2 text-center text-sm font-medium tabular-nums outline-none pointer-coarse:text-base",
              pending && "text-muted-foreground",
            )}
            onKeyDown={(event) => {
              if (["ArrowDown", "PageDown", "Home"].includes(event.key))
                setLastAction("decrement")
              else if (["ArrowUp", "PageUp", "End"].includes(event.key))
                setLastAction("increment")
              if (
                event.key === "Enter" &&
                !event.nativeEvent.isComposing &&
                !disabled &&
                !readOnly &&
                !pending
              ) {
                event.preventDefault()
                event.currentTarget.blur()
              }
            }}
          />
        </div>
        <NumberField.Increment
          data-slot="number-stepper-increment"
          onPointerDown={() => setLastAction("increment")}
          aria-label={labels.increment}
          disabled={
            pending ||
            readOnly ||
            (value !== null && max !== undefined && value >= max)
          }
          className={cn(
            buttonClass,
            "-mr-px rounded-r-md border-l border-edge",
          )}
        >
          {pending && lastAction === "increment" ? (
            <Loader2
              data-slot="number-stepper-spinner"
              aria-hidden="true"
              className="motion-safe:animate-spin"
            />
          ) : (
            <Plus aria-hidden="true" />
          )}
        </NumberField.Increment>
      </NumberField.Group>
      {message && (
        <p
          id={errorId}
          data-slot="number-stepper-error"
          role="alert"
          className="text-xs text-destructive"
        >
          {message}
        </p>
      )}
      <span role="status" className="sr-only">
        {pending ? labels.pending : ""}
      </span>
    </NumberField.Root>
  )
}

export { NumberStepper, numberStepperControlVariants }
export type {
  NumberStepperLabels,
  NumberStepperProps,
  NumberStepperSize,
} from "./types"
