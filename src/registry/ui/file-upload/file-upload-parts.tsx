"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

function FileUploadPreview({
  file,
  className,
}: {
  file: File
  className?: string
}) {
  const image = React.useRef<HTMLImageElement>(null)
  const [failed, setFailed] = React.useState<File | null>(null)
  React.useEffect(() => {
    if (!file.type.startsWith("image/") || !image.current) return
    const url = URL.createObjectURL(file)
    image.current.src = url
    return () => URL.revokeObjectURL(url)
  }, [file])
  return (
    <span
      data-slot="file-upload-preview"
      className={cn(
        "flex size-full items-center justify-center overflow-hidden text-xs text-muted-foreground",
        className,
      )}
    >
      {file.type.startsWith("image/") && failed !== file ? (
        // objectURL 在 effect 中赋给原生图片，避免渲染期分配资源。
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={image}
          alt=""
          className="size-full object-cover"
          onError={() => setFailed(file)}
        />
      ) : (
        <span className="font-mono uppercase">
          {file.name.split(".").pop()?.slice(0, 6)}
        </span>
      )}
    </span>
  )
}
function IdCardFrontIllustration(props: React.ComponentProps<"svg">) {
  return (
    <svg
      data-slot="id-card-front-illustration"
      viewBox="0 0 158 100"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      <rect x="4" y="4" width="150" height="92" rx="8" />
      <circle cx="116" cy="37" r="12" />
      <path d="M96 74v-8a20 20 0 0 1 40 0v8M22 29h49M22 45h40M22 61h49M22 79h63" />
    </svg>
  )
}
function IdCardBackIllustration(props: React.ComponentProps<"svg">) {
  return (
    <svg
      data-slot="id-card-back-illustration"
      viewBox="0 0 158 100"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      <rect x="4" y="4" width="150" height="92" rx="8" />
      <circle cx="79" cy="32" r="15" />
      <circle cx="79" cy="32" r="8" />
      <path d="M35 65h88M49 80h60" />
    </svg>
  )
}
export { FileUploadPreview, IdCardFrontIllustration, IdCardBackIllustration }
