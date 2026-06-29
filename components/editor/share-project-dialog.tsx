"use client"

import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import {
  Check,
  Copy,
  LoaderCircle,
  Share2,
  Trash2,
  UserRoundPlus,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EditorDialogContent } from "@/components/editor/editor-dialog"
import type {
  ProjectCollaboratorResource,
  ProjectCollaboratorResponse,
  ProjectCollaboratorsResponse,
} from "@/types/projects"

interface ShareProjectDialogProps {
  projectId: string
  workspacePath: string
  canManageProject: boolean
}

type CopyStatus = "idle" | "copied" | "error"

const shareInputClassName =
  "border-surface-border-subtle bg-surface text-copy-primary caret-brand placeholder:text-copy-muted"

export function ShareProjectDialog({
  projectId,
  workspacePath,
  canManageProject,
}: ShareProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const [removingEmail, setRemovingEmail] = useState<string | null>(null)
  const [canManage, setCanManage] = useState(canManageProject)
  const [collaborators, setCollaborators] = useState<
    ProjectCollaboratorResource[]
  >([])
  const [email, setEmail] = useState("")
  const [workspaceUrl, setWorkspaceUrl] = useState(workspacePath)
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isMutating = isInviting || removingEmail !== null
  const hasScrollableCollaboratorList = collaborators.length > 4

  useEffect(() => {
    if (!isOpen) {
      return
    }

    let didCancel = false

    async function loadCollaborators() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const payload = await requestProjectCollaborators(projectId)

        if (didCancel) {
          return
        }

        setCollaborators(payload.collaborators)
        setCanManage(payload.canManage)
      } catch (error) {
        if (didCancel) {
          return
        }

        setErrorMessage(getShareErrorMessage(error))
      } finally {
        if (!didCancel) {
          setIsLoading(false)
        }
      }
    }

    loadCollaborators()

    return () => {
      didCancel = true
    }
  }, [isOpen, projectId])

  useEffect(() => {
    if (copyStatus === "idle") {
      return
    }

    const timeoutId = window.setTimeout(() => setCopyStatus("idle"), 1800)

    return () => window.clearTimeout(timeoutId)
  }, [copyStatus])

  function openShareDialog() {
    setCanManage(canManageProject)
    setWorkspaceUrl(getWorkspaceUrl(workspacePath))
    setCopyStatus("idle")
    setErrorMessage(null)
    setIsOpen(true)
  }

  function closeShareDialog() {
    if (isMutating) {
      return
    }

    setIsOpen(false)
    setEmail("")
    setErrorMessage(null)
    setCopyStatus("idle")
  }

  async function inviteCollaborator(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const collaboratorEmail = email.trim()

    if (!collaboratorEmail || isInviting) {
      return
    }

    setIsInviting(true)
    setErrorMessage(null)

    try {
      const collaborator = await requestInviteCollaborator(
        projectId,
        collaboratorEmail
      )

      setCollaborators((current) =>
        sortCollaborators([
          ...current.filter((item) => item.email !== collaborator.email),
          collaborator,
        ])
      )
      setEmail("")
    } catch (error) {
      setErrorMessage(getShareErrorMessage(error))
    } finally {
      setIsInviting(false)
    }
  }

  async function removeCollaborator(emailToRemove: string) {
    if (removingEmail !== null) {
      return
    }

    setRemovingEmail(emailToRemove)
    setErrorMessage(null)

    try {
      await requestRemoveCollaborator(projectId, emailToRemove)
      setCollaborators((current) =>
        current.filter((collaborator) => collaborator.email !== emailToRemove)
      )
    } catch (error) {
      setErrorMessage(getShareErrorMessage(error))
    } finally {
      setRemovingEmail(null)
    }
  }

  async function copyProjectLink() {
    const projectUrl = getWorkspaceUrl(workspacePath)

    try {
      await navigator.clipboard.writeText(projectUrl)
      setWorkspaceUrl(projectUrl)
      setCopyStatus("copied")
    } catch {
      setCopyStatus("error")
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        aria-label="Share project"
        title="Share project"
        onClick={openShareDialog}
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Share</span>
      </Button>

      <Dialog
        open={isOpen}
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
          description={
            canManage
              ? "Invite collaborators and manage workspace access."
              : "Current workspace collaborators."
          }
          className="w-[min(calc(100vw-2rem),44rem)] max-w-none sm:max-w-none"
          footer={
            <Button
              type="button"
              variant="outline"
              disabled={isMutating}
              onClick={closeShareDialog}
            >
              Done
            </Button>
          }
        >
          <div className="space-y-5">
            {canManage ? (
              <>
                <form className="space-y-2" onSubmit={inviteCollaborator}>
                  <label
                    htmlFor="share-project-email"
                    className="text-sm font-medium text-copy-primary"
                  >
                    Email address
                  </label>
                  <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <Input
                      id="share-project-email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)
                        setErrorMessage(null)
                      }}
                      placeholder="teammate@example.com"
                      className={shareInputClassName}
                    />
                    <Button
                      type="submit"
                      disabled={email.trim().length === 0 || isInviting}
                    >
                      {isInviting ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserRoundPlus className="h-4 w-4" />
                      )}
                      <span className="hidden sm:inline">
                        {isInviting ? "Inviting..." : "Invite"}
                      </span>
                    </Button>
                  </div>
                </form>

                <div className="space-y-2 rounded-xl border border-surface-border bg-subtle px-3 py-3">
                  <p className="text-xs font-medium uppercase text-copy-faint">
                    Project link
                  </p>
                  <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <Input
                      readOnly
                      value={workspaceUrl}
                      className="border-surface-border-subtle bg-surface font-mono text-xs text-copy-secondary"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={copyProjectLink}
                    >
                      {copyStatus === "copied" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span>
                        {copyStatus === "copied"
                          ? "Copied!"
                          : copyStatus === "error"
                            ? "Copy failed"
                            : "Copy"}
                      </span>
                    </Button>
                  </div>
                </div>
              </>
            ) : null}

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand" />
                  <h3 className="text-sm font-medium text-copy-primary">
                    Collaborators
                  </h3>
                </div>
                <span className="font-mono text-xs text-copy-muted">
                  {collaborators.length}
                </span>
              </div>

              <div className="rounded-xl border border-surface-border bg-surface">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-copy-muted">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <span>Loading collaborators</span>
                  </div>
                ) : collaborators.length > 0 ? (
                  hasScrollableCollaboratorList ? (
                    <ScrollArea className="h-64 max-h-[35vh]">
                      <CollaboratorList
                        collaborators={collaborators}
                        canManage={canManage}
                        removingEmail={removingEmail}
                        isDisabled={isMutating}
                        onRemove={removeCollaborator}
                      />
                    </ScrollArea>
                  ) : (
                    <CollaboratorList
                      collaborators={collaborators}
                      canManage={canManage}
                      removingEmail={removingEmail}
                      isDisabled={isMutating}
                      onRemove={removeCollaborator}
                    />
                  )
                ) : (
                  <p className="px-4 py-8 text-center text-sm text-copy-muted">
                    No collaborators yet.
                  </p>
                )}
              </div>
            </section>

            {errorMessage ? (
              <p role="alert" className="text-sm text-error">
                {errorMessage}
              </p>
            ) : null}
          </div>
        </EditorDialogContent>
      </Dialog>
    </>
  )
}

