"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/hooks/use-controllable-state"

import { DEFAULT_LABELS } from "./config"
import { RegionPickerPanel } from "./region-picker-panel"
import { regionPickerTriggerVariants } from "./region-picker-parts"
import type { RegionOption, RegionPickerProps } from "./types"
import { createRegionIndex, formatRegionPath } from "./utils"

const EMPTY_PATH: RegionOption[] = []

/** 省市区选择：触发器 + 搜索与分级浏览浮层。数据通过 `regions` 传入，函数形式会惰性加载。 */
function RegionPicker({
  regions,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  depth,
  allowPartial = false,
  name,
  form,
  required = false,
  disabled,
  placeholder,
  fallbackLabel,
  title: titleProp,
  size = "default",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  labels: labelsProp,
  className,
  ref,
  ...props
}: RegionPickerProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const maxDepth =
    depth === undefined ? Infinity : Math.max(1, Math.floor(depth))

  const triggerRef = React.useRef<HTMLButtonElement>(null)
  React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement)
  const searchRef = React.useRef<HTMLInputElement>(null)
  const proxyRef = React.useRef<HTMLInputElement>(null)

  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })

  // 惰性加载：浮层第一次打开、或已有值需要显示路径时才调用，且只调用一次。
  // 加载函数放进 ref，调用方每次渲染都写内联箭头函数也不会重复请求。
  const [lazyData, setLazyData] = React.useState<RegionOption[] | null>(null)
  const [failed, setFailed] = React.useState(false)
  const [attempt, setAttempt] = React.useState(0)
  const loaderRef = React.useRef(regions)
  const requestRef = React.useRef<Promise<RegionOption[]> | null>(null)
  React.useEffect(() => {
    loaderRef.current = regions
  })

  // 受控与非受控都要拿到当前值，下面的 onChange 里用它反查路径
  const indexRef = React.useRef<ReturnType<typeof createRegionIndex> | null>(
    null,
  )
  const [code, setCode] = useControllableState<string | null>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: (next) =>
      onValueChange?.(
        next,
        (next && indexRef.current?.byCode.get(next)) || EMPTY_PATH,
      ),
  })

  const lazy = typeof regions === "function"
  const wantsData = lazy && (open || code !== null)
  React.useEffect(() => {
    if (!wantsData || lazyData) return
    const loader = loaderRef.current
    if (typeof loader !== "function") return
    const request = (requestRef.current ??= loader())
    let stale = false
    request.then(
      (data) => {
        if (!stale) setLazyData(data)
      },
      () => {
        if (!stale) setFailed(true)
      },
    )
    return () => {
      stale = true
    }
  }, [wantsData, lazyData, attempt])

  const retry = () => {
    requestRef.current = null
    setFailed(false)
    setAttempt((count) => count + 1)
  }

  const data = lazy ? lazyData : regions
  // 数据一到就建一次索引（搜索、回显路径都靠它），数据与 depth 不变就不重建
  const index = React.useMemo(
    () => (data ? createRegionIndex(data, { depth: maxDepth }) : null),
    [data, maxDepth],
  )
  React.useEffect(() => {
    indexRef.current = index
  })

  const valuePath = (code !== null && index?.byCode.get(code)) || EMPTY_PATH
  const status = index ? "ready" : failed ? "error" : "loading"

  // 触发器文字：找得到就显示路径；加载中或代码失效时用调用方存的名称兜底
  let text: React.ReactNode = null
  let title: string | undefined
  if (code !== null) {
    if (valuePath.length) {
      title = formatRegionPath(valuePath)
      text = valuePath.map((node, i) => (
        <React.Fragment key={node.code}>
          {i > 0 && <span className="text-muted-foreground/60"> / </span>}
          {node.name}
        </React.Fragment>
      ))
    } else {
      title =
        fallbackLabel ??
        (status === "loading" && lazy
          ? labels.loading
          : `${labels.unknown}（${code}）`)
      text = title
    }
  }

  const commit = (path: RegionOption[]) => {
    setCode(path.length ? path[path.length - 1].code : null)
    setOpen(false)
  }

  // 表单：同名的隐藏输入负责提交代码；它是可校验的文本输入，所以 required 能拦住提交、
  // 浏览器的气泡提示也有地方挂。覆盖在触发器上，聚焦时转交给触发器。
  React.useEffect(() => {
    proxyRef.current?.setCustomValidity(
      required && code === null ? labels.required : "",
    )
  }, [required, code, labels.required])

  // 非受控的表单重置回到初始值；reset 事件在表单清空之前触发，等一帧再覆盖
  const controlled = valueProp !== undefined
  React.useEffect(() => {
    const element = proxyRef.current?.form
    if (!element || controlled) return
    const reset = () => window.setTimeout(() => setCode(defaultValue))
    element.addEventListener("reset", reset)
    return () => element.removeEventListener("reset", reset)
  }, [controlled, defaultValue, setCode])

  return (
    <div
      data-slot="region-picker"
      data-size={size}
      data-disabled={disabled ? "" : undefined}
      className={cn("relative w-full", className)}
    >
      <Popover open={open} onOpenChange={(next) => setOpen(next)}>
        <PopoverTrigger
          {...props}
          ref={triggerRef}
          data-slot="region-picker-trigger"
          disabled={disabled}
          title={title ?? titleProp}
          aria-busy={
            code !== null && !index && !failed && lazy ? true : undefined
          }
          className={regionPickerTriggerVariants({ size })}
        >
          <span
            data-slot="region-picker-value-text"
            className={cn(
              "min-w-0 flex-1 truncate",
              code === null && "text-muted-foreground",
            )}
          >
            {code === null ? (placeholder ?? labels.placeholder) : text}
          </span>
          <ChevronDown
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[26rem] max-w-[calc(100vw-1rem)] min-w-(--anchor-width) gap-0"
          // 触屏上不自动聚焦搜索框，免得弹出软键盘盖住列表
          initialFocus={(type) => (type === "touch" ? true : searchRef.current)}
        >
          <RegionPickerPanel
            index={index}
            status={status}
            labels={labels}
            value={code}
            valuePath={valuePath}
            depth={maxDepth}
            allowPartial={allowPartial}
            required={required}
            inputRef={searchRef}
            onRetry={retry}
            onCommit={commit}
          />
        </PopoverContent>
      </Popover>
      <input
        ref={proxyRef}
        data-slot="region-picker-value"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        name={name}
        form={form}
        required={required}
        disabled={disabled}
        value={code ?? ""}
        onChange={() => {}}
        onFocus={() => triggerRef.current?.focus()}
        className="pointer-events-none absolute inset-0 size-full opacity-0"
      />
    </div>
  )
}

export { RegionPicker, regionPickerTriggerVariants }
export type {
  RegionOption,
  RegionPickerProps,
  RegionPickerSize,
  RegionsSource,
} from "./types"
