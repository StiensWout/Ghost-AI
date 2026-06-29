# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Foundation setup

## Current Goal

- Prepare the next feature unit from `context/feature-specs/`.

## Completed

- Current issue verification cleanup for already-resolved project review findings.
- Project API review follow-up fixes and current user-settings contrast cleanup.
- Create-project room ID validation from `context/current-issues.md`.
- Editor home real project API wiring from `context/feature-specs/07-wire-editor-home.md`.
- Backend project API routes from `context/feature-specs/06-project-apis.md`.
- Prisma schema and data layer from `context/feature-specs/05-prisma.md`.
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

- `/api/projects` remains handler-protected instead of middleware-blocked so unauthenticated API requests return JSON `401` responses.
- Allow local development and devtunnel origins for Next Server Actions in development so Clerk sign-out does not fail host/origin validation.

## Session Notes

- Completed current issue verification cleanup for already-resolved project review findings.
- Verified the pasted project API, Prisma, dialog, and sidebar findings against current code; each item was already addressed in the existing implementation, so no code changes were needed.
- Restored `context/current-issues.md` to the real open sidebar-default setting and moved the stale pasted review list into a concise resolved verification note.
- Verified with `DOTENV_CONFIG_PATH=.env.local npx prisma validate`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `git diff --check`; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`.
- Completed project API review follow-up fixes and current user-settings contrast cleanup.
- Folded project owner checks into `PATCH` and `DELETE` mutations, mapped missing or forbidden write results back to `404` or `403`, and mapped duplicate project ID create races to the existing `409` response.
- Normalized collaborator email access checks, moved collaborator email storage to `CITEXT` with lowercase enforcement, and replaced the project created-at index with the owner plus `updatedAt DESC` listing index.
- Guarded create, rename, and delete project dialog completions against dismissed or replaced dialogs, disabled dismiss buttons while loading, and reset the project sidebar tab from the active shared project state.
- Fixed Clerk user settings badge contrast for "This device" and "Primary", and corrected the sidebar wording in `context/current-issues.md` while leaving the default-sidebar setting open.
- Verified with `DOTENV_CONFIG_PATH=.env.local npx prisma format`, `DOTENV_CONFIG_PATH=.env.local npx prisma validate`, `DOTENV_CONFIG_PATH=.env.local npx prisma generate`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `git diff --check`; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`.
- Completed create-project room ID validation from `context/current-issues.md`.
- Updated the create-project flow so non-sluggable names such as `!!` do not generate a fallback room ID, disable submission, and show a validation message.
- Verified with `npx tsc --noEmit`, `npm run build`, and `npm run lint`; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`.
- Completed editor home real project API wiring from `context/feature-specs/07-wire-editor-home.md`.
- Added server-side owned/shared project list loading for `/editor` and `/editor/[projectId]`, with sidebar data derived from the real project records.
- Added `hooks/use-project-actions.ts` for create, rename, and delete dialog state plus API-backed mutations.
- Create now generates a slug-plus-suffix room ID, submits it as the project ID, and navigates to `/editor/[projectId]` so the project ID and Liveblocks room ID stay aligned.
- Rename refreshes the current route after a successful `PATCH`, and delete redirects to `/editor` when deleting the active workspace or refreshes otherwise.
- Added a minimal `/editor/[projectId]` workspace target and real project sidebar links.
- Verified with `npx tsc --noEmit`, `npm run build`, and `npm run lint`; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`.
- Started implementation of `context/feature-specs/07-wire-editor-home.md`.
- Completed backend project API routes from `context/feature-specs/06-project-apis.md`.
- Added `GET` and `POST` handlers at `/api/projects` for owner-scoped project listing and creation with Clerk `userId` stored as `ownerId`.
- Added `PATCH` and `DELETE` handlers at `/api/projects/[projectId]` with owner checks returning `403` for authenticated non-owners.
- Added shared project API helpers for auth checks, body parsing, project-name validation/defaulting, consistent JSON errors, and project response serialization.
- Allowed `/api/projects` through Clerk middleware while keeping handler-level auth checks so unauthenticated API requests return JSON `401` responses.
- Verified with `npx tsc --noEmit`, `npm run lint`, `npm run build`, and unauthenticated `curl` checks for `GET`, `POST`, `PATCH`, and `DELETE`; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`.
- Completed Prisma schema and data layer from `context/feature-specs/05-prisma.md`.
- Added `Project` and `ProjectCollaborator` Prisma models, created migration `20260627141010_add_project_data_layer`, and generated the Prisma client into the ignored `app/generated/prisma` output.
- Added a server-only cached Prisma singleton in `lib/prisma.ts` that uses `accelerateUrl` for `prisma+postgres://` URLs and `@prisma/adapter-pg` for direct PostgreSQL URLs.
- Verified with `DOTENV_CONFIG_PATH=.env.local npx prisma validate`, `DOTENV_CONFIG_PATH=.env.local npx prisma migrate dev --name add_project_data_layer`, `DOTENV_CONFIG_PATH=.env.local npx prisma generate`, `npm run build`, and `npm run lint`; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`.
- Started implementation of `context/feature-specs/05-prisma.md`.
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
