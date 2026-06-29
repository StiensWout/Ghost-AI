import type { ProjectStatus } from "@/app/generated/prisma/enums"

export type ProjectAccess = "owner" | "collaborator"

export interface ProjectApiResource {
  id: string
  ownerId: string
  name: string
  description: string | null
  status: ProjectStatus
  canvasJsonPath: string | null
  createdAt: string
  updatedAt: string
}

export interface ProjectSidebarItem {
  id: string
  name: string
  roomId: string
  access: ProjectAccess
  updatedAtLabel: string
}

export interface ProjectSidebarLists {
  ownedProjects: ProjectSidebarItem[]
  sharedProjects: ProjectSidebarItem[]
}

export interface ProjectCollaboratorResource {
  email: string
  displayName: string | null
  avatarUrl: string | null
  createdAt: string
}

export interface ProjectCollaboratorsResponse {
  collaborators: ProjectCollaboratorResource[]
  canManage: boolean
}

export interface ProjectCollaboratorResponse {
  collaborator: ProjectCollaboratorResource
}
