"use client"

import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import {
  Check,
  KeyRound,
  Link2,
  LoaderCircle,
  Share2,
  Trash2,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  "h-12 rounded-xl border-surface-border-subtle bg-surface px-4 text-base text-copy-primary caret-brand transition-[background-color,color,box-shadow] placeholder:text-copy-muted focus-visible:ring-brand/30 [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_var(--bg-surface)_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:var(--text-primary)]"

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
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isMutating = isInviting || removingEmail !== null
  const isCollaboratorMutationDisabled = isLoading || isMutating
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

    if (!collaboratorEmail || isCollaboratorMutationDisabled) {
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
    if (isCollaboratorMutationDisabled) {
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
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100vw-2rem)] max-w-[52rem] overflow-hidden rounded-3xl border border-surface-border bg-elevated p-0 text-copy-primary shadow-2xl sm:max-w-[52rem]"
        >
          <div className="flex max-h-[90vh] flex-col">
            <div className="px-8 pt-8 pb-7">
              <div className="flex items-start justify-between gap-6">
                <DialogTitle className="text-3xl font-medium leading-none text-copy-primary">
                  Share project
                </DialogTitle>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-lg"
                    disabled={isMutating}
                    aria-label="Close share dialog"
                    className="-mt-2 -mr-2 text-copy-secondary hover:bg-subtle hover:text-copy-primary"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </DialogClose>
              </div>

              <DialogDescription className="sr-only">
                {canManage
                  ? "Invite collaborators and manage workspace access."
                  : "Current workspace collaborators."}
              </DialogDescription>

              <div className="mt-8 space-y-8">
                {canManage ? (
                  <form
                    className="flex flex-col gap-3 sm:flex-row"
                    onSubmit={inviteCollaborator}
                  >
                    <label htmlFor="share-project-email" className="sr-only">
                      Email address
                    </label>
                    <Input
                      id="share-project-email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)
                        setErrorMessage(null)
                      }}
                      placeholder="Add others by email"
                      className={`${shareInputClassName} min-w-0 flex-1`}
                    />
                    <Button
                      type="submit"
                      aria-label={
                        isInviting
                          ? "Inviting collaborator"
                          : "Invite collaborator"
                      }
                      className="h-12 min-w-36 rounded-xl px-6 text-sm font-semibold uppercase disabled:bg-subtle disabled:text-copy-muted disabled:opacity-100"
                      disabled={
                        email.trim().length === 0 ||
                        isCollaboratorMutationDisabled
                      }
                    >
                      {isInviting ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : null}
                      <span>{isInviting ? "Inviting..." : "Invite"}</span>
                    </Button>
                  </form>
                ) : null}

                <section className="space-y-5">
                  <div className="flex items-center gap-3 text-copy-muted">
                    <KeyRound className="h-5 w-5" />
                    <h3 className="text-lg font-medium">
                      People with access
                    </h3>
                  </div>

                  <div className="min-h-36">
                    {isLoading ? (
                      <div className="flex h-36 items-center justify-center gap-2 text-sm text-copy-muted">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        <span>Loading collaborators</span>
                      </div>
                    ) : collaborators.length > 0 ? (
                      hasScrollableCollaboratorList ? (
                        <ScrollArea className="h-80 max-h-[38vh] pr-3">
                          <CollaboratorList
                            collaborators={collaborators}
                            canManage={canManage}
                            removingEmail={removingEmail}
                            isDisabled={isCollaboratorMutationDisabled}
                            onRemove={removeCollaborator}
                          />
                        </ScrollArea>
                      ) : (
                        <CollaboratorList
                          collaborators={collaborators}
                          canManage={canManage}
                          removingEmail={removingEmail}
                          isDisabled={isCollaboratorMutationDisabled}
                          onRemove={removeCollaborator}
                        />
                      )
                    ) : (
                      <div className="flex h-36 items-center justify-center rounded-2xl border border-surface-border bg-surface text-center">
                        <p className="text-sm text-copy-muted">
                          No collaborators yet.
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {errorMessage ? (
                  <p role="alert" className="text-sm text-error">
                    {errorMessage}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-surface-border bg-surface px-8 py-5">
              {canManage ? (
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isMutating}
                  className="h-10 px-2 text-lg text-brand hover:bg-accent-dim hover:text-brand"
                  onClick={copyProjectLink}
                >
                  {copyStatus === "copied" ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Link2 className="h-5 w-5" />
                  )}
                  <span>
                    {copyStatus === "copied"
                      ? "Copied link"
                      : copyStatus === "error"
                        ? "Copy failed"
                        : "Copy link"}
                  </span>
                </Button>
              ) : null}
              <Button
                type="button"
                variant="outline"
                disabled={isMutating}
                className="ml-auto h-10 px-5"
                onClick={closeShareDialog}
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
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
    <div className="flex min-h-20 items-center gap-5 py-3">
      <CollaboratorAvatar collaborator={collaborator} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xl font-medium leading-tight text-copy-primary">
          {displayName}
        </p>
        <p className="truncate text-base leading-6 text-copy-muted">
          {secondaryText}
        </p>
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
  const avatarUrl = collaborator.avatarUrl
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null)

  if (avatarUrl && failedAvatarUrl !== avatarUrl) {
    return (
      <span className="block h-14 w-14 shrink-0 overflow-hidden rounded-full border border-surface-border bg-subtle">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl}
          alt=""
          aria-hidden="true"
          width={56}
          height={56}
          draggable={false}
          referrerPolicy="no-referrer"
          className="block h-full w-full object-cover"
          onError={() => setFailedAvatarUrl(avatarUrl)}
        />
      </span>
    )
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-surface-border bg-accent-dim font-mono text-base text-brand">
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
