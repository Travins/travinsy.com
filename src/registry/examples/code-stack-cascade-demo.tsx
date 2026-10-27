import { CodeStack, CodeFile } from "@/registry/ui/code-stack/code-stack"

export default function CodeStackCascadeDemo() {
  return (
    <CodeStack spread="cascade" className="max-w-xl">
      <CodeFile lang="yaml" name="deploy.yaml" seed={2} />
      <CodeFile lang="ts" name="config.ts" seed={7} />
      <CodeFile lang="json" name="package.json" seed={9} active />
      <CodeFile lang="js" name="build.js" seed={4} />
    </CodeStack>
  )
}
