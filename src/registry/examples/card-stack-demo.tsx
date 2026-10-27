"use client"

import { ArrowUpRight, Braces } from "lucide-react"
import {
  CardStack,
  CardStackItem,
  CardStackControls,
} from "@/registry/ui/card-stack/card-stack"

const projects = [
  {
    number: "01",
    title: "把界面，写成积木",
    name: "个人组件库",
    tags: ["React", "Tailwind CSS"],
    description: "从重复的界面里，提炼可以自由组合的原语。",
  },
  {
    number: "02",
    title: "让想法有处安放",
    name: "开发者笔记",
    tags: ["Next.js", "MDX"],
    description: "记录解决问题的过程，也留下一点新的疑问。",
  },
  {
    number: "03",
    title: "小工具，大有用处",
    name: "开发工具箱",
    tags: ["TypeScript", "静态导出"],
    description: "把日常的小麻烦，变成顺手的小工具。",
  },
]
export default function CardStackDemo() {
  return (
    <div className="w-full max-w-sm bg-dots px-2 py-4">
      <CardStack label="精选项目" interval={5000}>
        {projects.map((project) => (
          <CardStackItem key={project.number}>
            <div className="mb-8 flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                PROJECT / {project.number}
              </span>
              <Braces className="size-5 text-primary" aria-hidden="true" />
            </div>
            <p className="mb-2 text-xs text-muted-foreground">{project.name}</p>
            <h3 className="m-0! text-xl! font-medium! tracking-tight">
              {project.title}
            </h3>
            <p className="mt-3 text-[13px] leading-7 text-muted-foreground">
              {project.description}
            </p>
            <div className="mt-7 flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-edge bg-card px-2 py-1 font-mono text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <ArrowUpRight
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </CardStackItem>
        ))}
        <CardStackControls />
      </CardStack>
    </div>
  )
}
