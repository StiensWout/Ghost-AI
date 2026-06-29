"use client"

interface SidebarPreferenceSettingsProps {
  isOpenByDefault: boolean
  onOpenByDefaultChange: (isOpenByDefault: boolean) => void
}

export function SidebarPreferenceSettings({
  isOpenByDefault,
  onOpenByDefaultChange,
}: SidebarPreferenceSettingsProps) {
  return (
    <div className="space-y-4 text-copy-primary">
      <div>
        <h2 className="text-lg font-semibold text-copy-primary">Workspace</h2>
      </div>

      <label className="flex min-h-16 items-center justify-between gap-4 rounded-lg border border-surface-border bg-surface px-4 py-3">
        <span className="min-w-0">
          <span className="block text-sm font-medium text-copy-primary">
            Project sidebar
          </span>
          <span className="mt-1 block text-xs leading-5 text-copy-muted">
            Open by default
          </span>
        </span>
        <input
          type="checkbox"
          aria-label="Open project sidebar by default"
          checked={isOpenByDefault}
          onChange={(event) => onOpenByDefaultChange(event.target.checked)}
          className="size-4 shrink-0 accent-brand"
        />
      </label>
    </div>
  )
}
