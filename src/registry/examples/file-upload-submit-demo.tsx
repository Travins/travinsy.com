"use client"
import * as React from "react"
import {
  FileUpload,
  type FileUploadItem,
} from "@/registry/ui/file-upload/file-upload"
import { Button } from "@/components/ui/button"

export default function FileUploadSubmitDemo() {
  const [items, setItems] = React.useState<FileUploadItem[]>([])
  const [busy, setBusy] = React.useState(false)
  const timers = React.useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const failed = React.useRef<string | null>(null)
  React.useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach(clearTimeout)
    }
  }, [])
  function pause() {
    return new Promise<void>((resolve) => {
      const timer = setTimeout(() => {
        timers.current.delete(timer)
        resolve()
      }, 180)
      timers.current.add(timer)
    })
  }
  async function upload(batch: FileUploadItem[], retry = false) {
    setBusy(true)
    for (const item of batch) {
      for (const progress of [0, 20, 40, 60, 80, 100]) {
        setItems((all) =>
          all.map((v) =>
            v.id === item.id
              ? { ...v, status: "uploading", progress, error: undefined }
              : v,
          ),
        )
        await pause()
      }
      const shouldFail = !retry && failed.current === null
      if (shouldFail) failed.current = item.id
      setItems((all) =>
        all.map((v) =>
          v.id === item.id
            ? {
                ...v,
                status: shouldFail ? "error" : "done",
                error: shouldFail ? "模拟上传失败，请重试" : undefined,
              }
            : v,
        ),
      )
    }
    setBusy(false)
  }
  const done = items.length > 0 && items.every((v) => v.status === "done")
  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium">提交申请</h3>
        <span className="font-mono text-xs text-muted-foreground">
          模拟上传
        </span>
      </div>
      <FileUpload
        value={items}
        onValueChange={setItems}
        disabled={busy}
        accept="image/*,.pdf"
        maxSize={10 * 1024 * 1024}
        maxFiles={5}
        onRetry={(item) => void upload([item], true)}
      />
      <div className="mt-3 flex flex-col gap-2">
        <Button
          type="button"
          size="default"
          disabled={
            busy ||
            done ||
            !items.some((v) => !v.status || v.status === "pending")
          }
          onClick={() =>
            void upload(
              items.filter((v) => !v.status || v.status === "pending"),
            )
          }
        >
          {done ? "已提交" : busy ? "提交中…" : "提交"}
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        首次提交的第一个文件会失败，点它右侧的重试按钮单独重传。
      </p>
    </div>
  )
}
