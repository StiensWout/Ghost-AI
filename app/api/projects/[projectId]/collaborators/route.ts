import prisma from "@/lib/prisma"
import {
  getClerkUserIdsByEmail,
  serializeProjectCollaborators,
} from "@/lib/project-collaborators"
import { getCurrentProjectIdentity } from "@/lib/project-access"
import { revokeLiveblocksRoomAccess } from "@/lib/liveblocks"
import {
  jsonError,
  normalizeCollaboratorEmail,
  readJsonObject,
  readRequiredCollaboratorEmail,
  requireAuthenticatedUser,
} from "@/lib/project-api"

interface ProjectCollaboratorsRouteContext {
  params: Promise<{
    projectId: string
  }>
}

interface ProjectCollaboratorRecord {
  email: string
  createdAt: Date
}

interface ProjectCollaboratorsAccess {
  canManage: boolean
  collaborators: ProjectCollaboratorRecord[]
}

export async function GET(
  _request: Request,
  context: ProjectCollaboratorsRouteContext
) {
  const identity = await getCurrentProjectIdentity()

  if (!identity) {
    return jsonError("Unauthorized", 401)
  }

  const { projectId } = await context.params
  const access = await getProjectCollaboratorsAccess({
    projectId,
    userId: identity.userId,
    primaryEmail: identity.primaryEmail,
  })

  if (!access.ok) {
    return access.response
  }

  return Response.json({
    collaborators: await serializeProjectCollaborators(
      access.project.collaborators
    ),
    canManage: access.project.canManage,
  })
}

export async function POST(
  request: Request,
  context: ProjectCollaboratorsRouteContext
) {
  const authResult = await requireAuthenticatedUser()

  if (!authResult.ok) {
    return authResult.response
  }

  const { projectId } = await context.params
  const body = await readJsonObject(request)

  if (!body) {
    return jsonError("Invalid request body", 400)
  }

  const email = readRequiredCollaboratorEmail(body)

  if (!email) {
    return jsonError("A valid email address is required", 400)
  }

  const ownerAccess = await requireProjectOwner({
    projectId,
    userId: authResult.user.userId,
  })

  if (!ownerAccess.ok) {
    return ownerAccess.response
  }

  const collaborator = await prisma.projectCollaborator.upsert({
    where: {
      projectId_email: {
        projectId,
        email,
      },
    },
    update: {},
    create: {
      projectId,
      email,
    },
    select: {
      email: true,
      createdAt: true,
    },
  })
  const [serializedCollaborator] = await serializeProjectCollaborators([
    collaborator,
  ])

  return Response.json({
    collaborator: serializedCollaborator,
  })
}

export async function DELETE(
  request: Request,
  context: ProjectCollaboratorsRouteContext
) {
  const authResult = await requireAuthenticatedUser()

  if (!authResult.ok) {
    return authResult.response
  }

  const { projectId } = await context.params
  const body = await readJsonObject(request)

  if (!body) {
    return jsonError("Invalid request body", 400)
  }

  const email = readRequiredCollaboratorEmail(body)

  if (!email) {
    return jsonError("A valid email address is required", 400)
  }

  const ownerAccess = await requireProjectOwner({
    projectId,
    userId: authResult.user.userId,
  })

  if (!ownerAccess.ok) {
    return ownerAccess.response
  }

  const collaborator = await prisma.projectCollaborator.findUnique({
    where: {
      projectId_email: {
        projectId,
        email,
      },
    },
    select: {
      email: true,
    },
  })

  if (!collaborator) {
    return jsonError("Collaborator not found", 404)
  }

  let revokedUserIds: string[]

  try {
    revokedUserIds = await getClerkUserIdsByEmail(collaborator.email)
  } catch {
    return jsonError("Unable to resolve collaborator access", 503)
  }

  try {
    await revokeLiveblocksRoomAccess({
      roomId: projectId,
      userIds: revokedUserIds,
    })
  } catch {
    return jsonError("Unable to revoke collaborator room access", 502)
  }

  const deleteResult = await prisma.projectCollaborator.deleteMany({
    where: {
      projectId,
      email: collaborator.email,
    },
  })

  if (deleteResult.count === 0) {
    return jsonError("Collaborator not found", 404)
  }

  return Response.json({
    success: true,
    email,
  })
}

async function requireProjectOwner({
  projectId,
  userId,
}: {
  projectId: string
  userId: string
}) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      ownerId: true,
    },
  })

  if (!project) {
    return {
      ok: false as const,
      response: jsonError("Project not found", 404),
    }
  }

  if (project.ownerId !== userId) {
    return {
      ok: false as const,
      response: jsonError("Forbidden", 403),
    }
  }

  return {
    ok: true as const,
  }
}

async function getProjectCollaboratorsAccess({
  projectId,
  userId,
  primaryEmail,
}: {
  projectId: string
  userId: string
  primaryEmail: string | null
}) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      ownerId: true,
      collaborators: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          email: true,
          createdAt: true,
        },
      },
    },
  })

  if (!project) {
    return {
      ok: false as const,
      response: jsonError("Project not found", 404),
    }
  }

  const canManage = project.ownerId === userId
  const canView =
    canManage ||
    (primaryEmail
      ? project.collaborators.some(
          (collaborator) =>
            normalizeCollaboratorEmail(collaborator.email) === primaryEmail
        )
      : false)

  if (!canView) {
    return {
      ok: false as const,
      response: jsonError("Forbidden", 403),
    }
  }

  return {
    ok: true as const,
    project: {
      canManage,
      collaborators: project.collaborators,
    } satisfies ProjectCollaboratorsAccess,
  }
}
