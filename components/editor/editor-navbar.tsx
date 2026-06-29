"use client"

import type { ReactNode } from "react"
import { UserButton } from "@clerk/nextjs"
import { PanelLeft, PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SidebarPreferenceSettings } from "@/components/editor/sidebar-preference-settings"
import { cn } from "@/lib/utils"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  isSidebarOpenByDefault: boolean
  onSidebarOpenByDefaultChange: (isOpenByDefault: boolean) => void
  title?: string
  subtitle?: string
  actions?: ReactNode
  className?: string
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  isSidebarOpenByDefault,
  onSidebarOpenByDefaultChange,
  title,
  subtitle,
  actions,
  className,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen

  return (
    <header
      className={cn(
        "grid h-14 w-full shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center border-b border-surface-border bg-surface px-4 text-copy-primary",
        className
      )}
    >
      <div className="flex items-center justify-start">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={isSidebarOpen ? "Close project sidebar" : "Open project sidebar"}
          aria-pressed={isSidebarOpen}
          onClick={onToggleSidebar}
        >
          <SidebarIcon className="h-5 w-5" />
        </Button>
      </div>
      <div className="min-w-0 px-3">
        {title ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-copy-primary">
              {title}
            </p>
            {subtitle ? (
              <p className="truncate font-mono text-xs text-copy-muted">
                {subtitle}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="ml-auto flex min-w-fit items-center justify-end gap-2 justify-self-end">
        {actions}
        <UserButton>
          <UserButton.UserProfilePage
            label="Workspace"
            url="workspace"
            labelIcon={<PanelLeft className="h-4 w-4" />}
          >
            <SidebarPreferenceSettings
              isOpenByDefault={isSidebarOpenByDefault}
              onOpenByDefaultChange={onSidebarOpenByDefaultChange}
            />
          </UserButton.UserProfilePage>
        </UserButton>
      </div>
    </header>
  )
}
