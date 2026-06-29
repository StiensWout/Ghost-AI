import { redirect } from "next/navigation"

import { AccessDenied } from "@/components/editor/access-denied"
import { EditorWorkspaceShell } from "@/components/editor/editor-workspace-shell"
import { appendRedirectUrl, signInPath } from "@/lib/auth-routes"
import {
  getProjectAccessByOwnerOrCollaborator,
  getCurrentProjectIdentity,
} from "@/lib/project-access"
import {
  getProjectSidebarListsForCurrentUser,
  serializeProjectSidebarItem,
} from "@/lib/project-api"
import type { ProjectSidebarItem, ProjectSidebarLists } from "@/types/projects"

interface EditorWorkspacePageProps {
  params: Promise<{
    roomId: string
  }>
}

export default async function EditorWorkspacePage({
  params,
}: EditorWorkspacePageProps) {
  const identity = await getCurrentProjectIdentity()
  const { roomId } = await params
  const workspacePath = `/editor/${encodeURIComponent(roomId)}`

  if (!identity) {
    redirect(appendRedirectUrl(signInPath, workspacePath))
  }

  const projectAccess = await getProjectAccessByOwnerOrCollaborator({
    identity,
    roomId,
  })

  if (!projectAccess) {
    return <AccessDenied />
  }

  const projectLists = await getProjectSidebarListsForCurrentUser()
  const currentProject =
    findSidebarProject(projectLists, projectAccess.project.id) ??
    serializeProjectSidebarItem(projectAccess.project, projectAccess.access)

  return (
    <EditorWorkspaceShell
      currentProject={currentProject}
      ownedProjects={projectLists.ownedProjects}
      sharedProjects={projectLists.sharedProjects}
    />
  )
}

function findSidebarProject(
  projectLists: ProjectSidebarLists,
  projectId: string
): ProjectSidebarItem | null {
  return (
    [...projectLists.ownedProjects, ...projectLists.sharedProjects].find(
      (project) => project.id === projectId
    ) ?? null
  )
}
