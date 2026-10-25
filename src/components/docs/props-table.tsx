import { createGenerator, type DocEntry } from "fumadocs-typescript"
import { cache } from "react"
import registry from "../../../registry.json"

const generator = createGenerator()

/**
 * 只保留组件自己声明的属性。
 * `DocEntry` 只有名字、类型和说明，不含声明位置，所以借 `transform` 的上下文拿到属性符号：
 * 从 `@types/react` 继承的 `href`、`target` 这类原生属性声明在 node_modules，
 * 组件自己写的属性则声明在 `src/registry/` 下，据此过滤。
 */
const generate = cache(async (path: string, name: string) => {
  const ownEntries: DocEntry[] = []
  await generator.generateTypeTable(
    {
      path,
      name: `${name}Props`,
      // 直接取组件入参类型；原生属性靠下面的声明来源过滤，不必在类型里 Omit。
      type: `Parameters<typeof ${name}>[0]`,
    },
    {
      transform(entry, _propertyType, symbol) {
        const declaredInProject = (symbol.declarations ?? []).some(
          (declaration) => {
            const fileName =
              declaration.resolve(this.program)?.getSourceFile()?.fileName ?? ""
            return (
              fileName.length > 0 &&
              !fileName.replaceAll("\\", "/").includes("/node_modules/")
            )
          },
        )
        if (declaredInProject) ownEntries.push(entry)
      },
    },
  )
  return ownEntries
})

// 通用组合属性的说明统一在这里兜底，避免源码里重复写同样的注释。
const genericDescriptions: Record<string, string> = {
  children: "组件内容",
  className: "附加的样式类名",
  topLine: "显示顶部横线，默认 false",
}

export async function PropsTable({
  name,
  component,
}: {
  name: string
  component: string
}) {
  const item = registry.items.find((item) => item.name === name)
  if (!item) throw new Error(`未登记的组件：${name}`)
  const entries = await generate(item.files[0].path, component)
  // 只透传原生属性的组件没有自己的 Props，不必硬凑一张空表。
  if (entries.length === 0) {
    return (
      <div className="docs-table-wrap">
        <p className="text-sm text-muted-foreground">
          {component} 没有自定义 Props；该组件继承原生元素的全部属性。
        </p>
      </div>
    )
  }
  return (
    <div className="docs-table-wrap">
      <table>
        <caption>
          {component} 自身声明的属性；对应 HTML 元素的原生属性同样可以透传，不在此重复列出。
        </caption>
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
                {entry.description || genericDescriptions[entry.name] || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
