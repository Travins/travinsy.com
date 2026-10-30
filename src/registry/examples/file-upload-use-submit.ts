"use client"
import * as React from "react"
import type { FileUploadItem } from "@/registry/ui/file-upload/file-upload"

export function useFileUploadSubmit() {
  const [items, setItems] = React.useState<FileUploadItem[]>([])
  const [busy, setBusy] = React.useState(false)
  const failed = React.useRef(false)
  const timers = React.useRef(new Set<ReturnType<typeof setTimeout>>())
  const alive = React.useRef(true)
  React.useEffect(() => {
    alive.current = true
    const pending = timers.current
    return () => {
      alive.current = false
      pending.forEach(clearTimeout)
    }
  }, [])
  async function upload(batch: FileUploadItem[], retry = false) {
    setBusy(true)
    for (const item of batch) {
      for (const progress of [0, 25, 50, 75, 100]) {
        if (!alive.current) return
        setItems((all) =>
          all.map((value) =>
            value.id === item.id
              ? { ...value, status: "uploading", progress, error: undefined }
              : value,
          ),
        )
        await new Promise<void>((resolve) => {
          const timer = setTimeout(() => {
            timers.current.delete(timer)
            resolve()
          }, 160)
          timers.current.add(timer)
        })
      }
      if (!alive.current) return
      const reject = !retry && item.id === "国徽面" && !failed.current
      if (reject) failed.current = true
      setItems((all) =>
        all.map((value) =>
          value.id === item.id
            ? {
                ...value,
                status: reject ? "error" : "done",
                error: reject ? "模拟上传失败，请重试" : undefined,
              }
            : value,
        ),
      )
    }
    if (alive.current) setBusy(false)
  }
  function slot(label: string) {
    return {
      value: items.find((item) => item.id === label) ?? null,
      onValueChange: (item: FileUploadItem | null) =>
        setItems((all) => [
          ...all.filter((value) => value.id !== label),
          ...(item
            ? [
                {
                  ...item,
                  id: label,
                },
              ]
            : []),
        ]),
      onRetry: (item: FileUploadItem) => void upload([item], true),
      disabled: busy,
    }
  }
  const done =
    items.length >= 2 && items.every((item) => item.status === "done")
  const ready = ["人像面", "国徽面"].every((label) =>
    items.some((item) => item.id === label),
  )
  return { items, setItems, busy, done, ready, slot, upload }
}
