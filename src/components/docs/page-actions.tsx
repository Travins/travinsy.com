"use client"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Share,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { siteConfig } from "@/config/site"
import { REPO_URL } from "@/components/site/site-config"
import { cn } from "@/lib/utils"
import {
  ClaudeIcon,
  CursorIcon,
  GithubIcon,
  MarkdownIcon,
  OpenAIIcon,
} from "./brand-icons"
import { IconTip } from "./icon-tip"
import { v0Url } from "./registry-items"
import { V0Icon } from "./v0-icon"

type NavLink = { title: string; url: string }

const actionBase =
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap text-foreground transition-colors outline-none select-none hover:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_6%)] aria-expanded:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_6%)] focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-4 [&_svg]:shrink-0"
const squareAction = cn(actionBase, "w-8 bg-muted")
const menuItem = "h-9 gap-2.5 rounded-lg px-2.5 text-[13px]"
const external = { target: "_blank", rel: "noreferrer" } as const

/** 复制成功 / 失败后 2 秒恢复；返回当前状态与触发函数。 */
function useFeedback<T extends string>(idle: T) {
  const [state, setState] = useState<T>(idle)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  function flash(next: T) {
    setState(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState(idle), 2000)
  }
  return [state, flash] as const
}

function CopyPageButton({ markdown }: { markdown: string }) {
  const [state, flash] = useFeedback<"idle" | "copied" | "failed">("idle")
  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown)
      flash("copied")
    } catch {
      flash("failed")
    }
  }
  const Icon = state === "copied" ? Check : Copy
  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={cn(actionBase, "rounded-r-none px-2.5 max-sm:px-2")}
      >
        <Icon aria-hidden="true" />
        <span className="max-sm:sr-only">
          {state === "copied" ? "已复制" : state === "failed" ? "复制失败" : "复制页面"}
        </span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? "已复制本页 Markdown" : ""}
      </span>
    </>
  )
}

/** 支持系统分享时唤起系统面板，否则复制当前页完整链接。 */
function ShareButton({ title }: { title: string }) {
  const [state, flash] = useFeedback<"idle" | "copied" | "failed">("idle")
  async function share() {
    const url = window.location.href
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url })
      } catch {
        // 用户取消分享不算失败
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      flash("copied")
    } catch {
      flash("failed")
    }
  }
  const label =
    state === "copied" ? "链接已复制" : state === "failed" ? "复制链接失败" : "分享"
  const Icon = state === "copied" ? Check : Share
  return (
    <>
      <IconTip label={label}>
        <button
          type="button"
          onClick={share}
          aria-label="分享本页"
          className={squareAction}
        >
          <Icon aria-hidden="true" />
        </button>
      </IconTip>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? "链接已复制" : state === "failed" ? "复制链接失败" : ""}
      </span>
    </>
  )
}

function NavAction({
  link,
  direction,
}: {
  link: NavLink
  direction: "previous" | "next"
}) {
  const label = `${direction === "previous" ? "上一页" : "下一页"}：${link.title}`
  const Icon = direction === "previous" ? ArrowLeft : ArrowRight
  return (
    <IconTip label={label}>
      <Link href={link.url} aria-label={label} className={squareAction}>
        <Icon aria-hidden="true" />
      </Link>
    </IconTip>
  )
}

/**
 * 页头动作条：左侧返回分区概览；右侧「复制页面 ▾」拆分按钮 + 分享 + 上一页 / 下一页。
 * markdown 只在点击时写入剪贴板；没有 markdown（概览页）时不显示复制与分享菜单。
 */
export function PageActions({
  back,
  markdown,
  url,
  title,
  noun,
  sourcePath,
  registryName,
  previous,
  next,
}: {
  back?: NavLink
  markdown?: string
  url: string
  title: string
  noun: string
  /** 相对 content/docs 的 MDX 路径，用于「在 GitHub 中打开」 */
  sourcePath?: string
  /** 本页对应的 registry 条目，有则显示「在 v0 中打开」 */
  registryName?: string
  previous?: NavLink
  next?: NavLink
}) {
  const prompt = encodeURIComponent(
    `阅读 ${siteConfig.url}${url} ，我想就这个${noun}提问：`,
  )
  const markdownUrl = `/md${url.replace(/\/$/, "")}.md`
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
          <>
            <div className="inline-flex items-center rounded-lg bg-muted">
              <CopyPageButton markdown={markdown} />
              <span aria-hidden="true" className="h-4 w-px bg-border" />
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      aria-label="更多页面操作"
                      className={cn(actionBase, "w-8 rounded-l-none")}
                    />
                  }
                >
                  <ChevronDown aria-hidden="true" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={6}
                  className="w-56 rounded-xl p-1.5"
                >
                  <DropdownMenuItem
                    className={menuItem}
                    render={<a href={markdownUrl} {...external} />}
                  >
                    <MarkdownIcon />
                    以 Markdown 查看
                  </DropdownMenuItem>
                  {sourcePath && (
                    <DropdownMenuItem
                      className={menuItem}
                      render={
                        <a
                          href={`${REPO_URL}/blob/main/content/docs/${sourcePath}`}
                          {...external}
                        />
                      }
                    >
                      <GithubIcon />
                      在 GitHub 中打开
                    </DropdownMenuItem>
                  )}
                  {registryName && (
                    <DropdownMenuItem
                      className={menuItem}
                      render={<a href={v0Url(registryName)} {...external} />}
                    >
                      <V0Icon />
                      在 v0 中打开
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className={menuItem}
                    render={
                      <a
                        href={`https://chatgpt.com/?hints=search&q=${prompt}`}
                        {...external}
                      />
                    }
                  >
                    <OpenAIIcon />
                    在 ChatGPT 中打开
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={menuItem}
                    render={
                      <a href={`https://claude.ai/new?q=${prompt}`} {...external} />
                    }
                  >
                    <ClaudeIcon />
                    在 Claude 中打开
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={menuItem}
                    render={
                      <a
                        href={`https://cursor.com/link/prompt?text=${prompt}`}
                        {...external}
                      />
                    }
                  >
                    <CursorIcon />
                    在 Cursor 中打开
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <ShareButton title={title} />
          </>
        )}
        {previous && <NavAction link={previous} direction="previous" />}
        {next && <NavAction link={next} direction="next" />}
      </div>
    </div>
  )
}
