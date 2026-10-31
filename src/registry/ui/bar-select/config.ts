import type { BarSelectLabels } from "./types"
const defaultLabels: BarSelectLabels = {
  clear: "清除",
  search: "搜索",
  empty: "无匹配结果",
  done: "完成",
  selected: (count) => `已选 ${count} 项`,
  remove: (label) => `移除「${label}」`,
}
export { defaultLabels }
