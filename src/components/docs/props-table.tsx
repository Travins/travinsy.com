import { createGenerator } from "fumadocs-typescript"
import { cache } from "react"
import registry from "../../../registry.json"

const generator = createGenerator()
const generate = cache(async (path: string, name: string) =>
  generator.generateTypeTable({
    path,
    name: `${name}Props`,
    type: `Omit<Parameters<typeof ${name}>[0], keyof React.HTMLAttributes<HTMLElement> | "ref" | "key"> & Pick<React.HTMLAttributes<HTMLElement>, "className" | "children">`,
  }),
)
export async function PropsTable({
  name,
  component,
}: {
  name: string
  component: string
}) {
  const item = registry.items.find((item) => item.name === name)
  if (!item) throw new Error(`未登记的组件：${name}`)
  const docs = await generate(item.files[0].path, component)
  // HTML 原生属性由 React 类型继承，仅突出自定义 API 与通用组合入口。
  const entries = docs.flatMap((doc) => doc.entries)
  if (entries.length === 0) throw new Error(`未能解析 ${component} 的属性`)
  return (
    <div className="docs-table-wrap">
      <table>
        <caption>{component} 属性；同时支持对应 HTML 元素的原生属性。</caption>
        <thead>
          <tr>
            <th>属性</th>
            <th>类型</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.name}>
              <td>
                <code>
                  {entry.name}
                  {entry.required ? " *" : ""}
                </code>
              </td>
              <td>
                <code>{entry.type}</code>
              </td>
              <td>
                {entry.description ||
                  (
                    {
                      className: "扩展布局样式",
                      children: "容器内容",
                      topLine: "显示顶部横线，默认 false",
                    } as Record<string, string>
                  )[entry.name] ||
                  "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
