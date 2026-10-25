"use client"
import Link from "next/link"
import { useState, type ReactNode } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CopyButton } from "./copy-button"
import { siteConfig } from "@/config/site"
const managers = { pnpm: "pnpm dlx", npm: "npx", yarn: "yarn dlx", bun: "bunx" }
export function InstallCommandClient({
  name,
  children,
}: {
  name: string
  children: ReactNode
}) {
  const [method, setMethod] = useState("url")
  return (
    <div className="not-prose my-6 min-w-0">
      <Tabs
        value={method}
        onValueChange={(value) => setMethod(String(value))}
        className="mb-4"
      >
        <TabsList aria-label="安装方式">
          <TabsTrigger value="url">URL 安装</TabsTrigger>
          <TabsTrigger value="namespace">命名空间安装</TabsTrigger>
        </TabsList>
      </Tabs>
      {method === "namespace" && (
        <p className="mb-3 text-sm text-muted-foreground">
          请先按{" "}
          <Link
            href="/components/installation/"
            className="underline underline-offset-4"
          >
            安装与配置
          </Link>{" "}
          配置 @travinsy 命名空间。
        </p>
      )}
      <Tabs defaultValue="pnpm">
        <TabsList aria-label="选择包管理器">
          {Object.keys(managers).map((pm) => (
            <TabsTrigger key={pm} value={pm}>
              {pm}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(managers).map(([pm, runner]) => {
          const command = `${runner} shadcn@latest add ${method === "namespace" ? `@travinsy/${name}` : `${siteConfig.url}/r/${name}.json`}`
          return (
            <TabsContent key={pm} value={pm}>
              <div className="docs-command">
                <code>{command}</code>
                <CopyButton value={command} />
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
      <details className="mt-4">
        <summary className="cursor-pointer py-2 text-sm font-medium">
          手动安装
        </summary>
        <p className="my-3 text-sm leading-7 text-muted-foreground">
          将下面的组件源码复制到项目，确认 @/lib/utils 导出 cn，并将 Registry
          JSON 中的 css 与 cssVars 合并到全局样式。CLI 安装会自动完成这些步骤。
        </p>
        <a
          className="text-sm underline underline-offset-4"
          href={`${siteConfig.url}/r/${name}.json`}
        >
          查看 CSS 工具类和变量
        </a>
        {children}
      </details>
    </div>
  )
}
