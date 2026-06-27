"use client"

import { useState } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"

export function EditorLayoutPreview() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <section className="relative min-h-0 flex-1 bg-base">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--border-default)_1px,transparent_0)] bg-[length:32px_32px] opacity-40" />
        <div className="relative flex h-full min-h-[calc(100vh-3.5rem)] items-center justify-center px-6">
          <div className="max-w-md text-center">
            <p className="text-sm font-medium text-copy-muted">Editor layout</p>
            <h1 className="mt-3 text-3xl font-semibold text-copy-primary">
              Navbar, sidebar, and user menu
            </h1>
            <p className="mt-4 text-sm leading-6 text-copy-secondary">
              This route renders the reusable editor chrome components before
              the full canvas workspace is wired in.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
