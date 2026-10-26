"use client"
import { ChevronDown, Terminal } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { CopyButton } from "./copy-button"
import {
  DocFrameBar,
  DocTabsList,
  DocTabsTrigger,
  docFrameClass,
  docFramePanelClass,
} from "./doc-frame"
import { useStoredChoice } from "./use-stored-choice"

const managers = {
  pnpm: { dlx: "pnpm dlx", add: "pnpm add" },
  npm: { dlx: "npx", add: "npm install" },
  yarn: { dlx: "yarn dlx", add: "yarn add" },
  bun: { dlx: "bunx", add: "bun add" },
} as const
type Manager = keyof typeof managers
const managerNames = Object.keys(managers) as Manager[]

const sources = {
  url: "URL",
  namespace: "@travinsy",
} as const
type Source = keyof typeof sources
const sourceNames = Object.keys(sources) as Source[]

// 包管理器与安装来源记在 localStorage 里，全站所有安装区共享
export const useManager = () =>
  useStoredChoice<Manager>("travinsy:package-manager", managerNames, "pnpm")
export const useSource = () =>
  useStoredChoice<Source>("travinsy:install-source", sourceNames, "url")

function SourceMenu({
  value,
  onChange,
}: {
  value: Source
  onChange: (value: Source) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="安装来源"
            className="font-mono text-xs text-muted-foreground hover:text-foreground"
          />
        }
      >
        {sources[value]}
        <ChevronDown aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => onChange(next as Source)}
        >
          <DropdownMenuRadioItem value="url" closeOnClick>
            URL
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="namespace" closeOnClick>
            @travinsy 命名空间
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * 命令框：外层工具栏 = 终端图标 + 包管理器标签 + （可选）安装来源 + 复制；内层显示命令。
 * flat 时不画外层框，直接嵌进别的双层框里。
 */
function CommandFrame({
  commandFor,
  source,
  flat = false,
  className,
}: {
  commandFor: (manager: Manager) => string
  source?: { value: Source; onChange: (value: Source) => void }
  flat?: boolean
  className?: string
}) {
  const [manager, setManager] = useManager()
  return (
    <Tabs
      value={manager}
      onValueChange={(value) => setManager(value as Manager)}
      className={cn(
        flat ? "flex flex-col gap-0" : docFrameClass,
        "my-0",
        className,
      )}
    >
      <DocFrameBar>
        <div className="flex min-w-0 items-stretch gap-1.5 self-stretch">
          <Terminal
            aria-hidden="true"
            className="ml-1 size-3.5 shrink-0 self-center text-muted-foreground"
          />
          <DocTabsList aria-label="选择包管理器">
            {managerNames.map((name) => (
              <DocTabsTrigger
                key={name}
                value={name}
                className="font-mono text-xs"
              >
                {name}
              </DocTabsTrigger>
            ))}
          </DocTabsList>
        </div>
        <div className="flex items-center gap-0.5">
          {source && <SourceMenu {...source} />}
          <CopyButton value={commandFor(manager)} label="复制命令" />
        </div>
      </DocFrameBar>
      {managerNames.map((name) => (
        <TabsContent
          key={name}
          value={name}
          className={cn(docFramePanelClass, "px-4 py-3")}
        >
          <code className="block font-mono text-[13px] leading-6 break-words text-muted-foreground select-all">
            {commandFor(name)}
          </code>
        </TabsContent>
      ))}
    </Tabs>
  )
}

export function InstallCommandClient({
  name,
  bare,
  dependencies,
  children,
}: {
  name: string
  bare: boolean
  dependencies: string[]
  children: ReactNode
}) {
  const [source, setSource] = useSource()
  const target =
    source === "namespace"
      ? `@travinsy/${name}`
      : `${siteConfig.url}/r/${name}.json`
  const command = (manager: Manager) =>
    `${managers[manager].dlx} shadcn@latest add ${target}`
  const frame = (
    <CommandFrame
      commandFor={command}
      source={{ value: source, onChange: setSource }}
      flat={bare}
    />
  )
  if (bare) return frame

  return (
    <div className="not-prose my-6 min-w-0">
      <Tabs defaultValue="command" className="gap-3">
        <DocTabsList aria-label="安装方式">
          <DocTabsTrigger value="command">命令</DocTabsTrigger>
          <DocTabsTrigger value="manual">手动</DocTabsTrigger>
        </DocTabsList>
        <TabsContent value="command" className="flex flex-col gap-3">
          {frame}
          {source === "namespace" && (
            <div className="text-[13px] leading-6 text-muted-foreground">
              请先按{" "}
              <Link
                href="/docs/registry/"
                className="underline underline-offset-4"
              >
                Registry 与命名空间
              </Link>{" "}
              配置 @travinsy 命名空间。
            </div>
          )}
        </TabsContent>
        <TabsContent value="manual" className="flex flex-col gap-5">
          {dependencies.length > 0 && (
            <ManualStep index={1} title="安装依赖">
              <CommandFrame
                commandFor={(manager) =>
                  `${managers[manager].add} ${dependencies.join(" ")}`
                }
              />
            </ManualStep>
          )}
          <ManualStep
            index={dependencies.length > 0 ? 2 : 1}
            title="复制源码"
            hint="将下面的源码复制到项目中，并确认 @/lib/utils 导出 cn。"
          >
            <div className="flex flex-col gap-4 [&_[data-slot=doc-frame]]:my-0">
              {children}
            </div>
          </ManualStep>
          <ManualStep
            index={dependencies.length > 0 ? 3 : 2}
            title="合并样式"
            hint="将 Registry JSON 中的 css 与 cssVars 合并到全局样式；CLI 安装会自动完成这一步。"
          >
            <a
              className="text-[13px] underline underline-offset-4"
              href={`${siteConfig.url}/r/${name}.json`}
              target="_blank"
              rel="noreferrer"
            >
              查看 CSS 工具类和变量
              <span className="sr-only">（在新标签页中打开）</span>
            </a>
          </ManualStep>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ManualStep({
  index,
  title,
  hint,
  children,
}: {
  index: number
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline gap-2.5">
        <span className="flex size-5 shrink-0 translate-y-0.5 items-center justify-center rounded-full border border-edge bg-muted font-mono text-[11px] text-muted-foreground">
          {index}
        </span>
        <div className="min-w-0">
          <div className="text-[15px] font-medium">{title}</div>
          {hint && (
            <div className="text-[13px] leading-6 text-muted-foreground">
              {hint}
            </div>
          )}
        </div>
      </div>
      <div className="min-w-0 pl-0 sm:pl-[1.875rem]">{children}</div>
    </div>
  )
}
