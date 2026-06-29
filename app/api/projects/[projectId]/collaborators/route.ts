import prisma from "@/lib/prisma"
import {
  jsonError,
  readJsonObject,
  readRequiredCollaboratorEmail,
  requireAuthenticatedUser,
} from "@/lib/project-api"

interface ProjectCollaboratorsRouteContext {
  params: Promise<{
    projectId: string
  }>
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

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
      ownerId: true,
    },
  })

  if (!project) {
    return jsonError("Project not found", 404)
  }

  if (project.ownerId !== authResult.user.userId) {
    return jsonError("Forbidden", 403)
  }

  await prisma.projectCollaborator.upsert({
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
  })

  return Response.json({
    collaborator: {
      email,
    },
  })
}