interface CollaboratorListProps {
  collaborators: ProjectCollaboratorResource[]
  canManage: boolean
  removingEmail: string | null
  isDisabled: boolean
  onRemove: (email: string) => void
}

function CollaboratorList({
  collaborators,
  canManage,
  removingEmail,
  isDisabled,
  onRemove,
}: CollaboratorListProps) {
  return (
    <div className="divide-y divide-surface-border">
      {collaborators.map((collaborator) => (
        <CollaboratorRow
          key={collaborator.email}
          collaborator={collaborator}
          canManage={canManage}
          isRemoving={removingEmail === collaborator.email}
          isDisabled={isDisabled}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

interface CollaboratorRowProps {
  collaborator: ProjectCollaboratorResource
  canManage: boolean
  isRemoving: boolean
  isDisabled: boolean
  onRemove: (email: string) => void
}

function CollaboratorRow({
  collaborator,
  canManage,
  isRemoving,
  isDisabled,
  onRemove,
}: CollaboratorRowProps) {
  const displayName = collaborator.displayName ?? collaborator.email
  const secondaryText = collaborator.displayName ? collaborator.email : "Email only"

  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <CollaboratorAvatar collaborator={collaborator} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-copy-primary">
          {displayName}
        </p>
        <p className="truncate text-xs text-copy-muted">{secondaryText}</p>
      </div>
      {canManage ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Remove ${displayName}`}
          title={`Remove ${displayName}`}
          disabled={isDisabled}
          className="text-error hover:bg-error/10 hover:text-error"
          onClick={() => onRemove(collaborator.email)}
        >
          {isRemoving ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      ) : null}
    </div>
  )
}

function CollaboratorAvatar({
  collaborator,
}: {
  collaborator: ProjectCollaboratorResource
}) {
  if (collaborator.avatarUrl) {
    return (
      <div
        aria-hidden="true"
        className="size-9 shrink-0 rounded-xl border border-surface-border bg-cover bg-center"
        style={{ backgroundImage: `url(${collaborator.avatarUrl})` }}
      />
    )
  }

  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-surface-border bg-accent-dim font-mono text-xs text-brand">
      {getCollaboratorInitials(collaborator)}
    </div>
  )
}

async function requestProjectCollaborators(
  projectId: string
): Promise<ProjectCollaboratorsResponse> {
  const response = await fetch(
    `/api/projects/${encodeURIComponent(projectId)}/collaborators`
  )
  const payload = await readJsonPayload(response)

  if (!response.ok) {
    throw new Error(readApiError(payload) ?? "Unable to load collaborators.")
  }

  if (!isProjectCollaboratorsResponse(payload)) {
    throw new Error("Collaborator response was malformed.")
  }

  return payload
}

async function requestInviteCollaborator(projectId: string, email: string) {
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
    throw new Error(readApiError(payload) ?? "Unable to invite collaborator.")
  }

  if (!isProjectCollaboratorResponse(payload)) {
    throw new Error("Invite response was malformed.")
  }

  return payload.collaborator
}

async function requestRemoveCollaborator(projectId: string, email: string) {
  const response = await fetch(
    `/api/projects/${encodeURIComponent(projectId)}/collaborators`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  )
  const payload = await readJsonPayload(response)

  if (!response.ok) {
    throw new Error(readApiError(payload) ?? "Unable to remove collaborator.")
  }
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

function isProjectCollaboratorsResponse(
  value: unknown
): value is ProjectCollaboratorsResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.collaborators) &&
    value.collaborators.every(isProjectCollaboratorResource) &&
    typeof value.canManage === "boolean"
  )
}

function isProjectCollaboratorResponse(
  value: unknown
): value is ProjectCollaboratorResponse {
  return (
    isRecord(value) &&
    isProjectCollaboratorResource(value.collaborator)
  )
}

function isProjectCollaboratorResource(
  value: unknown
): value is ProjectCollaboratorResource {
  return (
    isRecord(value) &&
    typeof value.email === "string" &&
    (typeof value.displayName === "string" || value.displayName === null) &&
    (typeof value.avatarUrl === "string" || value.avatarUrl === null) &&
    typeof value.createdAt === "string"
  )
}

function getShareErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.length > 0) {
    return error.message
  }

  return "Unable to update sharing."
}

function getCollaboratorInitials(collaborator: ProjectCollaboratorResource) {
  const source = collaborator.displayName ?? collaborator.email.split("@")[0]
  const initials = source
    .split(/\s+/)
    .filter((part) => part.length > 0)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("")

  return initials || "?"
}

function sortCollaborators(collaborators: ProjectCollaboratorResource[]) {
  return [...collaborators].sort(
    (first, second) =>
      Date.parse(first.createdAt) - Date.parse(second.createdAt)
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getWorkspaceUrl(workspacePath: string) {
  return new URL(workspacePath, window.location.origin).toString()
}
