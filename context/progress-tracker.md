# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Foundation setup

## Current Goal

- Prepare the next feature unit from `context/feature-specs/`.

## Completed

- Project dialog follow-up fixes from current review findings.
- Current visual issue cleanup from `context/current-issues.md`.
- Project dialogs and editor home from `context/feature-specs/04-project-dialogs.md`.
- Design system and UI primitive setup from `context/feature-specs/01-design-system.md`.
- Editor chrome components from `context/feature-specs/02-editor-chrome.md`.
- Authentication wiring from `context/feature-specs/03-auth.md`.
- Authentication UI visual polish from the provided screenshot.
- `/editor` route using the existing editor navbar and project sidebar.
- Clerk auth redirects now resolve to the local custom sign-in/sign-up routes instead of the hosted Clerk Account Portal.
- Clerk auth and account UI sizing tightened so auth-page styles no longer make profile modal controls oversized.
- Authentication layout refined again to better match the original reference: dark 50/50 shell, no large accent slab, smaller Clerk auth card, tighter form controls.
- Authentication card stack refined to match the original reference more closely: narrower card, attached footer, stronger input/social borders, and less oversized header/form proportions.
- Root signed-out redirect now uses the normalized local sign-in path instead of the configurable Clerk sign-in URL.

## In Progress

- None currently.

## Next Up

- Begin the next feature unit from `context/feature-specs/`.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Allow local development and devtunnel origins for Next Server Actions in development so Clerk sign-out does not fail host/origin validation.

## Session Notes

- Completed project dialog follow-up fixes from current review findings.
- Reconciled `context/current-issues.md` with `context/progress-tracker.md` so resolved visual cleanup items are no longer listed as open.
- Aligned project create slug preview and saved slug fallback, and updated rename to keep project name and slug in sync.
- Clarified `context/feature-specs/04-project-dialogs.md` so the navbar is protected while sidebar behavior may change for the explicit sidebar requirements.
- Verified with `npx tsc --noEmit`, `npm run lint`, and `npm run build`; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`.
- Completed current visual issue cleanup from `context/current-issues.md`.
- Improved project name field contrast in create and rename project dialogs with explicit theme-token text, placeholder, caret, border, and surface classes.
- Added a subtle token-based texture layer to the editor content window without changing navbar or sidebar behavior.
- Verified with `npx tsc --noEmit`, `npm run lint`, and `npm run build`; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`.
- Confirmed the existing dev server on port 3000 responds and protects `/editor` with a signed-out redirect; T3 preview navigation still failed at the automation layer.
- Completed project dialogs and editor home from `context/feature-specs/04-project-dialogs.md`.
- Added mock owned/shared project data, owner-only sidebar rename/delete actions, and a mobile sidebar backdrop scrim.
- Added create, rename, and delete project dialogs backed by a dedicated project dialog hook with dialog, form, loading, and mock project state.
- Verified with `npx tsc --noEmit`, `npm run lint`, and `npm run build`; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`.
- Confirmed the existing dev server on port 3000 responds and protects `/editor` with a signed-out redirect; T3 preview navigation stayed on `chrome-error://chromewebdata/`, so browser interaction verification was blocked by preview access.
- Moved the editor chrome route from `/layout` to `/editor`.
- Split Clerk base appearance from auth-page appearance and reduced auth shell/button scale for a more balanced sign-in/sign-up UI.
- Refined the sign-in/sign-up shell against the original reference by removing the oversized left accent block, improving feature text contrast, and tightening Clerk card spacing.
- Refined Clerk sign-in/sign-up card proportions so the footer attaches to the main card, controls are less stretched, and social/input borders are clearer.
- Addressed review feedback by aligning the home route signed-out redirect with the local custom sign-in route used by proxy route matching.
- Configured Clerk proxy and provider redirect URLs so protected-route redirects and user sign-out return to the custom local auth pages.
- Verified signed-out `GET /`, `/editor`, and an unknown route redirect to local `/sign-in` instead of the Clerk hosted Account Portal.
- Updated the editor navbar layout so Clerk's `UserButton` aligns to the far right.
- Added development-only Server Actions allowed origins for localhost and devtunnel host/origin mismatches during Clerk sign-out.
- Verified the `/editor` route with `npx tsc --noEmit`, `npm run lint`, `npm run build`, and the production route table.
- Initially added `/layout` with the existing `EditorNavbar` and `ProjectSidebar`; this was later moved to `/editor`.
- Completed authentication UI polish from the provided screenshot.
- Started `/layout` route implementation using the existing editor navbar and project sidebar.
- Started authentication UI polish from the provided screenshot.
- Completed authentication wiring from `context/feature-specs/03-auth.md`.
- Installed `@clerk/ui`, wrapped the root layout in `ClerkProvider`, added protected-by-default `proxy.ts`, and created Clerk sign-in/sign-up pages.
- Updated `/` to redirect by authentication state and added Clerk `UserButton` to the editor navbar.
- Verified with `npx tsc --noEmit`, `npm run lint`, and `npm run build`; lint reports one warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`.
- Checked auth routes on the running dev server: signed-out `GET /` redirects to Clerk sign-in, `/editor` is protected, and `/sign-in` plus `/sign-up` remain public.
- Started implementation of `context/feature-specs/03-auth.md`.
- Addressed editor chrome review follow-ups for nullish React node rendering and closed sidebar inertness.
- Started implementation of `context/feature-specs/02-editor-chrome.md`.
- Added `EditorNavbar`, `ProjectSidebar`, and a reusable editor dialog content pattern.
- Verified editor chrome with `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
- Started implementation of `context/feature-specs/01-design-system.md`.
- Initialized shadcn/ui with the Nova Radix preset and added Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea primitives.
- Replaced the generated light/dark CSS variables with the documented Ghost AI dark-only token map and enabled the root `dark` class for shadcn variants.
- Replaced the starter home page with a minimal token-based Ghost AI page.
- Verified with `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
