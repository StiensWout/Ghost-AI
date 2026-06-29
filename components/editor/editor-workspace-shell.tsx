"use client"

import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import {
  Bot,
  Check,
  PanelRightClose,
  PanelRightOpen,
  Share2,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { EditorDialogContent } from "@/components/editor/editor-dialog"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
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

type ShareStatus = "idle" | "shared" | "copied" | "error"

interface ShareProjectResponse {
  collaborator: {
    email: string
  }
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
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [shareEmail, setShareEmail] = useState("")
  const [shareLink, setShareLink] = useState("")
  const [sharedEmail, setSharedEmail] = useState("")
  const [shareError, setShareError] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle")
  const projectActions = useProjectActions({ activeProjectId: currentProject.id })
  const AiSidebarIcon = isAiSidebarOpen ? PanelRightClose : PanelRightOpen
  const ShareIcon =
    shareStatus === "shared" || shareStatus === "copied" ? Check : Share2
  const shareLabel =
    shareStatus === "shared"
      ? "Shared"
      : shareStatus === "copied"
      ? "Copied"
      : shareStatus === "error"
        ? "Copy failed"
        : "Share"
  const canShareProject = currentProject.access === "owner"
  const workspacePath = getProjectWorkspacePath(currentProject.id)

  useEffect(() => {
    if (shareStatus === "idle") {
      return
    }

    const timeoutId = window.setTimeout(() => setShareStatus("idle"), 1800)

    return () => window.clearTimeout(timeoutId)
  }, [shareStatus])

  function openShareDialog() {
    setIsShareDialogOpen(true)
    setShareError(null)
  }

  async function shareWorkspaceAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const email = shareEmail.trim()

    if (!email || isSharing) {
      return
    }

    setIsSharing(true)
    setShareError(null)

    try {
      const collaborator = await requestProjectShare(currentProject.id, email)
      const workspaceUrl = getWorkspaceUrl(workspacePath)
      setSharedEmail(collaborator.email)
      setShareEmail("")
      setShareLink(workspaceUrl)
      setShareStatus("shared")
      try {
        await copyWorkspaceLink(workspaceUrl)
      } catch {
        setShareStatus("error")
      }
    } catch (error) {
      setShareError(getShareErrorMessage(error))
      setShareStatus("error")
    } finally {
      setIsSharing(false)
    }
  }

  async function copySharedLink() {
    try {
      await copyWorkspaceLink(shareLink || getWorkspaceUrl(workspacePath))
      setShareStatus("copied")
    } catch {
      setShareStatus("error")
    }
  }

  async function copyWorkspaceLink(url: string) {
    await navigator.clipboard.writeText(url)
  }

  function closeShareDialog() {
    if (isSharing) {
      return
    }

    setIsShareDialogOpen(false)
    setShareEmail("")
    setShareError(null)
    setShareLink("")
    setSharedEmail("")
  }

  async function copyFallbackLink() {
    try {
      await copyWorkspaceLink(getWorkspaceUrl(workspacePath))
      setShareStatus("copied")
    } catch {
      setShareStatus("error")
    }
  }

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
            {canShareProject ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                aria-label="Share project"
                title="Share project"
                onClick={openShareDialog}
              >
                <ShareIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{shareLabel}</span>
              </Button>
            ) : null}
            <Button
              type="button"
              variant={isAiSidebarOpen ? "secondary" : "ghost"}
              size="icon"
              aria-label={
                isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"
              }
              aria-pressed={isAiSidebarOpen}
              title={isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
              onClick={() => setIsAiSidebarOpen((current) => !current)}
            >
              <AiSidebarIcon className="h-5 w-5" />
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

      <section className="relative flex min-h-0 flex-1 bg-base">
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--border-default)_1px,transparent_0)] bg-[length:32px_32px] opacity-35" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--border-default)_1px,transparent_1px),linear-gradient(45deg,var(--bg-subtle)_1px,transparent_1px)] bg-[length:18px_18px,22px_22px] opacity-10" />
          <div className="relative flex h-full min-h-[calc(100vh-3.5rem)] items-center justify-center px-6">
            <div className="max-w-sm rounded-2xl border border-surface-border bg-surface/80 px-6 py-5 text-center shadow-2xl backdrop-blur-xl">
              <p className="font-mono text-xs uppercase text-brand">
                /{currentProject.roomId}
              </p>
              <h1 className="mt-3 text-2xl font-semibold text-copy-primary">
                Canvas workspace
              </h1>
              <p className="mt-3 text-sm leading-6 text-copy-muted">
                No canvas is loaded for this workspace yet.
              </p>
            </div>
          </div>
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
      <Dialog
        open={isShareDialogOpen}
        onOpenChange={(open) => {
          if (open) {
            openShareDialog()
            return
          }

          closeShareDialog()
        }}
      >
        <EditorDialogContent
          title="Share project"
          description="Grant access to one email address. Send them the workspace link after sharing."
          footer={
            <>
              <Button
                type="button"
                variant="outline"
                disabled={isSharing}
                onClick={closeShareDialog}
              >
                Done
              </Button>
              <Button
                type="submit"
                form="share-project-form"
                disabled={shareEmail.trim().length === 0 || isSharing}
              >
                {isSharing ? "Sharing..." : "Share Project"}
              </Button>
            </>
          }
        >
          <form
            id="share-project-form"
            className="space-y-4"
            onSubmit={shareWorkspaceAccess}
          >
            <div className="space-y-2">
              <label
                htmlFor="share-project-email"
                className="text-sm font-medium text-copy-primary"
              >
                Email address
              </label>
              <Input
                id="share-project-email"
                type="email"
                value={shareEmail}
                onChange={(event) => {
                  setShareEmail(event.target.value)
                  setShareError(null)
                }}
                placeholder="teammate@example.com"
                className="border-surface-border-subtle bg-surface text-copy-primary caret-brand placeholder:text-copy-muted"
              />
            </div>

            {sharedEmail ? (
              <div className="space-y-3 rounded-xl border border-surface-border bg-subtle px-3 py-3">
                <p className="text-sm text-copy-secondary">
                  Access granted to{" "}
                  <span className="font-medium text-copy-primary">
                    {sharedEmail}
                  </span>
                  .
                </p>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={shareLink}
                    className="border-surface-border-subtle bg-surface font-mono text-xs text-copy-secondary"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={copySharedLink}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-surface-border bg-subtle px-3 py-3">
                <p className="text-xs font-medium uppercase text-copy-faint">
                  Workspace link
                </p>
                <button
                  type="button"
                  className="mt-1 block max-w-full truncate font-mono text-sm text-brand"
                  onClick={copyFallbackLink}
                >
                  {workspacePath}
                </button>
              </div>
            )}

            {shareError ? (
              <p role="alert" className="text-sm text-error">
                {shareError}
              </p>
            ) : null}
          </form>
        </EditorDialogContent>
      </Dialog>
    </main>
  )
}

async function requestProjectShare(projectId: string, email: string) {
  const response = await fetch(
    `/api/projects/${encodeURIComponent(projectId)}/collaborators`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  )
  const payload = await readJsonPayload(response)

  if (!response.ok) {
    throw new Error(readApiError(payload) ?? "Unable to share project.")
  }

  if (!isShareProjectResponse(payload)) {
    throw new Error("Share response was malformed.")
  }

  return payload.collaborator
}

async function readJsonPayload(response: Response) {
  try {
    return (await response.json()) as unknown
  } catch {
    return null
  }
}

function readApiError(payload: unknown) {
  if (!isRecord(payload) || typeof payload.error !== "string") {
    return null
  }

  return payload.error
}

function isShareProjectResponse(value: unknown): value is ShareProjectResponse {
  return (
    isRecord(value) &&
    isRecord(value.collaborator) &&
    typeof value.collaborator.email === "string"
  )
}

function getShareErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.length > 0) {
    return error.message
  }

  return "Unable to share project."
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getWorkspaceUrl(workspacePath: string) {
  return new URL(workspacePath, window.location.origin).toString()
}
