import { SignUp } from "@clerk/nextjs"

import { AuthShell } from "@/components/auth/auth-shell"
import { authAppearance } from "@/lib/clerk-appearance"
import {
  appendRedirectUrl,
  editorUrl,
  readInternalRedirectUrl,
  signInPath,
  signInUrl,
  signUpPath,
} from "@/lib/auth-routes"

interface SignUpPageProps {
  searchParams: Promise<{
    redirect_url?: string | string[]
  }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { redirect_url } = await searchParams
  const redirectUrl = readInternalRedirectUrl(redirect_url)
  const fallbackRedirectUrl = redirectUrl ?? editorUrl
  const preservedSignInUrl = redirectUrl
    ? appendRedirectUrl(signInPath, redirectUrl)
    : signInUrl

  return (
    <AuthShell
      eyebrow="Collaborative architecture"
      title="Design systems at the speed of thought."
    >
      <SignUp
        appearance={authAppearance}
        fallbackRedirectUrl={fallbackRedirectUrl}
        path={signUpPath}
        routing="path"
        signInFallbackRedirectUrl={fallbackRedirectUrl}
        signInUrl={preservedSignInUrl}
      />
    </AuthShell>
  )
}
