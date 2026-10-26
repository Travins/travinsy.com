import Link from "next/link"
import {
  ArrowUpRight,
  Bot,
  CalendarDays,
  Clock,
  Code2,
  Component,
  Globe,
  Grid2X2,
  Link2,
  Server,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ComponentType, SVGProps } from "react"

import { GitHubMark, XMark } from "@/components/home/brand-icons"
import { SectionFrame } from "@/components/home/section-frame"
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
const focusIcons: Record<string, LucideIcon> = {
  code: Code2,
  agent: Bot,
  server: Server,
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
            <ul aria-label="技能标签" className="flex flex-wrap gap-2">
              {profile.roles.map((role) => (
                <li
                  key={role}
                  className="border border-edge px-2 py-1 font-mono text-xs text-muted-foreground"
                >
                  {role}
                </li>
              ))}
            </ul>
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
      <GridSection aria-label="社交链接">
        <GridColumns>
          {profile.socials.map((social) => {
            const Icon = socialIcons[social.icon] ?? Globe
            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className={`group flex min-w-0 items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10 ${cardFocusClass}`}
              >
                <span className="flex min-w-0 flex-col gap-1 font-mono">
                  <span className="text-[10px] tracking-[0.2em] text-muted-foreground">
                    {social.name.toUpperCase()}
                  </span>
                  <span className="truncate text-sm" translate="no">
                    {social.href.replace(/^https?:\/\//, "")}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="ml-1 inline size-3.5 text-muted-foreground transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                    />
                  </span>
                </span>
                <Icon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-muted-foreground"
                />
              </a>
            )
          })}
        </GridColumns>
      </GridSection>
      <GridSeparator label="CAPABILITIES / 能力" />
      <SectionFrame index="01" name="FOCUS" title="我在做什么">
        <GridColumns className="sm:grid-cols-3">
          {profile.focusAreas.map((area) => {
            const Icon = focusIcons[area.icon] ?? Code2
            return (
              <div
                key={area.title}
                className="flex min-w-0 flex-col items-start gap-3 p-4 sm:p-6"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-md border border-edge bg-muted/40 text-muted-foreground">
                  <Icon
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.5}
                  />
                </span>
                <h3 className="text-sm font-medium tracking-tight">
                  {area.title}
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  {area.description}
                </p>
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
                key={technology}
                className="group flex min-w-0 flex-col items-start gap-3 border-r border-b border-edge p-4"
              >
                <span
                  aria-hidden="true"
                  style={techBrandStyle(technology)}
                  className="flex size-8 items-center justify-center rounded-md border border-edge bg-muted/40 text-foreground/80 transition-colors group-hover:text-(--brand,var(--foreground))"
                >
                  <TechIcon name={technology} className="size-4" />
                </span>
                <span className="font-mono text-xs break-words" translate="no">
                  {technology}
                </span>
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
