"use client"

import { Pencil, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MockProject } from "@/components/editor/use-project-dialogs"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose?: () => void
  onNewProject?: () => void
  projects: MockProject[]
  onRenameProject?: (project: MockProject) => void
  onDeleteProject?: (project: MockProject) => void
  className?: string
}

function EmptyProjectState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-44 items-center justify-center rounded-2xl border border-dashed border-surface-border-subtle bg-surface/70 px-6 text-center text-sm text-copy-muted">
      {children}
    </div>
  )
}

function ProjectList({
  projects,
  onRenameProject,
  onDeleteProject,
}: {
  projects: MockProject[]
  onRenameProject?: (project: MockProject) => void
  onDeleteProject?: (project: MockProject) => void
}) {
  if (projects.length === 0) {
    return <EmptyProjectState>No projects yet.</EmptyProjectState>
  }

  return (
    <div className="space-y-2">
      {projects.map((project) => {
        const showActions = project.access === "owner"

        return (
          <div
            key={project.id}
            className="group flex min-h-16 items-center gap-3 rounded-2xl border border-surface-border bg-surface/80 px-3 py-2"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-copy-primary">
                {project.name}
              </p>
              <p className="mt-1 truncate font-mono text-xs text-copy-muted">
                /{project.slug}
              </p>
              <p className="mt-1 text-xs text-copy-faint">
                {project.updatedAtLabel}
              </p>
            </div>

            {showActions ? (
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Rename ${project.name}`}
                  title={`Rename ${project.name}`}
                  onClick={() => onRenameProject?.(project)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  aria-label={`Delete ${project.name}`}
                  title={`Delete ${project.name}`}
                  onClick={() => onDeleteProject?.(project)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onNewProject,
  projects,
  onRenameProject,
  onDeleteProject,
  className,
}: ProjectSidebarProps) {
  const ownedProjects = projects.filter((project) => project.access === "owner")
  const sharedProjects = projects.filter(
    (project) => project.access === "collaborator"
  )

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Close project sidebar"
          className="fixed inset-0 z-30 bg-base/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      ) : null}

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
            <ProjectList
              projects={ownedProjects}
              onRenameProject={onRenameProject}
              onDeleteProject={onDeleteProject}
            />
          </TabsContent>
          <TabsContent value="shared" className="mt-0">
            <ProjectList projects={sharedProjects} />
          </TabsContent>
        </Tabs>

        <div className="border-t border-sidebar-border p-4">
          <Button type="button" className="w-full" onClick={onNewProject}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
