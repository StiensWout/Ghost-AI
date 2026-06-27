import prisma from "@/lib/prisma"
import {
  jsonError,
  projectSelect,
  readJsonObject,
  readRequiredProjectName,
  requireAuthenticatedUser,
  serializeProject,
} from "@/lib/project-api"

interface ProjectRouteContext {
  params: Promise<{
    projectId: string
  }>
}

export async function PATCH(request: Request, context: ProjectRouteContext) {
  const authResult = await requireAuthenticatedUser()

  if (!authResult.ok) {
    return authResult.response
  }

  const { projectId } = await context.params
  const accessResult = await requireProjectOwner(projectId, authResult.user.userId)

  if (!accessResult.ok) {
    return accessResult.response
  }

  const body = await readJsonObject(request)

  if (!body) {
    return jsonError("Invalid request body", 400)
  }

  const name = readRequiredProjectName(body)

  if (!name) {
    return jsonError("Project name is required", 400)
  }

  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      name,
    },
    select: projectSelect,
  })

  return Response.json({
    project: serializeProject(project),
  })
}

export async function DELETE(_request: Request, context: ProjectRouteContext) {
  const authResult = await requireAuthenticatedUser()

  if (!authResult.ok) {
    return authResult.response
  }

  const { projectId } = await context.params
  const accessResult = await requireProjectOwner(projectId, authResult.user.userId)

  if (!accessResult.ok) {
    return accessResult.response
  }

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  })

  return Response.json({ success: true })
}

type OwnerCheckResult =
  | {
      ok: true
    }
  | {
      ok: false
      response: Response
    }

async function requireProjectOwner(
  projectId: string,
  userId: string
): Promise<OwnerCheckResult> {
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
      ok: false,
      response: jsonError("Project not found", 404),
    }
  }

  if (project.ownerId !== userId) {
    return {
      ok: false,
      response: jsonError("Forbidden", 403),
    }
  }

  return { ok: true }
}
