"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { useProjectActions } from "@/hooks/use-project-actions"
import { useSidebarPreference } from "@/hooks/use-sidebar-preference"
import type { ProjectSidebarItem } from "@/types/projects"

interface EditorLayoutPreviewProps {
  activeProjectId?: string
  ownedProjects: ProjectSidebarItem[]
  sharedProjects: ProjectSidebarItem[]
}

export function EditorLayoutPreview({
  activeProjectId,
  ownedProjects,
  sharedProjects,
}: EditorLayoutPreviewProps) {
  const {
    isSidebarOpen,
    isSidebarOpenByDefault,
    setIsSidebarOpen,
    updateSidebarDefaultOpen,
  } = useSidebarPreference({ defaultOpen: true })
  const projectActions = useProjectActions({ activeProjectId })
  const activeProject = [...ownedProjects, ...sharedProjects].find(
    (project) => project.id === activeProjectId
  )

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
        isSidebarOpenByDefault={isSidebarOpenByDefault}
        onSidebarOpenByDefaultChange={updateSidebarDefaultOpen}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        activeProjectId={activeProjectId}
        onClose={() => setIsSidebarOpen(false)}
        onNewProject={projectActions.openCreateDialog}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        onRenameProject={projectActions.openRenameDialog}
        onDeleteProject={projectActions.openDeleteDialog}
      />

      <section className="relative min-h-0 flex-1 bg-base">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--border-default)_1px,transparent_0)] bg-[length:32px_32px] opacity-35" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--border-default)_1px,transparent_1px),linear-gradient(45deg,var(--bg-subtle)_1px,transparent_1px)] bg-[length:18px_18px,22px_22px] opacity-10" />
        <div className="relative flex h-full min-h-[calc(100vh-3.5rem)] items-center justify-center px-6">
          <div className="max-w-md text-center">
            {activeProject ? (
              <>
                <p className="font-mono text-xs uppercase text-brand">
                  /{activeProject.roomId}
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-copy-primary">
                  {activeProject.name}
                </h1>
              </>
            ) : (
              <>
                <h1 className="mt-3 text-3xl font-semibold text-copy-primary">
                  Create a project or open an existing one
                </h1>
                <p className="mt-4 text-sm leading-6 text-copy-secondary">
                  Start a new architecture workspace, or choose a project from the
                  sidebar.
                </p>
                <Button
                  type="button"
                  className="mt-6"
                  onClick={projectActions.openCreateDialog}
                >
                  <Plus className="h-4 w-4" />
                  New Project
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <ProjectDialogs controller={projectActions} />
    </main>
  )
}
