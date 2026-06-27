import { EditorLayoutPreview } from "@/components/editor/editor-layout-preview"
import { getProjectSidebarListsForCurrentUser } from "@/lib/project-api"

export default async function EditorPage() {
  const projectLists = await getProjectSidebarListsForCurrentUser()

  return <EditorLayoutPreview {...projectLists} />
}
