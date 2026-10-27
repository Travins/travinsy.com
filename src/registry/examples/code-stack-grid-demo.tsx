import { CodeStack, CodeFile } from "@/registry/ui/code-stack/code-stack"

export default function CodeStackGridDemo() {
  return (
    <CodeStack spread="grid" className="max-w-2xl">
      <CodeFile lang="tsx" name="layout.tsx" seed={3} />
      <CodeFile lang="css" name="globals.css" seed={12} />
      <CodeFile lang="json" name="registry.json" seed={7} active />
      <CodeFile lang="md" name="CHANGELOG.md" seed={6} />
    </CodeStack>
  )
}
