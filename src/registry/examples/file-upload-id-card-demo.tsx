"use client"
import {
  FileUploadSlot,
  IdCardBackIllustration,
} from "@/registry/ui/file-upload/file-upload"
export default function FileUploadIdCardDemo() {
  return (
    <div className="@container w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium">身份证照片</h3>
        <span className="font-mono text-xs text-muted-foreground">
          正反两面
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2">
        <FileUploadSlot label="人像面" maxSize={10 * 1024 * 1024} />
        <FileUploadSlot
          label="国徽面"
          maxSize={10 * 1024 * 1024}
          placeholder={
            <IdCardBackIllustration className="w-24 text-muted-foreground" />
          }
        />
      </div>
    </div>
  )
}
