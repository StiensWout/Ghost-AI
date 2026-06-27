"use client"

import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose?: () => void
  onNewProject?: () => void
  className?: string
}

function EmptyProjectState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-44 items-center justify-center rounded-2xl border border-dashed border-surface-border-subtle bg-surface/70 px-6 text-center text-sm text-copy-muted">
      {children}
    </div>
  )
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onNewProject,
  className,
}: ProjectSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={cn(
        "fixed bottom-4 left-4 top-18 z-40 flex w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl backdrop-blur-xl transition-transform duration-200 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)]",
        !isOpen && "pointer-events-none",
        className
      )}
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
        <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Close project sidebar"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="my-projects" className="min-h-0 flex-1 gap-4 p-4">
        <TabsList className="grid w-full grid-cols-2 bg-subtle">
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>
        <TabsContent value="my-projects" className="mt-0">
          <EmptyProjectState>No projects yet.</EmptyProjectState>
        </TabsContent>
        <TabsContent value="shared" className="mt-0">
          <EmptyProjectState>No shared projects yet.</EmptyProjectState>
        </TabsContent>
      </Tabs>

      <div className="border-t border-sidebar-border p-4">
        <Button type="button" className="w-full" onClick={onNewProject}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </aside>
  )
}
