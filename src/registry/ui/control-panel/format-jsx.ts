/**
 * 把组件名和一组属性写成 JSX 字符串，用于控制面板的「复制为代码」。
 * - `undefined` / `null` 的属性省略；`true` 写成裸属性名，`false` 写成 `{false}`
 * - 字符串优先用双引号，含双引号或换行时改成 `{"..."}`
 * - 数字去掉浮点尾差（最多 4 位小数）；数组与对象用 JSON
 * - 一行放得下（不超过 `width` 个字符）就写一行，否则每个属性一行
 */
type FormatJsxOptions = {
  /**
   * 单行的最大宽度
   * @default 72
   */
  width?: number
  /** 写在标签里的子内容；不传时输出自闭合标签 */
  children?: string
}

function formatProp(name: string, value: unknown): string | null {
  if (value === undefined || value === null) return null
  if (value === true) return name
  if (typeof value === "string") {
    return /["\n]/.test(value)
      ? `${name}={${JSON.stringify(value)}}`
      : `${name}="${value}"`
  }
  if (typeof value === "number") {
    return `${name}={${Number(value.toFixed(4))}}`
  }
  return `${name}={${JSON.stringify(value)}}`
}

function formatJsx(
  component: string,
  props: Record<string, unknown>,
  { width = 72, children }: FormatJsxOptions = {},
) {
  const parts = Object.entries(props)
    .map(([name, value]) => formatProp(name, value))
    .filter((part): part is string => part !== null)

  const close = children === undefined ? " />" : `>${children}</${component}>`
  const inline = `<${component}${parts.map((part) => ` ${part}`).join("")}${close}`
  if (inline.length <= width || parts.length === 0) return inline

  const lines = parts.map((part) => `  ${part}`).join("\n")
  return children === undefined
    ? `<${component}\n${lines}\n/>`
    : `<${component}\n${lines}\n>\n  ${children}\n</${component}>`
}

export { formatJsx }
export type { FormatJsxOptions }
