import { CodeStack, CodeFile } from "@/registry/ui/code-stack/code-stack"

const FILES = [
  ["py", "pipeline.py"],
  ["go", "server.go"],
  ["css", "theme.css"],
  ["ts", "index.ts"],
  ["json", "registry.json"],
  ["tsx", "page.tsx"],
  ["rs", "engine.rs"],
  ["md", "README.md"],
]

export default function CodeStackDemo() {
  return (
    <CodeStack>
      {FILES.map(([lang, name], index) => (
        <CodeFile
          key={lang}
          lang={lang}
          name={name}
          seed={index + 17}
          active={lang === "json"}
        />
      ))}
    </CodeStack>
  )
}
