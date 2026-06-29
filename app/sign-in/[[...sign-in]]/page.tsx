import { SignIn } from "@clerk/nextjs"

import { AuthShell } from "@/components/auth/auth-shell"
import { authAppearance } from "@/lib/clerk-appearance"
import {
  appendRedirectUrl,
  editorUrl,
  readInternalRedirectUrl,
  signInPath,
  signUpPath,
  signUpUrl,
} from "@/lib/auth-routes"

interface SignInPageProps {
  searchParams: Promise<{
    redirect_url?: string | string[]
  }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { redirect_url } = await searchParams
  const redirectUrl = readInternalRedirectUrl(redirect_url)
  const fallbackRedirectUrl = redirectUrl ?? editorUrl
  const preservedSignUpUrl = redirectUrl
    ? appendRedirectUrl(signUpPath, redirectUrl)
    : signUpUrl

  return (
    <AuthShell
      eyebrow="System design workspace"
      title="Design systems at the speed of thought."
    >
      <SignIn
        appearance={authAppearance}
        fallbackRedirectUrl={fallbackRedirectUrl}
        path={signInPath}
        routing="path"
        signUpFallbackRedirectUrl={fallbackRedirectUrl}
        signUpUrl={preservedSignUpUrl}
      />
    </AuthShell>
  )
}
