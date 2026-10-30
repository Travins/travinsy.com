"use client"
import { Button } from "@/components/ui/button"
import { useFileUploadSubmit } from "./file-upload-use-submit"
import {
  FileUpload,
  FileUploadSlot,
  IdCardBackIllustration,
} from "@/registry/ui/file-upload/file-upload"
import { BatteryFull, Signal, Wifi } from "lucide-react"
export default function FileUploadMobileDemo() {
  const form = useFileUploadSubmit()
  return (
    <div className="max-w-full rounded-[3.875rem] border border-edge bg-muted p-2 shadow-lg max-sm:contents">
      <div className="relative flex aspect-[402/874] w-[402px] max-w-full flex-col overflow-clip rounded-[3.375rem] bg-background max-sm:aspect-auto max-sm:min-h-[calc(100dvh-3rem)] max-sm:w-full max-sm:rounded-none">
        <div className="relative flex h-[54px] shrink-0 items-center justify-between px-[8%] pt-1 text-sm font-semibold max-sm:hidden">
          <span>9:41</span>
          <span
            aria-hidden="true"
            className="absolute top-[11px] left-1/2 h-[37px] w-[31%] -translate-x-1/2 rounded-full bg-foreground"
          />
          <span aria-hidden="true" className="flex gap-1.5">
            <Signal className="size-4" />
            <Wifi className="size-4" />
            <BatteryFull className="size-5" />
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 pt-6 pb-10">
          <div>
            <h3 className="text-2xl font-semibold">补充申请资料</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              请上传清晰、完整的证件照片。
            </p>
          </div>
          <FileUploadSlot {...form.slot("人像面")} label="人像面" />
          <FileUploadSlot
            {...form.slot("国徽面")}
            label="国徽面"
            placeholder={
              <IdCardBackIllustration className="w-24 text-muted-foreground" />
            }
          />
          <FileUpload
            value={form.items.filter(
              (item) => !["人像面", "国徽面"].includes(item.id),
            )}
            onValueChange={(attachments) =>
              form.setItems((all) => [
                ...all.filter((item) => ["人像面", "国徽面"].includes(item.id)),
                ...attachments,
              ])
            }
            onRetry={(item) => void form.upload([item], true)}
            disabled={form.busy}
            accept="image/*,.pdf"
            maxFiles={5}
            maxSize={10 * 1024 * 1024}
          />
        </div>
        <div className="sticky bottom-0 border-t border-border bg-background px-6 pt-3 pb-7">
          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={form.busy || form.done || !form.ready}
            onClick={() =>
              void form.upload(
                form.items.filter(
                  (item) => item.status !== "done" && item.status !== "error",
                ),
              )
            }
          >
            {form.done ? "已提交" : form.busy ? "提交中…" : "提交"}
          </Button>
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-foreground max-sm:hidden"
        />
      </div>
    </div>
  )
}
