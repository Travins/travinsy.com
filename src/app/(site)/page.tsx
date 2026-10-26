import Link from "next/link"
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  Component,
  Globe,
  Grid2X2,
  Link2,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ComponentType, SVGProps } from "react"

import { GitHubMark, XMark } from "@/components/home/brand-icons"
import { AgentIllustration } from "@/components/home/focus/agent-illustration"
import { DeployIllustration } from "@/components/home/focus/deploy-illustration"
import { FullstackIllustration } from "@/components/home/focus/fullstack-illustration"
import { SectionFrame } from "@/components/home/section-frame"
import { RoleRotator } from "@/registry/blocks/profile-hero/role-rotator"
import { TechIcon, techBrandStyle } from "@/components/home/tech-icon"
import { TerminalCard } from "@/components/home/terminal-card"
import { buttonVariants } from "@/components/ui/button"
import { profile } from "@/config/profile"
import { blogPosts } from "@/lib/source"
import registry from "../../../registry.json"
import {
  GridColumns,
  GridContainer,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"

const socialIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  x: XMark,
  github: GitHubMark,
}
// 「我在做什么」每格顶部的动画插画，按 focusAreas 的 illustration 字段选取
const focusIllustrations: Record<
  (typeof profile.focusAreas)[number]["illustration"],
  ComponentType
> = {
  fullstack: FullstackIllustration,
  agent: AgentIllustration,
  deploy: DeployIllustration,
}
// 精选组件的图标按 Registry 条目名映射，未登记的条目回落到通用图标。
const componentIcons: Record<string, LucideIcon> = {
  "grid-layout": Grid2X2,
  "contribution-graph": CalendarDays,
  "local-time": Clock,
  "icon-link": Link2,
}
const focusClass =
  "rounded-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
const cardFocusClass =
  "transition-colors hover:bg-muted/30 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring"

