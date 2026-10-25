import { siteConfig } from "@/config/site"
import registry from "../../../registry.json"

export type RegistryFile = { path: string; type: string; target?: string }
export type RegistryItem = {
  name: string
  type: string
  title: string
  description: string
  dependencies?: string[]
  registryDependencies?: string[]
  files: RegistryFile[]
  meta?: { iframeHeight?: string }
}

export const entrySections = {
  blocks: { type: "registry:block", title: "区块", label: "BLOCKS" },
  templates: { type: "registry:page", title: "页面模板", label: "TEMPLATES" },
} as const
export type EntrySection = keyof typeof entrySections

const items = registry.items as RegistryItem[]

export function getRegistryItem(name: string) {
  const item = items.find((entry) => entry.name === name)
  if (!item) throw new Error(`未登记的 Registry 条目：${name}`)
  return item
}

/** 某个分区下的 registry 条目（按 registry.json 中的顺序）。 */
export function sectionItems(section: EntrySection) {
  return items.filter((item) => item.type === entrySections[section].type)
}

/** 可以在 /view/<name>/ 整页预览的条目：区块与页面模板。 */
export function viewItems() {
  return [...sectionItems("blocks"), ...sectionItems("templates")]
}

/** 「在 v0 中打开」：v0 读取 registry JSON 并生成可编辑的项目。 */
export function v0Url(name: string) {
  return `https://v0.dev/chat/api/open?url=${siteConfig.url}/r/${name}.json`
}

export function hasRegistryItem(name: string) {
  return items.some((entry) => entry.name === name)
}
