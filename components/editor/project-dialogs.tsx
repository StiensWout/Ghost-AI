"use client"

import type { FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { EditorDialogContent } from "@/components/editor/editor-dialog"
import type { ProjectActionsController } from "@/hooks/use-project-actions"

const projectNameInputClassName =
  "border-surface-border-subtle bg-surface text-copy-primary caret-brand placeholder:text-copy-muted"

interface ProjectDialogsProps {
  controller: ProjectActionsController
}

export function ProjectDialogs({ controller }: ProjectDialogsProps) {
  const { activeDialog, closeDialog } = controller
  const isOpen = activeDialog !== null

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog()
        }
      }}
    >
      {activeDialog?.type === "create" ? (
        <CreateProjectDialog controller={controller} />
      ) : null}
      {activeDialog?.type === "rename" && activeDialog.project ? (
        <RenameProjectDialog controller={controller} />
      ) : null}
      {activeDialog?.type === "delete" && activeDialog.project ? (
        <DeleteProjectDialog controller={controller} />
      ) : null}
    </Dialog>
  )
}

function CreateProjectDialog({ controller }: ProjectDialogsProps) {
  const {
    createProjectName,
    createProjectRoomId,
    createProjectNameError,
    canCreateProject,
    isLoading,
    errorMessage,
    closeDialog,
    setCreateProjectName,
    createProject,
  } = controller

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createProject()
  }

  return (
    <EditorDialogContent
      title="Create project"
      description="Start a new architecture workspace."
      footer={
        <>
          <Button type="button" variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-project-form"
            disabled={!canCreateProject || isLoading}
          >
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </>
      }
    >
      <form id="create-project-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="create-project-name"
            className="text-sm font-medium text-copy-primary"
          >
            Project name
          </label>
          <Input
            id="create-project-name"
            value={createProjectName}
            onChange={(event) => setCreateProjectName(event.target.value)}
            placeholder="Customer data platform"
            className={projectNameInputClassName}
          />
        </div>

        <div className="rounded-xl border border-surface-border bg-subtle px-3 py-2">
          <p className="text-xs font-medium uppercase text-copy-faint">
            Room ID preview
          </p>
          <p className="mt-1 font-mono text-sm text-brand">
            {createProjectRoomId ? `/${createProjectRoomId}` : "No room ID"}
          </p>
        </div>

        <ProjectDialogError message={createProjectNameError ?? errorMessage} />
      </form>
    </EditorDialogContent>
  )
}

function RenameProjectDialog({ controller }: ProjectDialogsProps) {
  const {
    activeDialog,
    renameProjectName,
    isLoading,
    errorMessage,
    closeDialog,
    setRenameProjectName,
    renameProject,
  } = controller
  const project = activeDialog?.project

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    renameProject()
  }

  if (!project) {
    return null
  }

  return (
    <EditorDialogContent
      title="Rename project"
      description={
        <>
          Current project:{" "}
          <span className="font-medium text-copy-secondary">{project.name}</span>
        </>
      }
      footer={
        <>
          <Button type="button" variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="rename-project-form"
            disabled={renameProjectName.trim().length === 0 || isLoading}
          >
            {isLoading ? "Renaming..." : "Rename Project"}
          </Button>
        </>
      }
    >
      <form id="rename-project-form" onSubmit={handleSubmit} className="space-y-2">
        <label
          htmlFor="rename-project-name"
          className="text-sm font-medium text-copy-primary"
        >
          Project name
        </label>
        <Input
          id="rename-project-name"
          value={renameProjectName}
          onChange={(event) => setRenameProjectName(event.target.value)}
          className={projectNameInputClassName}
          autoFocus
        />
        <ProjectDialogError message={errorMessage} />
      </form>
    </EditorDialogContent>
  )
}

function DeleteProjectDialog({ controller }: ProjectDialogsProps) {
  const { activeDialog, isLoading, errorMessage, closeDialog, deleteProject } =
    controller
  const project = activeDialog?.project

  if (!project) {
    return null
  }

  return (
    <EditorDialogContent
      title="Delete project"
      description="This action cannot be undone."
      footer={
        <>
          <Button type="button" variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={deleteProject}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Project"}
          </Button>
        </>
      }
    >
      <p>
        Delete{" "}
        <span className="font-medium text-copy-primary">{project.name}</span>?
      </p>
      <ProjectDialogError message={errorMessage} />
    </EditorDialogContent>
  )
}

function ProjectDialogError({ message }: { message: string | null }) {
  if (!message) {
    return null
  }

  return (
    <p role="alert" className="text-sm text-error">
      {message}
    </p>
  )
}
