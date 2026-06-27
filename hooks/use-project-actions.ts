"use client"

import { useMemo, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import type { ProjectSidebarItem } from "@/types/projects"

export type ProjectDialogType = "create" | "rename" | "delete"

interface ActiveProjectDialog {
  type: ProjectDialogType
  project: ProjectSidebarItem | null
}

interface ProjectMutationPayload {
  project: {
    id: string
  }
}

interface UseProjectActionsOptions {
  activeProjectId?: string
}

const maxRoomSlugLength = 64

export function slugifyProjectName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getProjectWorkspacePath(projectId: string) {
  return `/editor/${encodeURIComponent(projectId)}`
}

export function useProjectActions({
  activeProjectId,
}: UseProjectActionsOptions = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeDialog, setActiveDialog] = useState<ActiveProjectDialog | null>(
    null
  )
  const activeDialogRef = useRef<ActiveProjectDialog | null>(null)
  const requestIdRef = useRef(0)
  const [createProjectName, setCreateProjectName] = useState("")
  const [createRoomSuffix, setCreateRoomSuffix] = useState(generateShortSuffix)
  const [renameProjectName, setRenameProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const createProjectRoomId = useMemo(() => {
    const roomSlug = getRoomSlug(createProjectName)

    if (!roomSlug) {
      return null
    }

    return `${roomSlug}-${createRoomSuffix}`
  }, [createProjectName, createRoomSuffix])
  const createProjectNameError = useMemo(() => {
    if (createProjectName.trim().length === 0 || createProjectRoomId) {
      return null
    }

    return "Project name must include at least one letter or number."
  }, [createProjectName, createProjectRoomId])
  const canCreateProject =
    createProjectName.trim().length > 0 && createProjectRoomId !== null

  function closeDialog() {
    requestIdRef.current += 1
    updateActiveDialog(null)
    setIsLoading(false)
    setErrorMessage(null)
  }

  function openCreateDialog() {
    requestIdRef.current += 1
    setCreateProjectName("")
    setCreateRoomSuffix(generateShortSuffix())
    setErrorMessage(null)
    updateActiveDialog({ type: "create", project: null })
  }

  function updateCreateProjectName(name: string) {
    setCreateProjectName(name)
    setErrorMessage(null)
  }

  function openRenameDialog(project: ProjectSidebarItem) {
    if (project.access !== "owner") {
      return
    }

    setRenameProjectName(project.name)
    requestIdRef.current += 1
    setErrorMessage(null)
    updateActiveDialog({ type: "rename", project })
  }

  function openDeleteDialog(project: ProjectSidebarItem) {
    if (project.access !== "owner") {
      return
    }

    requestIdRef.current += 1
    setErrorMessage(null)
    updateActiveDialog({ type: "delete", project })
  }

  async function createProject() {
    const name = createProjectName.trim()

    if (!canCreateProject || !createProjectRoomId || isLoading) {
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    const requestId = startRequest()

    try {
      const project = await requestProjectMutation("/api/projects", {
        method: "POST",
        body: JSON.stringify({
          id: createProjectRoomId,
          name,
        }),
      })

      if (!isActiveRequest(requestId, "create")) {
        return
      }

      closeDialog()
      router.push(getProjectWorkspacePath(project.id))
    } catch (error) {
      if (!isActiveRequest(requestId, "create")) {
        return
      }

      setErrorMessage(getErrorMessage(error, "Unable to create project."))
      setIsLoading(false)
    }
  }

  async function renameProject() {
    const project = activeDialog?.project
    const name = renameProjectName.trim()

    if (!project || name.length === 0 || isLoading) {
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    const requestId = startRequest()

    try {
      await requestProjectMutation(
        `/api/projects/${encodeURIComponent(project.id)}`,
        {
          method: "PATCH",
          body: JSON.stringify({ name }),
        }
      )

      if (!isActiveRequest(requestId, "rename", project.id)) {
        return
      }

      closeDialog()
      router.refresh()
    } catch (error) {
      if (!isActiveRequest(requestId, "rename", project.id)) {
        return
      }

      setErrorMessage(getErrorMessage(error, "Unable to rename project."))
      setIsLoading(false)
    }
  }

  async function deleteProject() {
    const project = activeDialog?.project

    if (!project || isLoading) {
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    const requestId = startRequest()

    try {
      await requestProjectDelete(
        `/api/projects/${encodeURIComponent(project.id)}`
      )

      const shouldRedirectHome =
        project.id === activeProjectId ||
        pathname === getProjectWorkspacePath(project.id)

      if (!isActiveRequest(requestId, "delete", project.id)) {
        return
      }

      closeDialog()

      if (shouldRedirectHome) {
        router.replace("/editor")
        return
      }

      router.refresh()
    } catch (error) {
      if (!isActiveRequest(requestId, "delete", project.id)) {
        return
      }

      setErrorMessage(getErrorMessage(error, "Unable to delete project."))
      setIsLoading(false)
    }
  }

  function updateActiveDialog(dialog: ActiveProjectDialog | null) {
    activeDialogRef.current = dialog
    setActiveDialog(dialog)
  }

  function startRequest() {
    requestIdRef.current += 1
    return requestIdRef.current
  }

  function isActiveRequest(
    requestId: number,
    type: ProjectDialogType,
    projectId?: string
  ) {
    const dialog = activeDialogRef.current

    return (
      requestIdRef.current === requestId &&
      dialog?.type === type &&
      (!projectId || dialog.project?.id === projectId)
    )
  }

  return {
    activeDialog,
    createProjectName,
    createProjectRoomId,
    createProjectNameError,
    canCreateProject,
    renameProjectName,
    isLoading,
    errorMessage,
    closeDialog,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    setCreateProjectName: updateCreateProjectName,
    setRenameProjectName,
    createProject,
    renameProject,
    deleteProject,
  }
}

async function requestProjectMutation(
  url: string,
  init: RequestInit
): Promise<ProjectMutationPayload["project"]> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
    },
  })
  const payload = await readJsonPayload(response)

  if (!response.ok) {
    throw new Error(readApiError(payload) ?? "Project request failed.")
  }

  if (!isProjectMutationPayload(payload)) {
    throw new Error("Project response was malformed.")
  }

  return payload.project
}

async function requestProjectDelete(url: string) {
  const response = await fetch(url, {
    method: "DELETE",
  })
  const payload = await readJsonPayload(response)

  if (!response.ok) {
    throw new Error(readApiError(payload) ?? "Project request failed.")
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

function isProjectMutationPayload(
  value: unknown
): value is ProjectMutationPayload {
  return (
    isRecord(value) &&
    isRecord(value.project) &&
    typeof value.project.id === "string"
  )
}

function getRoomSlug(name: string) {
  return slugifyProjectName(name)
    .slice(0, maxRoomSlugLength)
    .replace(/-+$/g, "")
}

function generateShortSuffix() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8)
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.length > 0) {
    return error.message
  }

  return fallback
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export type ProjectActionsController = ReturnType<typeof useProjectActions>
