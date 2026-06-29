import Link from "next/link"
import { LockKeyhole } from "lucide-react"

import { Button } from "@/components/ui/button"

export function AccessDenied() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-6 text-copy-primary">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-surface-border bg-surface text-copy-secondary">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">No access</h1>
        <p className="mt-3 text-sm leading-6 text-copy-muted">
          This project does not exist, or this account does not have access to
          it.
        </p>
        <Button asChild className="mt-6">
          <Link href="/editor">Create your own project</Link>
        </Button>
      </div>
    </main>
  )
}
