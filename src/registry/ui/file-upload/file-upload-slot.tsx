"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useControllableState } from "@/registry/hooks/use-controllable-state"
import { FileUploadPreview, IdCardFrontIllustration } from "./file-upload-parts"
import { useFileSelection, useFileUploadReset } from "./use-file-selection"
import { interpolate } from "./utils"
import type { FileUploadSlotProps } from "./types"
function FileUploadSlot({
  label,
  placeholder,
  value: prop,
  defaultValue = null,
  onValueChange,
  accept = "image/*",
  maxSize = Infinity,
  capture = "environment",
  error,
  disabled,
  labels: overrides,
  onReject,
  className,
  ...props
}: FileUploadSlotProps) {
  const [item, setItem] = useControllableState({
    prop,
    defaultProp: defaultValue,
    onChange: onValueChange,
  })
  const { input, labels, message, clear, select } = useFileSelection({
    accept,
    maxSize,
    multiple: false,
    labels: overrides,
    onReject,
  })
  useFileUploadReset(input, () => {
    if (prop === undefined) setItem(defaultValue)
    clear()
  })
  const errorId = React.useId()
  // 被拒文件只在下方出一行说明，不把整个控件标成出错；出错态只跟随外部 error
  const invalid = Boolean(error || props["aria-invalid"])
  return (
    <div
      data-slot="file-upload-slot"
      className={cn("@container min-w-0", className)}
      {...props}
    >
      <p className="mb-2 text-sm font-medium">{label}</p>
      <input
        data-slot="file-upload-slot-input"
        ref={input}
        type="file"
        className="hidden"
        accept={accept}
        capture={capture || undefined}
        disabled={disabled}
        onChange={(event) => {
          const next = select(Array.from(event.target.files ?? []), 0)
          if (next[0]) setItem(next[0])
          event.target.value = ""
        }}
      />
      <div
        data-slot="file-upload-slot-control"
        aria-invalid={invalid || undefined}
        className={cn(
          "relative aspect-[1.58] rounded-xl border border-edge bg-muted/40 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          !item && "border-dashed",
        )}
      >
        {item ? (
          <>
            <FileUploadPreview file={item.file} className="rounded-xl" />
            <div className="absolute right-2 bottom-2 flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={disabled}
                onClick={() => input.current?.click()}
              >
                {labels.replace}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={disabled}
                aria-label={interpolate(labels.remove, {
                  name: item.file.name,
                })}
                onClick={() => {
                  setItem(null)
                  clear()
                }}
              >
                {labels.delete}
              </Button>
            </div>
          </>
        ) : (
          <button
            data-slot="file-upload-slot-trigger"
            type="button"
            disabled={disabled}
            aria-describedby={invalid || message ? errorId : undefined}
            className="flex size-full flex-col items-center justify-center gap-3 rounded-xl text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
            onClick={() => input.current?.click()}
          >
            {placeholder ?? (
              <IdCardFrontIllustration className="w-24 text-muted-foreground" />
            )}
            <span>{interpolate(labels.upload, { label })}</span>
          </button>
        )}
      </div>
      <div
        data-slot="file-upload-slot-error"
        id={errorId}
        aria-live="polite"
        className="mt-2 text-xs text-destructive"
      >
        {error || message}
      </div>
    </div>
  )
}
export { FileUploadSlot }