export default function HomePage() {
  // 精选组件的标题与描述都来自 Registry，保持与文档、安装产物同源。
  const featured = profile.featuredComponents.map((name) => {
    const item = registry.items.find((entry) => entry.name === name)
    if (!item) throw new Error(`未登记的 Registry 条目：${name}`)
    return item
  })
  // 最新文章按发布日期倒序，只取首页展示的两篇。
  const posts = blogPosts().slice(0, 2)
  return (
    <GridContainer>
      <GridSection aria-labelledby="profile-name">
        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="flex flex-col items-start gap-6 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
            <p className="flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 bg-primary" />
              {profile.eyebrow}
            </p>
            <h1
              id="profile-name"
              className="text-5xl font-semibold tracking-tight sm:text-6xl"
              translate="no"
            >
              {profile.name}
              <span className="text-primary">.</span>
            </h1>
            <p className="max-w-md text-base leading-7 text-pretty text-muted-foreground">
              {profile.bio}
            </p>
            <RoleRotator roles={profile.roles} />
            <div className="flex flex-wrap gap-2">
              <Link
                href="/components/"
                className={buttonVariants({ size: "lg" })}
              >
                浏览组件库
                <ArrowUpRight aria-hidden="true" />
              </Link>
              <Link
                href="/blog/"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                阅读笔记
              </Link>
              <span aria-hidden="true" className="mx-1 w-px self-stretch bg-edge" />
              <ul aria-label="社交账号" className="flex items-center gap-1">
                {profile.socials.map((social) => {
                  const Icon = socialIcons[social.icon] ?? Globe
                  return (
                    <li key={social.name}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${social.name}（在新窗口打开）`}
                        title={social.name}
                        className={buttonVariants({
                          variant: "ghost",
                          size: "icon-lg",
                          className: "text-muted-foreground hover:text-foreground",
                        })}
                      >
                        <Icon aria-hidden="true" className="size-4.5" />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="relative flex items-center justify-center border-t border-dashed border-edge px-4 py-10 sm:px-6 lg:border-t-0 lg:border-l lg:border-solid lg:px-10">
            {/* 点阵底纹向四周淡出，让终端卡片像摆在图纸上 */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_85%)]"
            />
            <TerminalCard
              title={profile.terminal.title}
              steps={profile.terminal.steps}
            />
          </div>
        </div>
      </GridSection>
      <GridSeparator label="CAPABILITIES / 能力" />
      <SectionFrame index="01" name="FOCUS" title="我在做什么">
        <GridColumns className="sm:grid-cols-3">
          {profile.focusAreas.map((area) => {
            const Illustration = focusIllustrations[area.illustration]
            return (
              <div key={area.title} className="flex min-w-0 flex-col">
                <Illustration />
                <div className="flex flex-col items-start gap-3 p-4 sm:p-6">
                  <h3 className="text-sm font-medium tracking-tight">
                    {area.title}
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {area.description}
                  </p>
                </div>
              </div>
            )
          })}
        </GridColumns>
      </SectionFrame>
      <SectionFrame index="02" name="STACK" title="技术栈">
        {/* 单元格自带右、下边线，再用负外边距把最外一圈挤出裁剪区，避免和容器的线叠成双线 */}
        <div className="overflow-hidden">
          <ul className="-mr-px -mb-px grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {profile.technologies.map((technology) => (
              <li
                key={technology.name}
                style={techBrandStyle(technology.name)}
                className="border-r border-b border-edge"
              >
                <a
                  href={technology.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-full min-w-0 flex-col items-start gap-3 p-4 transition-colors duration-300 hover:bg-(--brand)/[0.06] focus-visible:bg-(--brand)/[0.06] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                >
                  {/* 悬停时顶边亮起一条品牌色细线，从左向右展开 */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-(--brand) transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                  />
                  <ArrowUpRight
                    aria-hidden="true"
                    className="absolute top-3 right-3 size-3.5 text-(--brand) opacity-0 transition-[opacity,translate] duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:-translate-x-0.5 motion-safe:translate-y-0.5 motion-safe:group-hover:translate-0"
                  />
                  <span
                    aria-hidden="true"
                    className="flex size-8 items-center justify-center rounded-md border border-edge bg-muted/40 text-foreground/80 transition-[color,background-color,border-color] duration-300 ease-out group-hover:border-transparent group-hover:bg-transparent group-hover:text-(--brand)"
                  >
                    {/* 边框和底色淡出的同时图标放大填满原来的框，形成“图标挣脱外框”的错觉 */}
                    <TechIcon
                      name={technology.name}
                      className="size-4 transition-[scale,translate,filter] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:drop-shadow-[0_4px_8px_color-mix(in_oklab,var(--brand)_45%,transparent)] motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:scale-[1.75]"
                    />
                  </span>
                  <span
                    className="font-mono text-xs break-words"
                    translate="no"
                  >
                    {technology.name}
                    <span className="sr-only">（在新窗口打开官网）</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </SectionFrame>
      <GridSeparator label="OUTPUT / 产出" />
      <SectionFrame
        index="03"
        name="WORKS"
        title="精选组件"
        action={
          <Link
            href="/components/"
            className={`${focusClass} font-mono text-xs text-muted-foreground`}
          >
            全部组件{" "}
            <ArrowUpRight aria-hidden="true" className="inline size-3" />
          </Link>
        }
      >
        <div className="divide-y divide-edge">
          {[0, 2].map((offset) => (
            <GridColumns key={offset}>
              {featured.slice(offset, offset + 2).map((item, index) => {
                const Icon = componentIcons[item.name] ?? Component
                return (
                  <Link
                    key={item.name}
                    href={`/components/${item.name}/`}
                    className={`group flex min-w-0 flex-col gap-5 p-4 sm:p-6 ${cardFocusClass}`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex size-11 items-center justify-center rounded-lg border border-edge bg-muted/40">
                        <Icon
                          aria-hidden="true"
                          className="size-5"
                          strokeWidth={1.25}
                        />
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 text-muted-foreground transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                      />
                    </div>
                    <div>
                      <p className="mb-2 font-mono text-[10px] text-muted-foreground">
                        组件 / {String(offset + index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="text-base font-medium tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <p className="mt-auto font-mono text-[10px] text-muted-foreground">
                      {item.files[0].path.split("/").at(-1)}
                    </p>
                  </Link>
                )
              })}
            </GridColumns>
          ))}
        </div>
      </SectionFrame>
      {posts.length > 0 && (
        <SectionFrame
          index="04"
          name="NOTES"
          title="最新文章"
          action={
            <Link
              href="/blog/"
              className={`${focusClass} font-mono text-xs text-muted-foreground`}
            >
              全部文章{" "}
              <ArrowUpRight aria-hidden="true" className="inline size-3" />
            </Link>
          }
        >
          <div className="divide-y divide-edge">
            {posts.map((post) => (
              <Link
                key={post.url}
                href={post.url}
                className={`group grid min-w-0 gap-2 px-4 py-5 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6 sm:px-6 ${cardFocusClass}`}
              >
                <time
                  dateTime={post.data.date}
                  className="font-mono text-xs leading-6 text-muted-foreground"
                >
                  {post.data.date}
                </time>
                <div className="min-w-0">
                  <h3 className="text-base font-medium tracking-tight text-balance group-hover:text-primary">
                    {post.data.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-pretty text-muted-foreground">
                    {post.data.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </SectionFrame>
      )}
      <GridSeparator />
      <SectionFrame index="05" name="ABOUT" title="关于我">
        <GridColumns>
          {profile.about.map((paragraph) => (
            <p
              key={paragraph}
              className="p-4 text-sm leading-7 text-pretty text-muted-foreground sm:p-6"
            >
              {paragraph}
            </p>
          ))}
        </GridColumns>
        <p className="border-t border-edge px-4 py-4 font-mono text-xs text-muted-foreground sm:px-6">
          持续学习，慢慢构建。<span className="ml-2 text-primary">_</span>
        </p>
      </SectionFrame>
    </GridContainer>
  )
}
