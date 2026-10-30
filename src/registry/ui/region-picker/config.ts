/** 用户可见文案。`{level}`、`{count}`、`{limit}`、`{name}` 会被替换成对应的值。 */
const DEFAULT_LABELS = {
  /** 未选时触发器的提示 */
  placeholder: "请选择省 / 市 / 区",
  searchPlaceholder: "搜索名称、拼音或代码",
  searchLabel: "搜索地区",
  /** 当前正在选的那一级，层级标签条里的占位 */
  levelPending: "请选择",
  /** 层级标签条的读屏名称 */
  levelNav: "选择层级",
  /** 读屏播报：进入某一级 */
  levelStatus: "第 {level} 级，共 {count} 项",
  /** 读屏播报：搜索结果数 */
  resultStatus: "找到 {count} 个结果",
  /** 结果被截断时列表下方的提示 */
  resultTruncated: "仅显示前 {limit} 条，输入更多字符可缩小范围",
  empty: "没有匹配的地区",
  loading: "正在加载地区数据…",
  loadFailed: "地区数据加载失败",
  retry: "重试",
  clear: "清除",
  /** 允许选非末级时，底部确认当前路径的按钮 */
  confirmPartial: "选择「{name}」",
  /** 代码找不到又没传 fallbackLabel 时的名称，后面自动加（代码） */
  unknown: "未知地区",
  /** 必填未选时的校验提示 */
  required: "请选择地区",
}

type RegionPickerLabels = typeof DEFAULT_LABELS

/** 搜索结果上限 */
const SEARCH_LIMIT = 50

export { DEFAULT_LABELS, SEARCH_LIMIT }
export type { RegionPickerLabels }
