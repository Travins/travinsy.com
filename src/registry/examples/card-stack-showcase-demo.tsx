"use client"

import { CardStack, CardStackItem } from "@/registry/ui/card-stack/card-stack"

export default function CardStackShowcaseDemo() {
  return (
    <div className="flex w-full items-center justify-center bg-dots p-8">
      <CardStack
        mode="drag"
        label="作品卡片"
        className="max-w-64"
        offset={12}
        scale={0.05}
      >
        {["把界面，写成积木", "让想法有处安放", "小工具，大有用处"].map(
          (title, index) => (
            <CardStackItem key={title} className="p-5">
              <div className="mb-7 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <span>SELECTED WORK</span>
                <span>0{index + 1}</span>
              </div>
              <h3 className="text-lg font-medium tracking-tight">{title}</h3>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                设计、代码，以及一点好奇心。
              </p>
              <div className="mt-6 flex gap-1.5">
                <span className="rounded border border-edge px-2 py-1 font-mono text-[10px]">
                  React
                </span>
                <span className="rounded border border-edge px-2 py-1 font-mono text-[10px]">
                  Next.js
                </span>
              </div>
            </CardStackItem>
          ),
        )}
      </CardStack>
    </div>
  )
}
