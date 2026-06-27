"use client"

import type * as React from "react"

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface EditorDialogContentProps
  extends Omit<React.ComponentProps<typeof DialogContent>, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
}

export function EditorDialogContent({
  title,
  description,
  footer,
  children,
  className,
  ...props
}: EditorDialogContentProps) {
  return (
    <DialogContent
      className={cn(
        "gap-6 rounded-3xl border border-surface-border bg-elevated p-6 text-copy-primary sm:max-w-md",
        className
      )}
      {...props}
    >
      <DialogHeader className="gap-2">
        <DialogTitle className="text-lg font-medium leading-none text-copy-primary">
          {title}
        </DialogTitle>
        {description ? (
          <DialogDescription className="text-sm leading-6 text-copy-muted">
            {description}
          </DialogDescription>
        ) : null}
      </DialogHeader>

      {children ? <div className="text-sm text-copy-secondary">{children}</div> : null}

      {footer ? (
        <DialogFooter className="-mx-6 -mb-6 rounded-b-3xl border-t border-surface-border bg-surface p-4">
          {footer}
        </DialogFooter>
      ) : null}
    </DialogContent>
  )
}
