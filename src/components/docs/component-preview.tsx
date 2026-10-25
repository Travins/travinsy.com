import { readFile } from "node:fs/promises"
import { CodeBlock } from "./code-block"
import { ComponentPreviewClient } from "./component-preview-client"

export async function ComponentPreview({ name }: { name: string }) {
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error("无效的演示名称")
  const code = await readFile(`src/registry/examples/${name}.tsx`, "utf8")
  return (
    <ComponentPreviewClient
      name={name}
      code={<CodeBlock code={code} title={`${name}.tsx`} />}
    />
  )
}
