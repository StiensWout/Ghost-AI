import { dark, shadcn } from "@clerk/ui/themes"

const themes = [shadcn, dark]

const variables = {
  colorBackground: "var(--bg-surface)",
  colorBorder: "var(--border-default)",
  colorDanger: "var(--state-error)",
  colorForeground: "var(--text-primary)",
  colorInput: "var(--bg-subtle)",
  colorInputForeground: "var(--text-primary)",
  colorModalBackdrop: "color-mix(in srgb, var(--bg-base), transparent 18%)",
  colorMuted: "var(--bg-subtle)",
  colorMutedForeground: "var(--text-muted)",
  colorNeutral: "var(--text-secondary)",
  colorPrimary: "var(--accent-primary)",
  colorPrimaryForeground: "var(--bg-base)",
  colorRing: "var(--accent-primary)",
  colorShadow: "var(--bg-base)",
  colorSuccess: "var(--state-success)",
  colorWarning: "var(--state-warning)",
  fontFamily: "var(--font-geist-sans)",
  fontFamilyButtons: "var(--font-geist-sans)",
  fontFamilyMono: "var(--font-geist-mono)",
  borderRadius: "var(--radius-lg)",
}

const baseElements = {
  card: {
    background: "var(--bg-surface)",
    borderColor: "var(--border-default)",
    boxShadow: "none",
    fontFamily: "var(--font-geist-sans)",
  },
  headerTitle: {
    color: "var(--text-primary)",
    fontFamily: "var(--font-geist-sans)",
    fontWeight: "700",
    letterSpacing: "0",
  },
  headerSubtitle: {
    color: "var(--text-muted)",
    fontFamily: "var(--font-geist-sans)",
  },
  formFieldLabel: {
    color: "var(--text-primary)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "0.875rem",
    fontWeight: "650",
  },
  formFieldInput: {
    height: "2.75rem",
    background: "var(--bg-subtle)",
    border: "1px solid var(--border-default)",
    borderRadius: "var(--radius-lg)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "0.9375rem",
  },
  formButtonPrimary: {
    minHeight: "2.75rem",
    height: "2.75rem",
    borderRadius: "var(--radius-lg)",
    boxShadow: "none",
    color: "var(--bg-base)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "0.9375rem",
    fontWeight: "700",
    padding: "0 1.125rem",
  },
  formButtonReset: {
    color: "var(--accent-primary)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "0.9375rem",
    fontWeight: "650",
  },
  modalContent: {
    background: "var(--bg-surface)",
    border: "1px solid var(--border-default)",
    borderRadius: "var(--radius-3xl)",
    boxShadow: "0 24px 80px color-mix(in srgb, var(--bg-base), transparent 20%)",
    maxHeight: "calc(100vh - 3rem)",
  },
  modalCloseButton: {
    color: "var(--text-secondary)",
  },
}

const userProfileElements = {
  card: {
    background: "var(--bg-surface)",
    borderColor: "var(--border-default)",
    boxShadow: "none",
  },
  badge: {
    background: "var(--bg-elevated)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "999px",
    boxShadow: "none",
    color: "var(--text-primary)",
    fontWeight: "650",
  },
  badge__primary: {
    background: "var(--accent-primary-dim)",
    border: "1px solid color-mix(in srgb, var(--accent-primary), transparent 45%)",
    color: "var(--accent-primary)",
  },
  headerTitle: {
    fontSize: "1.625rem",
    lineHeight: "1.15",
  },
  formButtonPrimary: {
    minHeight: "2.75rem",
    height: "2.75rem",
    minWidth: "5rem",
    borderRadius: "var(--radius-lg)",
    fontSize: "0.9375rem",
    padding: "0 1rem",
  },
  profileSectionPrimaryButton: {
    minHeight: "2.75rem",
    height: "2.75rem",
    borderRadius: "var(--radius-lg)",
    fontSize: "0.9375rem",
    padding: "0 1rem",
  },
}

const authElements = {
  rootBox: {
    width: "100%",
  },
  cardBox: {
    background: "var(--bg-elevated)",
    border: "1px solid var(--border-default)",
    borderRadius: "var(--radius-3xl)",
    boxShadow: "none",
    overflow: "hidden",
    width: "100%",
    maxWidth: "30rem",
  },
  card: {
    width: "100%",
    background: "var(--bg-surface)",
    border: "0",
    borderRadius: "var(--radius-3xl) var(--radius-3xl) 0 0",
    boxShadow: "none",
    fontFamily: "var(--font-geist-sans)",
    padding: "2.5rem 2.5rem 2.25rem",
  },
  header: {
    paddingBottom: "1.25rem",
    textAlign: "center",
  },
  headerTitle: {
    color: "var(--text-primary)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "1.5rem",
    fontWeight: "700",
    letterSpacing: "0",
    lineHeight: "1.18",
  },
  headerSubtitle: {
    color: "var(--text-muted)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "0.9375rem",
    lineHeight: "1.5",
  },
  main: {
    gap: "1.125rem",
  },
  socialButtonsRoot: {
    marginTop: "0",
  },
  socialButtons: {
    gap: "0.625rem",
  },
  socialButtonsBlockButton: {
    height: "3rem",
    background: "var(--bg-surface)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-lg)",
    color: "var(--text-secondary)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "0.9375rem",
    fontWeight: "600",
  },
  socialButtonsBlockButtonText: {
    color: "var(--text-secondary)",
    fontSize: "0.9375rem",
  },
  lastAuthenticationStrategyBadge: {
    background: "var(--bg-surface)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "999px",
    color: "var(--text-muted)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "0.75rem",
    fontWeight: "600",
    padding: "0.125rem 0.5rem",
  },
  dividerRow: {
    margin: "0.75rem 0",
  },
  dividerLine: {
    background: "var(--border-default)",
  },
  dividerText: {
    color: "var(--text-muted)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "0.9375rem",
  },
  form: {
    gap: "1.375rem",
  },
  formContainer: {
    gap: "1rem",
  },
  formField: {
    gap: "0.5rem",
  },
  formFieldInput: {
    height: "3rem",
    background: "var(--bg-subtle)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-lg)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "0.9375rem",
  },
  formButtonPrimary: {
    height: "3.125rem",
    borderRadius: "var(--radius-lg)",
    boxShadow: "none",
    color: "var(--bg-base)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "0.9375rem",
    fontWeight: "700",
  },
  footer: {
    background: "var(--bg-elevated)",
    borderTop: "1px solid var(--border-default)",
    borderRadius: "0",
    marginTop: "0",
    padding: "1rem 2.5rem 1.125rem",
  },
  footerActionText: {
    color: "var(--text-muted)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "0.9375rem",
  },
  footerActionLink: {
    color: "var(--accent-primary)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "0.9375rem",
    fontWeight: "700",
  },
}

export const clerkAppearance = {
  theme: themes,
  variables,
  elements: baseElements,
  userProfile: {
    elements: userProfileElements,
  },
} as const

export const authAppearance = {
  ...clerkAppearance,
  options: {
    socialButtonsPlacement: "top",
    socialButtonsVariant: "blockButton",
  },
  elements: {
    ...baseElements,
    ...authElements,
  },
} as const
