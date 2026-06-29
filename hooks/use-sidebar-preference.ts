"use client"

import { useEffect, useState } from "react"

const sidebarDefaultOpenKey = "ghost-ai:project-sidebar-default-open"
const collapseAfterProjectOpenKey =
  "ghost-ai:project-sidebar-collapse-after-project-open"

interface UseSidebarPreferenceOptions {
  defaultOpen?: boolean
}

export function useSidebarPreference({
  defaultOpen = false,
}: UseSidebarPreferenceOptions = {}) {
  const [isSidebarOpenByDefault, setIsSidebarOpenByDefault] =
    useState(defaultOpen)
  const [isSidebarOpen, setIsSidebarOpen] = useState(defaultOpen)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsSidebarOpenByDefault(readSavedSidebarDefault(defaultOpen))
      setIsSidebarOpen(readInitialSidebarOpen(defaultOpen))
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [defaultOpen])

  function updateSidebarDefaultOpen(nextDefaultOpen: boolean) {
    localStorage.setItem(sidebarDefaultOpenKey, String(nextDefaultOpen))
    setIsSidebarOpenByDefault(nextDefaultOpen)
  }

  return {
    isSidebarOpen,
    isSidebarOpenByDefault,
    setIsSidebarOpen,
    updateSidebarDefaultOpen,
  }
}

export function collapseSidebarAfterProjectOpen() {
  if (typeof window === "undefined") {
    return
  }

  sessionStorage.setItem(collapseAfterProjectOpenKey, "true")
}

function readSavedSidebarDefault(fallback: boolean) {
  if (typeof window === "undefined") {
    return fallback
  }

  const savedValue = localStorage.getItem(sidebarDefaultOpenKey)

  if (savedValue === "true") {
    return true
  }

  if (savedValue === "false") {
    return false
  }

  return fallback
}

function readInitialSidebarOpen(fallback: boolean) {
  if (typeof window === "undefined") {
    return fallback
  }

  const shouldCollapseAfterProjectOpen =
    sessionStorage.getItem(collapseAfterProjectOpenKey) === "true"
  sessionStorage.removeItem(collapseAfterProjectOpenKey)

  if (shouldCollapseAfterProjectOpen) {
    return false
  }

  return readSavedSidebarDefault(fallback)
}
