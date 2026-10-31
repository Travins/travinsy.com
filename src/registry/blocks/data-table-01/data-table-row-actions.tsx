"use client"
import * as React from "react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"

type DataTableRowAction =
  | "separator"
  | {
      label: string
      icon?: React.ReactNode
      shortcut?: React.ReactNode
      destructive?: boolean
      onSelect: () => void
    }
function DataTableRowActions({
  label,
  actions,
  ...props
}: React.ComponentProps<"div"> & {
  label: string
  actions: DataTableRowAction[]
}) {
  return (
    <div {...props} data-slot="data-table-row-actions">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground group-hover/row:text-foreground hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground"
              aria-label={label + " 的操作"}
            />
          }
        >
          <MoreHorizontal aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-auto min-w-40 *:text-xs! [&_[role=menuitem]_svg]:size-3.5!"
        >
          {actions.map((action, index) =>
            action === "separator" ? (
              <DropdownMenuSeparator key={index} />
            ) : (
              <DropdownMenuItem
                key={index}
                variant={action.destructive ? "destructive" : "default"}
                onClick={action.onSelect}
              >
                {action.icon}
                <span className="whitespace-nowrap">{action.label}</span>
                {action.shortcut && (
                  // 右侧附注（如编号）不换行，菜单宽度随内容撑开
                  <DropdownMenuShortcut className="ps-4 font-mono whitespace-nowrap">
                    {action.shortcut}
                  </DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
export { DataTableRowActions }
export type { DataTableRowAction }
