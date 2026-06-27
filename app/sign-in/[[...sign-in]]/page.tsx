import { SignIn } from "@clerk/nextjs"

import { AuthShell } from "@/components/auth/auth-shell"
import { authAppearance } from "@/lib/clerk-appearance"
import { editorUrl, signInPath, signUpUrl } from "@/lib/auth-routes"

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="System design workspace"
      title="Design systems at the speed of thought."
    >
      <SignIn
        appearance={authAppearance}
        fallbackRedirectUrl={editorUrl}
        path={signInPath}
        routing="path"
        signUpUrl={signUpUrl}
      />
    </AuthShell>
  )
}
