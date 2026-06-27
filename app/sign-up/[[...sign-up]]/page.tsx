import { SignUp } from "@clerk/nextjs"

import { AuthShell } from "@/components/auth/auth-shell"
import { authAppearance } from "@/lib/clerk-appearance"
import { editorUrl, signInUrl, signUpPath } from "@/lib/auth-routes"

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Collaborative architecture"
      title="Design systems at the speed of thought."
    >
      <SignUp
        appearance={authAppearance}
        fallbackRedirectUrl={editorUrl}
        path={signUpPath}
        routing="path"
        signInUrl={signInUrl}
      />
    </AuthShell>
  )
}
