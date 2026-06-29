"use client"

import { useState } from "react"
import { Bot, Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CollaborativeCanvas } from "@/components/editor/collaborative-canvas"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ShareProjectDialog } from "@/components/editor/share-project-dialog"
import { getProjectWorkspacePath } from "@/hooks/use-project-actions"
import { useProjectActions } from "@/hooks/use-project-actions"
import { useSidebarPreference } from "@/hooks/use-sidebar-preference"
import { cn } from "@/lib/utils"
import type { ProjectSidebarItem } from "@/types/projects"

interface EditorWorkspaceShellProps {
  currentProject: ProjectSidebarItem
  ownedProjects: ProjectSidebarItem[]
  sharedProjects: ProjectSidebarItem[]
}

export function EditorWorkspaceShell({
  currentProject,
  ownedProjects,
  sharedProjects,
}: EditorWorkspaceShellProps) {
  const {
    isSidebarOpen: isProjectSidebarOpen,
    isSidebarOpenByDefault,
    setIsSidebarOpen: setIsProjectSidebarOpen,
    updateSidebarDefaultOpen,
  } = useSidebarPreference({ defaultOpen: false })
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false)
  const projectActions = useProjectActions({ activeProjectId: currentProject.id })
  const workspacePath = getProjectWorkspacePath(currentProject.id)

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isProjectSidebarOpen}
        onToggleSidebar={() =>
          setIsProjectSidebarOpen((current) => !current)
        }
        isSidebarOpenByDefault={isSidebarOpenByDefault}
        onSidebarOpenByDefaultChange={updateSidebarDefaultOpen}
        title={currentProject.name}
        subtitle={`/${currentProject.roomId}`}
        actions={
          <>
            <ShareProjectDialog
              key={currentProject.id}
              projectId={currentProject.id}
              workspacePath={workspacePath}
              canManageProject={currentProject.access === "owner"}
            />
            <Button
              type="button"
              variant={isAiSidebarOpen ? "secondary" : "ghost"}
              size="sm"
              aria-label={
                isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"
              }
              aria-pressed={isAiSidebarOpen}
              title={isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
              className="border border-surface-border bg-base/70 px-3 text-copy-primary hover:bg-subtle"
              onClick={() => setIsAiSidebarOpen((current) => !current)}
            >
              <Sparkles className="h-4 w-4" />
              <span>AI</span>
            </Button>
          </>
        }
      />

      <ProjectSidebar
        isOpen={isProjectSidebarOpen}
        activeProjectId={currentProject.id}
        onClose={() => setIsProjectSidebarOpen(false)}
        onNewProject={projectActions.openCreateDialog}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        onRenameProject={projectActions.openRenameDialog}
        onDeleteProject={projectActions.openDeleteDialog}
      />

      <section className="relative flex min-h-0 flex-1 bg-base p-1.5">
        <div className="relative min-w-0 flex-1 overflow-hidden rounded-3xl border border-surface-border bg-base shadow-2xl">
          <CollaborativeCanvas roomId={currentProject.roomId} />
        </div>

        {isAiSidebarOpen ? (
          <button
            type="button"
            aria-label="Close AI sidebar"
            className="fixed inset-0 z-30 bg-base/70 backdrop-blur-sm md:hidden"
            onClick={() => setIsAiSidebarOpen(false)}
          />
        ) : null}

        <aside
          aria-hidden={!isAiSidebarOpen}
          inert={!isAiSidebarOpen}
          className={cn(
            "fixed bottom-4 right-4 top-18 z-40 flex w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl backdrop-blur-xl transition-transform duration-200 ease-out",
            isAiSidebarOpen
              ? "translate-x-0"
              : "pointer-events-none translate-x-[calc(100%+2rem)]"
          )}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent-dim text-ai-text">
                <Bot className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-medium text-copy-primary">
                  AI Chat
                </h2>
                <p className="truncate text-xs text-copy-muted">
                  Workspace assistant
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Close AI sidebar"
              onClick={() => setIsAiSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center px-6 text-center">
            <p className="text-sm leading-6 text-copy-muted">
              AI chat will appear here.
            </p>
          </div>
        </aside>
      </section>

      <ProjectDialogs controller={projectActions} />
    </main>
  )
}
