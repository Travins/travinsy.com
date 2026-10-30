"use client"
import { FileUpload } from "@/registry/ui/file-upload/file-upload"
export default function FileUploadDemo() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium">申请附件</h3>
        <span className="font-mono text-xs text-muted-foreground">
          最多 5 个
        </span>
      </div>
      <FileUpload
        accept="image/*,.pdf"
        maxSize={10 * 1024 * 1024}
        maxFiles={5}
      />
    </div>
  )
}
