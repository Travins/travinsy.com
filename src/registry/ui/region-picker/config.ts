/** 用户可见文案。`{level}`、`{count}`、`{limit}`、`{name}`、`{step}` 会被替换成对应的值。 */
const DEFAULT_LABELS = {
  /** 未选时触发器的提示 */
  placeholder: "请选择省 / 市 / 区",
  /** 手机底部面板的标题 */
  title: "选择地区",
  close: "关闭",
  searchPlaceholder: "搜索名称、拼音或首字母",
  searchLabel: "搜索地区",
  /**
   * 各步的名称，按「从最深一级往上对齐」取用：直辖市只有两级时，第二步叫「区县」而不是「城市」。
   * 数据比这里更深时，多出的步骤用 `stepFallback`
   */
  levels: ["省份", "城市", "区县", "乡镇"] as string[],
  stepFallback: "第 {step} 级",
  /** 当前正在选的那一步 */
  stepPending: "请选择{level}",
  /** 步骤条的读屏名称 */
  stepsNav: "选择步骤",
  /** 读屏播报：进入某一步 */
  levelStatus: "第 {step} 步，选择{level}，共 {count} 项",
  /** 读屏播报：搜索结果数 */
  resultStatus: "找到 {count} 个结果",
  /** 结果被截断时列表下方的提示 */
  resultTruncated: "仅显示前 {limit} 条，输入更多字符可缩小范围",
  /** 手机上右侧字母索引条的读屏名称 */
  letterIndex: "按拼音首字母跳转",
  empty: "没有匹配的地区",
  loading: "正在加载地区数据…",
  loadFailed: "地区数据加载失败",
  retry: "重试",
  clear: "清除",
  /** 允许选非末级时，底部确认当前路径的按钮 */
  confirmPartial: "确定：{name}",
  /** 代码找不到又没传 fallbackLabel 时的名称，后面自动加（代码） */
  unknown: "未知地区",
  /** 必填未选时的校验提示 */
  required: "请选择地区",
}

type RegionPickerLabels = typeof DEFAULT_LABELS

/** 搜索结果上限 */
const SEARCH_LIMIT = 50

/** 一级里的选项达到这个数（且都有拼音）时按拼音首字母分组，少了分组反而碍事 */
const GROUP_THRESHOLD = 16

/** 视口窄于 640px 或主要靠触屏时，改用底部面板 */
const SHEET_QUERY = "(max-width: 639px), (pointer: coarse)"

export { DEFAULT_LABELS, GROUP_THRESHOLD, SEARCH_LIMIT, SHEET_QUERY }
export type { RegionPickerLabels }
