import Link from "next/link"
import { ArrowUpRight, Globe, Mail } from "lucide-react"
import type { ComponentType, SVGProps } from "react"

import { PostEntry } from "@/components/blog/post-entry"
import { GitHubMark, XMark } from "@/components/home/brand-icons"
import { EntryShowcase } from "@/components/home/entry-showcase"
import { FeaturedBento } from "@/components/home/featured-bento"
import { HeroMark } from "@/components/home/hero-mark"
import { InstallShowcase } from "@/components/home/install-showcase"
import { RoleRotator } from "@/components/home/role-rotator"
import { SectionFrame } from "@/components/home/section-frame"
import FlowDiagramAgentDemo from "@/registry/examples/flow-diagram-agent-demo"
import FlowDiagramDeployDemo from "@/registry/examples/flow-diagram-deploy-demo"
import FlowDiagramFullstackDemo from "@/registry/examples/flow-diagram-fullstack-demo"
import { TechIcon, techBrandStyle } from "@/components/home/tech-icon"
import { buttonVariants } from "@/components/ui/button"
import { profile } from "@/config/profile"
import { formatBlogDate } from "@/lib/blog"
import { blogPosts } from "@/lib/source"
import {
  GridColumns,
  GridContainer,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"

const socialIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  x: XMark,
  github: GitHubMark,
  mail: Mail,
}
// 「我在做什么」每格顶部的动画插画，按 focusAreas 的 illustration 字段选取
const focusIllustrations: Record<
  (typeof profile.focusAreas)[number]["illustration"],
  ComponentType<{ className?: string }>
> = {
  fullstack: FlowDiagramFullstackDemo,
  agent: FlowDiagramAgentDemo,
  deploy: FlowDiagramDeployDemo,
}
const focusClass =
  "rounded-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
const cardFocusClass =
  "transition-colors hover:bg-muted/30 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring"

export default function HomePage() {
  // 最新文章按发布日期倒序，只取首页展示的两篇。
  const posts = blogPosts().slice(0, 2)
  return (
    <GridContainer id="main-content">
      <GridSection aria-labelledby="hero-title">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col items-start gap-6 px-4 py-10 sm:px-6 sm:py-14 lg:justify-center lg:px-14 lg:py-20">
            <p className="flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 bg-primary" />
              {profile.eyebrow}
            </p>
            <h1
              id="hero-title"
              className="text-5xl font-semibold tracking-tight sm:text-6xl xl:text-7xl"
              translate="no"
            >
              {profile.brand}
              <span className="text-primary">.</span>
            </h1>
            <p className="max-w-[36rem] text-base leading-7 text-pretty text-muted-foreground lg:text-[17px] lg:leading-8">
              {profile.bio}
            </p>
            <RoleRotator roles={profile.roles} />
            <div className="flex flex-wrap gap-2">
              <Link
                href="/components/"
                className={buttonVariants({ size: "lg" })}
              >
                浏览组件
                <ArrowUpRight aria-hidden="true" />
              </Link>
              <Link
                href="/docs/installation/"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                快速开始
              </Link>
              <span
                aria-hidden="true"
                className="mx-1 w-px self-stretch bg-edge"
              />
              <ul aria-label="联系方式" className="flex items-center gap-1">
                {profile.socials.map((social) => {
                  const Icon = socialIcons[social.icon] ?? Globe
                  // 邮箱用 mailto 交给邮件客户端，不开新窗口；其余外链在新窗口打开
                  const external = !social.href.startsWith("mailto:")
                  return (
                    <li key={social.name}>
                      <a
                        href={social.href}
                        {...(external
                          ? { target: "_blank", rel: "noreferrer noopener" }
                          : {})}
                        aria-label={
                          external
                            ? `${social.name}（在新窗口打开）`
                            : `发邮件到 ${social.href.slice("mailto:".length)}`
                        }
                        title={
                          external
                            ? social.name
                            : social.href.slice("mailto:".length)
                        }
                        className={buttonVariants({
                          variant: "ghost",
                          size: "icon-lg",
                          className:
                            "text-muted-foreground hover:text-foreground",
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
          <div className="min-w-0 border-t border-dashed border-edge lg:border-t-0 lg:border-l lg:border-solid">
            <HeroMark />
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
                <Illustration className="h-52 border-b border-edge lg:h-56" />
                <div className="flex flex-col items-start gap-3 p-4 sm:p-6 lg:p-8">
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
          <ul className="-mr-px -mb-px grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {profile.technologies.map((technology) => (
              <li
                key={technology.name}
                style={techBrandStyle(technology.name)}
                className="border-r border-b border-edge"
              >
                {/* 图标与名称横排，行高固定在 56 / 64px；名称过长时在空格处折成两行 */}
                <a
                  href={technology.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-full min-h-14 min-w-0 items-center gap-2.5 px-3 py-3 transition-colors duration-300 hover:bg-(--brand)/[0.06] focus-visible:bg-(--brand)/[0.06] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:min-h-16"
                >
                  {/* 悬停时顶边亮起一条品牌色细线，从左向右展开 */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-(--brand) transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                  />
                  <ArrowUpRight
                    aria-hidden="true"
                    className="absolute top-1.5 right-1.5 size-3 text-(--brand) opacity-0 transition-[opacity,translate] duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:-translate-x-0.5 motion-safe:translate-y-0.5 motion-safe:group-hover:translate-0"
                  />
                  <span
                    aria-hidden="true"
                    className="flex size-7 shrink-0 items-center justify-center rounded-md border border-edge bg-muted/40 text-foreground/80 transition-[color,background-color,border-color] duration-300 ease-out group-hover:border-transparent group-hover:bg-transparent group-hover:text-(--brand)"
                  >
                    {/* 边框和底色淡出的同时图标放大填满原来的框，形成“图标挣脱外框”的错觉 */}
                    <TechIcon
                      name={technology.name}
                      className="size-4 transition-[scale,translate,filter] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:drop-shadow-[0_4px_8px_color-mix(in_oklab,var(--brand)_45%,transparent)] motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:scale-[1.75]"
                    />
                  </span>
                  <span
                    className="min-w-0 font-mono text-xs leading-4 break-words"
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
        <FeaturedBento />
      </SectionFrame>
      <SectionFrame
        index="04"
        name="BLOCKS"
        title="区块与模板"
        action={
          <Link
            href="/blocks/"
            className={`${focusClass} font-mono text-xs text-muted-foreground`}
          >
            全部区块{" "}
            <ArrowUpRight aria-hidden="true" className="inline size-3" />
          </Link>
        }
      >
        <EntryShowcase />
      </SectionFrame>
      <SectionFrame index="05" name="INSTALL" title="一行命令安装">
        <InstallShowcase />
      </SectionFrame>
      {posts.length > 0 && (
        <SectionFrame
          index="06"
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
                className={`group grid min-w-0 gap-2 px-4 py-5 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6 sm:px-6 lg:px-8 ${cardFocusClass}`}
              >
                <time
                  dateTime={post.data.date}
                  className="font-mono text-xs leading-6 text-muted-foreground"
                >
                  {formatBlogDate(post.data.date)}
                </time>
                <PostEntry
                  title={post.data.title}
                  description={post.data.description}
                  tags={post.data.tags}
                />
              </Link>
            ))}
          </div>
        </SectionFrame>
      )}
    </GridContainer>
  )
}
