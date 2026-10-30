"use client"
import { Check } from "lucide-react"
import { FileUploadCamera } from "./file-upload-camera"
import * as React from "react"
import { RotateCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useControllableState } from "@/registry/hooks/use-controllable-state"
import { FileUploadPreview, IdCardFrontIllustration } from "./file-upload-parts"
import { useFileSelection, useFileUploadReset } from "./use-file-selection"
import { interpolate } from "./utils"
import type { FileUploadSlotProps } from "./types"
function FileUploadSlot({
  label,
  viewfinder = "id-card",
  onRetry,
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
  const [cameraOpen, setCameraOpen] = React.useState(false)
  const [cameraError, setCameraError] = React.useState("")
  const album = React.useRef<HTMLInputElement>(null)
  const busy = disabled || item?.status === "uploading"
  function choose() {
    setCameraError("")
    if (
      viewfinder &&
      capture &&
      matchMedia("(pointer: coarse)").matches &&
      typeof navigator.mediaDevices?.getUserMedia === "function" &&
      window.isSecureContext
    )
      setCameraOpen(true)
    else input.current?.click()
  }
  function receive(file: File) {
    setCameraError("")
    const next = select([file], 0)
    if (next[0]) setItem(next[0])
  }
  const errorId = React.useId()
  // 被拒文件只在下方说明；外部错误或上传失败会把槽位标红。
  const invalid = Boolean(
    error || item?.status === "error" || props["aria-invalid"],
  )
  return (
    <div
      data-slot="file-upload-slot"
      className={cn("@container min-w-0", className)}
      {...props}
    >
      {cameraOpen && (
        <FileUploadCamera
          label={label}
          labels={labels}
          placeholder={placeholder}
          onClose={() => setCameraOpen(false)}
          onSelect={(file) => {
            receive(file)
            setCameraOpen(false)
          }}
          onAlbum={() => {
            setCameraOpen(false)
            album.current?.click()
          }}
          onError={() => {
            setCameraOpen(false)
            setCameraError(labels.cameraFallback)
            input.current?.click()
          }}
        />
      )}
      <input
        ref={album}
        type="file"
        accept={accept}
        className="hidden"
        disabled={busy}
        onChange={(event) => {
          if (event.target.files?.[0]) receive(event.target.files[0])
          event.target.value = ""
        }}
      />
      <p className="mb-2 text-sm font-medium">{label}</p>
      <input
        data-slot="file-upload-slot-input"
        ref={input}
        type="file"
        className="hidden"
        accept={accept}
        capture={capture || undefined}
        disabled={busy}
        onChange={(event) => {
          setCameraError("")
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
            {item.status === "done" && (
              <span className="absolute top-2 right-2 rounded-full bg-primary p-1 text-primary-foreground">
                <Check className="size-3" aria-hidden="true" />
                <span className="sr-only">{labels.uploaded}</span>
              </span>
            )}
            {item.status === "uploading" && (
              <div
                className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl bg-background/70"
                role="progressbar"
                aria-label={labels.uploading}
                aria-valuenow={Math.round(item.progress ?? 0)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span className="font-mono text-sm font-medium tabular-nums">
                  {Math.round(item.progress ?? 0)}%
                </span>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${Math.max(0, Math.min(100, item.progress ?? 0))}%`,
                    }}
                  />
                </div>
              </div>
            )}
            {/* 上传中不给操作，避免在请求途中被替换或删除 */}
            {item.status !== "uploading" && (
              <div className="absolute right-2 bottom-2 flex gap-2">
                {item.status === "error" && onRetry ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={disabled}
                    aria-label={interpolate(labels.retry, { name: label })}
                    onClick={() => onRetry(item)}
                  >
                    <RotateCw aria-hidden="true" />
                    {labels.retryShort}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={choose}
                  >
                    {labels.replace}
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy}
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
            )}
          </>
        ) : (
          <button
            data-slot="file-upload-slot-trigger"
            type="button"
            disabled={busy}
            aria-describedby={invalid || message ? errorId : undefined}
            className="flex size-full flex-col items-center justify-center gap-3 rounded-xl text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
            onClick={choose}
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
        {error || item?.error || cameraError || message}
      </div>
    </div>
  )
}
export { FileUploadSlot }
