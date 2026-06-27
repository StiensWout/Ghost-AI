import prisma from "@/lib/prisma"
import {
  jsonError,
  projectSelect,
  readCreateProjectName,
  readJsonObject,
  readOptionalProjectId,
  requireAuthenticatedUser,
  serializeProject,
} from "@/lib/project-api"

export async function GET() {
  const authResult = await requireAuthenticatedUser()

  if (!authResult.ok) {
    return authResult.response
  }

  const projects = await prisma.project.findMany({
    where: {
      ownerId: authResult.user.userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: projectSelect,
  })

  return Response.json({
    projects: projects.map(serializeProject),
  })
}

export async function POST(request: Request) {
  const authResult = await requireAuthenticatedUser()

  if (!authResult.ok) {
    return authResult.response
  }

  const body = await readJsonObject(request)

  if (!body) {
    return jsonError("Invalid request body", 400)
  }

  const name = readCreateProjectName(body)

  if (!name) {
    return jsonError("Project name must be a string", 400)
  }

  const projectId = readOptionalProjectId(body)

  if (projectId === null) {
    return jsonError("Project ID must be a slug-style string", 400)
  }

  if (projectId) {
    const existingProject = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
      },
    })

    if (existingProject) {
      return jsonError("Project ID already exists", 409)
    }
  }

  const project = await prisma.project.create({
    data: {
      ...(projectId ? { id: projectId } : {}),
      ownerId: authResult.user.userId,
      name,
    },
    select: projectSelect,
  })

  return Response.json(
    {
      project: serializeProject(project),
    },
    { status: 201 }
  )
}
