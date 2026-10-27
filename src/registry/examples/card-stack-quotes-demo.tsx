"use client"

import {
  CardStack,
  CardStackItem,
  CardStackControls,
} from "@/registry/ui/card-stack/card-stack"

const quotes = [
  {
    quote: "好的工具，让人把注意力留给真正想做的事。",
    author: "林川",
    role: "独立开发者",
  },
  {
    quote: "少一点配置，多一点可以直接开始的空间。",
    author: "许言",
    role: "产品设计师",
  },
  {
    quote: "每一个看似简单的交互，都值得认真打磨。",
    author: "周宁",
    role: "前端工程师",
  },
]
export default function CardStackQuotesDemo() {
  return (
    <div className="w-full max-w-sm px-2 py-4">
      <CardStack label="开发者的话" interval={6000}>
        {quotes.map((item) => (
          <CardStackItem key={item.author}>
            <blockquote className="border-0! pl-0! text-foreground!">
              <span
                aria-hidden="true"
                className="block h-14 font-serif text-7xl leading-none text-primary/40"
              >
                “
              </span>
              <p className="min-h-24 text-lg leading-8 tracking-tight">
                {item.quote}
              </p>
              <footer className="mt-6 border-t border-edge pt-4 text-sm">
                {item.author}
                <span className="ml-3 text-xs text-muted-foreground">
                  {item.role}
                </span>
              </footer>
            </blockquote>
          </CardStackItem>
        ))}
        <CardStackControls />
      </CardStack>
    </div>
  )
}
