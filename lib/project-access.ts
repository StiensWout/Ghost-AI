import "server-only"

import { auth, currentUser } from "@clerk/nextjs/server"

import { Prisma } from "@/app/generated/prisma/client"
import prisma from "@/lib/prisma"
import {
  normalizeCollaboratorEmail,
  projectSelect,
  type SelectedProject,
} from "@/lib/project-api"
import type { ProjectAccess } from "@/types/projects"

export interface CurrentProjectIdentity {
  userId: string
  primaryEmail: string | null
}

export interface ProjectAccessResult {
  access: ProjectAccess
  project: SelectedProject
}

interface ProjectAccessInput {
  identity: CurrentProjectIdentity
  roomId: string
}

export async function getCurrentProjectIdentity(): Promise<CurrentProjectIdentity | null> {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    return null
  }

  const user = await currentUser()
  const primaryEmail = user?.primaryEmailAddress?.emailAddress

  return {
    userId,
    primaryEmail: primaryEmail
      ? normalizeCollaboratorEmail(primaryEmail)
      : null,
  }
}

export async function getProjectAccessByOwnerOrCollaborator({
  identity,
  roomId,
}: ProjectAccessInput): Promise<ProjectAccessResult | null> {
  const accessFilters: Prisma.ProjectWhereInput[] = [
    {
      ownerId: identity.userId,
    },
  ]

  if (identity.primaryEmail) {
    accessFilters.push({
      collaborators: {
        some: {
          email: identity.primaryEmail,
        },
      },
    })
  }

  const project = await prisma.project.findFirst({
    where: {
      id: roomId,
      OR: accessFilters,
    },
    select: projectSelect,
  })

  if (!project) {
    return null
  }

  return {
    access: project.ownerId === identity.userId ? "owner" : "collaborator",
    project,
  }
}
