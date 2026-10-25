"use client"

import * as React from "react"
import { LogOutIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { formatLabel, resolveLabels, type AppShellLabels } from "./config"

type AppShellUser = {
  name: string
  email?: string
  avatar?: string
}

type UserMenuProps = {
  user: AppShellUser
  onSignOut?: () => void
  labels?: Partial<AppShellLabels>
  /** 额外的菜单项，放在账号信息与「退出登录」之间，用 DropdownMenuItem */
  children?: React.ReactNode
}

/** 头像 + 下拉菜单：账号信息、自定义菜单项（children）、退出登录。 */
function UserMenu({ user, onSignOut, labels, children }: UserMenuProps) {
  const text = resolveLabels(labels)
  const initial = user.name.trim().slice(0, 1).toUpperCase() || "U"
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label={formatLabel(text.userMenu, user.name)}
          />
        }
      >
        <Avatar size="sm">
          {user.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        data-slot="app-shell-user-menu"
        align="end"
        className="w-56"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-1.5 font-normal">
            <span className="truncate text-sm font-medium text-foreground">
              {user.name}
            </span>
            {user.email ? (
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            ) : null}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        {children ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>{children}</DropdownMenuGroup>
          </>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onSignOut}>
          <LogOutIcon />
          {text.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { UserMenu }
export type { AppShellUser, UserMenuProps }
