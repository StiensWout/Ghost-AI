import "server-only"

import { auth, currentUser } from "@clerk/nextjs/server"

import { Prisma } from "@/app/generated/prisma/client"
import prisma from "@/lib/prisma"
import type {
  ProjectAccess,
  ProjectApiResource,
  ProjectSidebarItem,
  ProjectSidebarLists,
} from "@/types/projects"

export const DEFAULT_PROJECT_NAME = "Untitled Project"

export const projectSelect = {
  id: true,
  ownerId: true,
  name: true,
  description: true,
  status: true,
  canvasJsonPath: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProjectSelect

export type SelectedProject = Prisma.ProjectGetPayload<{
  select: typeof projectSelect
}>

interface AuthenticatedUser {
  userId: string
}

type AuthResult =
  | {
      ok: true
      user: AuthenticatedUser
    }
  | {
      ok: false
      response: Response
    }

export async function requireAuthenticatedUser(): Promise<AuthResult> {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    return {
      ok: false,
      response: jsonError("Unauthorized", 401),
    }
  }

  return {
    ok: true,
    user: { userId },
  }
}

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

export function isPrismaKnownRequestError(error: unknown, code: string) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === code
  )
}

export function serializeProject(project: SelectedProject): ProjectApiResource {
  return {
    id: project.id,
    ownerId: project.ownerId,
    name: project.name,
    description: project.description,
    status: project.status,
    canvasJsonPath: project.canvasJsonPath,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }
}

export async function getProjectSidebarListsForCurrentUser(): Promise<ProjectSidebarLists> {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    return {
      ownedProjects: [],
      sharedProjects: [],
    }
  }

  const user = await currentUser()
  const emailAddress = user?.primaryEmailAddress?.emailAddress
  const collaboratorEmail = emailAddress
    ? normalizeCollaboratorEmail(emailAddress)
    : null

  const ownedProjectsRequest = prisma.project.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: projectSelect,
  })

  const sharedProjectsRequest = collaboratorEmail
    ? prisma.project.findMany({
        where: {
          ownerId: {
            not: userId,
          },
          collaborators: {
            some: {
              email: collaboratorEmail,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        select: projectSelect,
      })
    : Promise.resolve([])

  const [ownedProjects, sharedProjects] = await Promise.all([
    ownedProjectsRequest,
    sharedProjectsRequest,
  ])

  return {
    ownedProjects: ownedProjects.map((project) =>
      serializeProjectSidebarItem(project, "owner")
    ),
    sharedProjects: sharedProjects.map((project) =>
      serializeProjectSidebarItem(project, "collaborator")
    ),
  }
}

export function normalizeCollaboratorEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function readJsonObject(request: Request) {
  const rawBody = await request.text()

  if (rawBody.trim().length === 0) {
    return {}
  }

  try {
    const body = JSON.parse(rawBody) as unknown

    if (!isRecord(body)) {
      return null
    }

    return body
  } catch {
    return null
  }
}

export function readCreateProjectName(body: Record<string, unknown>) {
  const rawName = body.name

  if (rawName === undefined || rawName === null) {
    return DEFAULT_PROJECT_NAME
  }

  if (typeof rawName !== "string") {
    return null
  }

  return rawName.trim() || DEFAULT_PROJECT_NAME
}

export function readOptionalProjectId(body: Record<string, unknown>) {
  const rawId = body.id

  if (rawId === undefined || rawId === null) {
    return undefined
  }

  if (typeof rawId !== "string") {
    return null
  }

  const id = rawId.trim()

  if (!isValidProjectId(id)) {
    return null
  }

  return id
}

export function readRequiredProjectName(body: Record<string, unknown>) {
  const rawName = body.name

  if (typeof rawName !== "string") {
    return null
  }

  const name = rawName.trim()

  if (name.length === 0) {
    return null
  }

  return name
}

export function readRequiredCollaboratorEmail(body: Record<string, unknown>) {
  const rawEmail = body.email

  if (typeof rawEmail !== "string") {
    return null
  }

  const email = normalizeCollaboratorEmail(rawEmail)

  if (!isValidEmail(email)) {
    return null
  }

  return email
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function serializeProjectSidebarItem(
  project: SelectedProject,
  access: ProjectAccess
): ProjectSidebarItem {
  return {
    id: project.id,
    name: project.name,
    roomId: project.id,
    access,
    updatedAtLabel: formatUpdatedAt(project.updatedAt, access),
  }
}

function formatUpdatedAt(updatedAt: Date, access: ProjectAccess) {
  const prefix = access === "owner" ? "Updated" : "Shared"
  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - updatedAt.getTime()) / 1000)
  )

  if (elapsedSeconds < 60) {
    return `${prefix} just now`
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60)

  if (elapsedMinutes < 60) {
    return `${prefix} ${elapsedMinutes}m ago`
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60)

  if (elapsedHours < 24) {
    return `${prefix} ${elapsedHours}h ago`
  }

  const elapsedDays = Math.floor(elapsedHours / 24)

  if (elapsedDays === 1) {
    return `${prefix} yesterday`
  }

  return `${prefix} ${elapsedDays}d ago`
}

function isValidProjectId(id: string) {
  return (
    id.length >= 3 &&
    id.length <= 96 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)
  )
}

function isValidEmail(email: string) {
  return (
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  )
}
