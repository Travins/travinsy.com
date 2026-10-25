"use client"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { IconTip } from "./icon-tip"

type NavLink = { title: string; url: string }

const actionClass = "border border-edge bg-muted/40 text-foreground"

function CopyPageButton({ markdown }: { markdown: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle")
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown)
      setState("copied")
    } catch {
      setState("failed")
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState("idle"), 2000)
  }
  const Icon = state === "copied" ? Check : Copy
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={copy}
        className="rounded-r-none"
      >
        <Icon aria-hidden="true" />
        {state === "copied" ? "已复制" : state === "failed" ? "复制失败" : "复制页面"}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? "已复制本页 Markdown" : ""}
      </span>
    </>
  )
}

/**
 * 页头动作条：左侧返回分区概览；右侧「复制页面 ▾」+ 上一页 / 下一页。
 * markdown 只在点击时写入剪贴板；没有 markdown（概览页）时不显示复制按钮。
 */
export function PageActions({
  back,
  markdown,
  url,
  noun,
  previous,
  next,
}: {
  back?: NavLink
  markdown?: string
  url: string
  noun: string
  previous?: NavLink
  next?: NavLink
}) {
  const prompt = encodeURIComponent(
    `阅读 ${siteConfig.url}${url} ，我想就这个${noun}提问：`,
  )
  const external = {
    target: "_blank",
    rel: "noreferrer",
  } as const
  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      {back ? (
        <Link
          href={back.url}
          className="inline-flex h-7 items-center gap-1.5 rounded-md text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          {back.title}
        </Link>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-1.5">
        {markdown && (
          <div
            className={cn(
              actionClass,
              "inline-flex items-center rounded-lg",
            )}
          >
            <CopyPageButton markdown={markdown} />
            <span aria-hidden="true" className="h-4 w-px bg-edge" />
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="更多页面操作"
                    className="rounded-l-none"
                  />
                }
              >
                <ChevronDown aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem
                  render={
                    <a
                      href={`https://chatgpt.com/?hints=search&q=${prompt}`}
                      {...external}
                    />
                  }
                >
                  在 ChatGPT 中打开
                  <ArrowUpRight aria-hidden="true" className="ml-auto text-muted-foreground" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={
                    <a href={`https://claude.ai/new?q=${prompt}`} {...external} />
                  }
                >
                  在 Claude 中打开
                  <ArrowUpRight aria-hidden="true" className="ml-auto text-muted-foreground" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={<a href="/llms.txt" {...external} />}
                >
                  查看 llms.txt
                  <ArrowUpRight aria-hidden="true" className="ml-auto text-muted-foreground" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {previous && (
          <IconTip label={`上一页：${previous.title}`}>
            <Link
              href={previous.url}
              aria-label={`上一页：${previous.title}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                actionClass,
                "rounded-lg",
              )}
            >
              <ArrowLeft aria-hidden="true" />
            </Link>
          </IconTip>
        )}
        {next && (
          <IconTip label={`下一页：${next.title}`}>
            <Link
              href={next.url}
              aria-label={`下一页：${next.title}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                actionClass,
                "rounded-lg",
              )}
            >
              <ArrowRight aria-hidden="true" />
            </Link>
          </IconTip>
        )}
      </div>
    </div>
  )
}
