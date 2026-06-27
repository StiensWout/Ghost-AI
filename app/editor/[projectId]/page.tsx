import { notFound } from "next/navigation"

import { EditorLayoutPreview } from "@/components/editor/editor-layout-preview"
import { getProjectSidebarListsForCurrentUser } from "@/lib/project-api"

interface EditorWorkspacePageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function EditorWorkspacePage({
  params,
}: EditorWorkspacePageProps) {
  const { projectId } = await params
  const projectLists = await getProjectSidebarListsForCurrentUser()
  const canAccessProject = [
    ...projectLists.ownedProjects,
    ...projectLists.sharedProjects,
  ].some((project) => project.id === projectId)

  if (!canAccessProject) {
    notFound()
  }

  return <EditorLayoutPreview activeProjectId={projectId} {...projectLists} />
}
