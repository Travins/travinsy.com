import Link from "next/link"
import {
  ArrowDownRight,
  ArrowUpRight,
  Code2,
  Bot,
  Server,
  Component,
  Globe,
  Grid2X2,
  Layers,
  Terminal,
} from "lucide-react"
import type { ComponentType, SVGProps } from "react"
import { GitHubMark, XMark } from "@/components/home/brand-icons"
import type { LucideIcon } from "lucide-react"

import { RoleRotator } from "@/components/home/role-rotator"
import { profile } from "@/config/profile"
import { FollowMe } from "@/registry/ui/follow-me/follow-me"
import { Greeting } from "@/registry/ui/greeting/greeting"
import {
  GridColumns,
  GridContainer,
  GridSection,
  GridSeparator,
} from "@/registry/ui/grid-layout/grid-layout"
import { IconLink } from "@/registry/ui/icon-link/icon-link"

const socialIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  x: XMark,
  github: GitHubMark,
}
const projectIcons: Record<string, LucideIcon> = {
  grid: Grid2X2,
  component: Component,
  layout: Layers,
  terminal: Terminal,
}
const focusClass =
  "rounded-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"

function InfoIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-edge bg-muted/40 text-muted-foreground">
      <Icon aria-hidden="true" className="size-4" strokeWidth={1.5} />
    </span>
  )
}

export default function HomePage() {
  return (
    <GridContainer>
      <GridSection aria-labelledby="profile-name">
        <div
          aria-hidden="true"
          className="relative flex h-32 items-center justify-center overflow-hidden bg-muted/20 sm:h-44"
        >
          <div className="absolute inset-0 bg-hatch opacity-40" />
          <div className="relative flex items-center gap-5 font-mono text-muted-foreground/70">
            <span className="text-4xl font-extralight sm:text-5xl">{"{ "}</span>
            <span className="text-xs tracking-[0.35em]">
              DESIGN · CODE · REPEAT
            </span>
            <span className="text-4xl font-extralight sm:text-5xl">{" }"}</span>
          </div>
        </div>
        <div className="relative flex flex-col gap-5 px-4 pb-7 sm:px-6">
          <div
            aria-hidden="true"
            className="relative -mt-10 flex size-20 items-center justify-center rounded-2xl border border-edge bg-background font-mono text-3xl font-medium tracking-tighter ring-4 ring-background"
          >
            {profile.initials}
            <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full border border-edge bg-background">
              <Code2 className="size-3 text-primary" />
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h1
              id="profile-name"
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
              translate="no"
            >
              {profile.name}
              <span className="text-primary">.</span>
            </h1>
            <p className="text-sm leading-7 text-pretty text-muted-foreground sm:text-base">
              {profile.bio}
            </p>
            <RoleRotator roles={profile.roles} />
          </div>
        </div>
      </GridSection>
      <GridSection aria-label="社交链接" className="px-4 py-4 sm:px-6">
        <FollowMe />
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {profile.socials.map((social) => {
              const Icon = socialIcons[social.icon] ?? Globe
              return (
                <IconLink
                  key={social.name}
                  href={social.href}
                  label={social.name}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Icon strokeWidth={1.5} />
                </IconLink>
              )
            })}
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            在别处，也在这里{" "}
            <ArrowUpRight aria-hidden="true" className="ml-1 inline size-3" />
          </span>
        </div>
      </GridSection>
      <GridSection aria-labelledby="focus-title">
        <div className="px-4 py-4 sm:px-6">
          <h2 id="focus-title" className="text-sm font-medium">
            我在做什么
          </h2>
        </div>
        <GridColumns className="sm:grid-cols-3">
          {profile.focusAreas.map((area) => {
            const Icon =
              area.icon === "agent"
                ? Bot
                : area.icon === "server"
                  ? Server
                  : Code2
            return (
              <div
                key={area.title}
                className="flex min-w-0 flex-col items-start gap-3 p-4 sm:px-6 sm:pb-6"
              >
                <InfoIcon icon={Icon} />
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
      </GridSection>
      <GridSection aria-labelledby="stack-title" className="px-4 py-6 sm:px-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id="stack-title" className="text-sm font-medium">
            技术栈
          </h2>
          <span
            aria-hidden="true"
            className="font-mono text-[10px] text-muted-foreground"
          >
            TOOLS OF THE TRADE
          </span>
        </div>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {profile.technologies.map((technology) => (
            <li
              key={technology}
              className="flex min-h-14 min-w-0 items-center gap-2 rounded-md border border-edge bg-muted/20 px-2.5 py-3 sm:px-3"
            >
              <span
                aria-hidden="true"
                className="flex size-6 shrink-0 items-center justify-center rounded border border-edge bg-background font-mono text-[10px] text-muted-foreground"
              >
                {technology.slice(0, 2)}
              </span>
              <span
                className="min-w-0 font-mono text-[10px] break-words sm:text-xs"
                translate="no"
              >
                {technology}
              </span>
            </li>
          ))}
        </ul>
      </GridSection>
      <GridSeparator />
      <GridSection
        aria-labelledby="greeting-title"
        className="px-4 py-8 sm:px-6"
      >
        <span
          aria-hidden="true"
          className="mb-3 block font-mono text-xs text-muted-foreground"
        >
          01 / HELLO THERE
        </span>
        <h2 id="greeting-title" className="text-xl font-medium tracking-tight">
          <Greeting />
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-7 text-pretty text-muted-foreground">
          {profile.greetingNote}
        </p>
      </GridSection>
      <GridSection
        aria-labelledby="projects-title"
        className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6"
      >
        <h2 id="projects-title" className="text-sm font-medium">
          精选组件
        </h2>
        <Link
          href="/components/"
          className={`${focusClass} font-mono text-xs text-muted-foreground`}
        >
          全部组件 <ArrowUpRight aria-hidden="true" className="inline size-3" />
        </Link>
      </GridSection>
      {[0, 2].map((offset) => (
        <GridSection
          key={offset}
          aria-label={`精选作品 ${offset + 1} 至 ${offset + 2}`}
        >
          <GridColumns>
            {profile.projects.slice(offset, offset + 2).map((project) => {
              const Icon = projectIcons[project.icon] ?? Component
              return (
                <Link
                  key={project.title}
                  href={project.href}
                  className="group flex min-w-0 flex-col gap-5 p-4 transition-colors hover:bg-muted/30 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring sm:p-6"
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
                      {project.category}
                    </p>
                    <h3 className="text-base font-medium tracking-tight">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                  <p className="mt-auto font-mono text-[10px] text-muted-foreground">
                    {project.tags.join(" / ")}
                  </p>
                </Link>
              )
            })}
          </GridColumns>
        </GridSection>
      ))}
      <GridSeparator />
      <GridSection aria-labelledby="about-title" className="px-4 py-8 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="about-title" className="text-sm font-medium">
            关于我
          </h2>
          <ArrowDownRight
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
        </div>
        <div className="flex max-w-xl flex-col gap-3 text-sm leading-7 text-pretty text-muted-foreground">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-6 font-mono text-xs text-muted-foreground">
          持续学习，慢慢构建。<span className="ml-2 text-primary">_</span>
        </p>
      </GridSection>
    </GridContainer>
  )
}
