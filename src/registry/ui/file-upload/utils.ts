import type { FileUploadItem, FileUploadRejection } from "./types"
function formatFileSize(size: number) {
  const unit = size >= 1048576 ? "MB" : size >= 1024 ? "KB" : "B"
  return `${new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 }).format(size / (unit === "MB" ? 1048576 : unit === "KB" ? 1024 : 1))} ${unit}`
}
function acceptsFile(file: File, accept?: string) {
  return (
    !accept?.trim() ||
    accept.split(",").some((part) => {
      const rule = part.trim().toLowerCase()
      if (!rule) return false
      if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule)
      return rule.endsWith("/*")
        ? file.type.toLowerCase().startsWith(rule.slice(0, -1))
        : file.type.toLowerCase() === rule
    })
  )
}
function validateFiles(
  files: File[],
  accept: string | undefined,
  maxSize: number,
  available: number,
) {
  const accepted: FileUploadItem[] = []
  const rejected: FileUploadRejection[] = []
  for (const file of files) {
    const reason = !acceptsFile(file, accept)
      ? "type"
      : file.size > maxSize
        ? "size"
        : accepted.length >= available
          ? "count"
          : null
    if (reason) rejected.push({ file, reason })
    else accepted.push({ id: createId(), file, status: "pending" })
  }
  return { accepted, rejected }
}
let seed = 0
/** 局域网 http 页面（非安全上下文）没有 crypto.randomUUID，用自增序号兜底 */
function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `file-${Date.now().toString(36)}-${++seed}`
}

const MIME_NAMES: Record<string, string> = {
  "image/*": "图片",
  "video/*": "视频",
  "audio/*": "音频",
  "application/pdf": "PDF",
}

/** 把 accept 转成给人看的格式说明：`image/*,.pdf` → 「图片、PDF」 */
function describeAccept(accept: string) {
  const names = accept
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
    .map(
      (rule) =>
        MIME_NAMES[rule] ??
        (rule.startsWith(".")
          ? rule.slice(1).toUpperCase()
          : (rule.split("/")[1] ?? rule).toUpperCase()),
    )
  return [...new Set(names)].join("、")
}

/** 提交时显式追加文件，不修改原生 file input。 */
function appendFiles(
  formData: FormData,
  name: string,
  items: FileUploadItem[],
) {
  for (const item of items) formData.append(name, item.file, item.file.name)
}
function interpolate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    String(values[key] ?? match),
  )
}
export {
  appendFiles,
  acceptsFile,
  describeAccept,
  formatFileSize,
  validateFiles,
  interpolate,
}
