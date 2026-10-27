"use client"

import {
  CardStack,
  CardStackControls,
  CardStackItem,
} from "@/registry/ui/card-stack/card-stack"

export default function CardStackDragDemo() {
  return (
    <div className="w-full max-w-sm px-2 py-4">
      <CardStack mode="drag" label="拖拽组件预览" offset={14}>
        <CardStackItem>
          <div
            className="grid h-32 grid-cols-[1fr_2fr] gap-px overflow-hidden rounded-md border border-edge bg-edge"
            aria-hidden="true"
          >
            <div className="bg-muted" />
            <div className="grid grid-rows-2 gap-px bg-edge">
              <div className="bg-primary/10" />
              <div className="bg-card bg-dots" />
            </div>
          </div>
          <h3 className="mt-5 text-sm font-medium">线条网格</h3>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            向左或向右拖动，翻到下一张。
          </p>
        </CardStackItem>
        <CardStackItem>
          <div
            className="flex h-32 items-end gap-2 rounded-md border border-edge bg-dots p-4"
            aria-hidden="true"
          >
            <div className="h-1/3 flex-1 rounded-sm bg-primary/20" />
            <div className="h-2/3 flex-1 rounded-sm bg-primary/40" />
            <div className="h-full flex-1 rounded-sm bg-primary" />
          </div>
          <h3 className="mt-5 text-sm font-medium">层次与节奏</h3>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            细微的偏移，让层次自然浮现。
          </p>
        </CardStackItem>
        <CardStackItem>
          <div
            className="h-32 rounded-md border border-edge bg-hatch"
            aria-hidden="true"
          />
          <h3 className="mt-5 text-sm font-medium">留白也有纹理</h3>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            也可以用方向键和下方按钮切换。
          </p>
        </CardStackItem>
        <CardStackControls />
      </CardStack>
    </div>
  )
}
