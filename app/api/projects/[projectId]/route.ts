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
  const body = await readJsonObject(request)

  if (!body) {
    return jsonError("Invalid request body", 400)
  }

  const name = readRequiredProjectName(body)

  if (!name) {
    return jsonError("Project name is required", 400)
  }

  const [project] = await prisma.project.updateManyAndReturn({
    where: {
      id: projectId,
      ownerId: authResult.user.userId,
    },
    data: {
      name,
    },
    select: projectSelect,
  })

  if (!project) {
    return getMissingOrForbiddenProjectResponse(projectId)
  }

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
  const deleteResult = await prisma.project.deleteMany({
    where: {
      id: projectId,
      ownerId: authResult.user.userId,
    },
  })

  if (deleteResult.count === 0) {
    return getMissingOrForbiddenProjectResponse(projectId)
  }

  return Response.json({ success: true })
}

async function getMissingOrForbiddenProjectResponse(projectId: string) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      ownerId: true,
    },
  })

  if (!project) {
    return jsonError("Project not found", 404)
  }

  return jsonError("Forbidden", 403)
}
