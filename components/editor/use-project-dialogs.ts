"use client"

import { useMemo, useState } from "react"

export type ProjectAccess = "owner" | "collaborator"

export interface MockProject {
  id: string
  name: string
  slug: string
  access: ProjectAccess
  updatedAtLabel: string
}

export type ProjectDialogType = "create" | "rename" | "delete"

interface ActiveProjectDialog {
  type: ProjectDialogType
  project: MockProject | null
}

const fallbackProjectSlug = "project-slug"

const initialProjects: MockProject[] = [
  {
    id: "project-payments-platform",
    name: "Payments Platform",
    slug: "payments-platform",
    access: "owner",
    updatedAtLabel: "Updated 2h ago",
  },
  {
    id: "project-realtime-analytics",
    name: "Realtime Analytics",
    slug: "realtime-analytics",
    access: "owner",
    updatedAtLabel: "Updated yesterday",
  },
  {
    id: "project-marketplace-search",
    name: "Marketplace Search",
    slug: "marketplace-search",
    access: "collaborator",
    updatedAtLabel: "Shared 3d ago",
  },
]

export function slugifyProjectName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function getProjectSlug(name: string) {
  return slugifyProjectName(name) || fallbackProjectSlug
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<MockProject[]>(initialProjects)
  const [activeDialog, setActiveDialog] = useState<ActiveProjectDialog | null>(
    null
  )
  const [createProjectName, setCreateProjectName] = useState("")
  const [renameProjectName, setRenameProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const createProjectSlug = useMemo(() => {
    return getProjectSlug(createProjectName)
  }, [createProjectName])

  const ownedProjects = useMemo(() => {
    return projects.filter((project) => project.access === "owner")
  }, [projects])

  const sharedProjects = useMemo(() => {
    return projects.filter((project) => project.access === "collaborator")
  }, [projects])

  function closeDialog() {
    setActiveDialog(null)
    setIsLoading(false)
  }

  function openCreateDialog() {
    setCreateProjectName("")
    setActiveDialog({ type: "create", project: null })
  }

  function openRenameDialog(project: MockProject) {
    if (project.access !== "owner") {
      return
    }

    setRenameProjectName(project.name)
    setActiveDialog({ type: "rename", project })
  }

  function openDeleteDialog(project: MockProject) {
    if (project.access !== "owner") {
      return
    }

    setActiveDialog({ type: "delete", project })
  }

  function createProject() {
    const name = createProjectName.trim()

    if (name.length === 0 || isLoading) {
      return
    }

    setIsLoading(true)
    setProjects((currentProjects) => [
      {
        id: `project-${crypto.randomUUID()}`,
        name,
        slug: getProjectSlug(name),
        access: "owner",
        updatedAtLabel: "Updated just now",
      },
      ...currentProjects,
    ])
    closeDialog()
  }

  function renameProject() {
    const project = activeDialog?.project
    const name = renameProjectName.trim()

    if (!project || name.length === 0 || isLoading) {
      return
    }

    setIsLoading(true)
    setProjects((currentProjects) =>
      currentProjects.map((currentProject) =>
        currentProject.id === project.id
          ? {
              ...currentProject,
              name,
              slug: getProjectSlug(name),
              updatedAtLabel: "Updated just now",
            }
          : currentProject
      )
    )
    closeDialog()
  }

  function deleteProject() {
    const project = activeDialog?.project

    if (!project || isLoading) {
      return
    }

    setIsLoading(true)
    setProjects((currentProjects) =>
      currentProjects.filter((currentProject) => currentProject.id !== project.id)
    )
    closeDialog()
  }

  return {
    projects,
    ownedProjects,
    sharedProjects,
    activeDialog,
    createProjectName,
    createProjectSlug,
    renameProjectName,
    isLoading,
    closeDialog,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    setCreateProjectName,
    setRenameProjectName,
    createProject,
    renameProject,
    deleteProject,
  }
}

export type ProjectDialogsController = ReturnType<typeof useProjectDialogs>
