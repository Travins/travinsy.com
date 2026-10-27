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
    <div
      data-slot="code-stack-demo"
      className="relative flex h-[26rem] w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-edge bg-card"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse,black_15%,transparent_75%)]"
      />
      <span className="absolute top-5 left-5 font-mono text-[10px] tracking-wider text-muted-foreground">
        02 / SOURCE FILES
      </span>
      <CodeStack className="h-72">
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
      <div className="relative mt-2 flex flex-col items-center gap-2">
        <p className="text-lg font-medium tracking-tight">一个仓库，八种语言</p>
        <p className="font-mono text-[10px] tracking-wider text-muted-foreground">
          从第一行代码，到每一个细节
        </p>
      </div>
    </div>
  )
}
