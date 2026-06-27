const DEFAULT_SIGN_IN_URL = "/sign-in"
const DEFAULT_SIGN_UP_URL = "/sign-up"

export const editorUrl = "/editor"
export const signInUrl =
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? DEFAULT_SIGN_IN_URL
export const signUpUrl =
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? DEFAULT_SIGN_UP_URL

function toRoutePath(routeUrl: string) {
  if (routeUrl.startsWith("/")) {
    return routeUrl
  }

  try {
    return new URL(routeUrl).pathname
  } catch {
    return `/${routeUrl.replace(/^\/+/, "")}`
  }
}

export const signInPath = toRoutePath(signInUrl)
export const signUpPath = toRoutePath(signUpUrl)
