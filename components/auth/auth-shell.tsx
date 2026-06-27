import type { ReactNode } from "react"
import { FileText, Network, Sparkles } from "lucide-react"

interface AuthShellProps {
  children: ReactNode
  eyebrow: string
  title: string
}

const featureLines = [
  {
    icon: Sparkles,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Network,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
]

export function AuthShell({ children, eyebrow, title }: AuthShellProps) {
  return (
    <main
      data-auth-shell
      className="grid min-h-screen bg-base font-sans text-copy-primary lg:grid-cols-2"
    >
      <section className="hidden min-h-screen border-r border-surface-border bg-surface px-12 py-10 lg:flex lg:flex-col xl:px-14 xl:py-12">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand shadow-[0_0_28px_var(--accent-primary-dim)]" />
          <div>
            <p className="text-base font-semibold leading-none text-copy-primary">
              Ghost AI
            </p>
            <p className="mt-1 text-xs text-copy-muted">{eyebrow}</p>
          </div>
        </div>

        <div className="my-auto max-w-[40rem] space-y-9">
          <div className="space-y-6">
            <h1 className="max-w-[35rem] text-[2.4rem] font-semibold leading-[1.15] text-copy-primary xl:text-[2.8rem]">
              {title}
            </h1>
            <p className="max-w-[38rem] text-base leading-7 text-copy-muted xl:text-[1.0625rem] xl:leading-8">
              Describe your architecture in plain English. Ghost AI maps it to a
              shared canvas your whole team can refine in real time.
            </p>
          </div>

          <ul className="space-y-6">
            {featureLines.map((feature) => {
              const FeatureIcon = feature.icon

              return (
                <li key={feature.title} className="flex gap-4">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand bg-accent-dim text-brand">
                    <FeatureIcon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-base font-semibold text-copy-secondary">
                      {feature.title}
                    </p>
                    <p className="max-w-[37rem] text-sm leading-6 text-copy-muted">
                      {feature.description}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <p className="text-sm text-copy-faint">
          Copyright 2026 Ghost AI. All rights reserved.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-base px-5 py-10 sm:px-8">
        <div className="flex w-full max-w-[30rem] justify-center">
          <div className="w-full">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="h-10 w-10 rounded-xl bg-brand" />
              <p className="text-lg font-semibold text-copy-primary">Ghost AI</p>
            </div>
            {children}
          </div>
        </div>
      </section>
    </main>
  )
}
