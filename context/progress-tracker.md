# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Foundation setup

## Current Goal

- Prepare the next feature unit from `context/feature-specs/`.

## Completed

- Shape drag-and-drop regression fix on the editor canvas.
- Canvas connection handle and shape drag preview issue fixes from `context/current-issues.md`.
- Liveblocks-style editor canvas visual polish from the provided screenshot.
- Shape panel from `context/feature-specs/12-shape-panel.md`.
- Liveblocks-backed base canvas from `context/feature-specs/11-base-canvas.md`.
- Liveblocks collaboration setup from `context/feature-specs/10-liveblocks-setup.md`.
- Share dialog collaborator management from `context/feature-specs/09-share-dialog.md`.
- Sidebar preference hydration mismatch fix.
- Sidebar default setting moved into Clerk user settings.
- Email-based project sharing access.
- Workspace shell issue cleanup from `context/current-issues.md`.
- Editor workspace shell from `context/feature-specs/08-editor-workspace-shell.md`.
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

- Completed shape drag-and-drop regression fix on the editor canvas.
- Fixed the canvas `dragover` gate so it checks the custom drag MIME type and calls `preventDefault()` without trying to read protected `DataTransfer` payload data before `drop`.
- Kept the drag preview alive from the local drag-start payload and used the drop payload with a local fallback when creating nodes.
- Started shape drag-and-drop regression fix after canvas `dragover` stopped allowing drops.
- Started editor canvas overlay placement and initial zoom regression fix after the canvas controls rendered in normal flow.
- Completed canvas connection handle and shape drag preview issue fixes from `context/current-issues.md`.
- Added stable top, right, bottom, and left IDs to custom canvas node handles, enabled each visible handle to start or end a connection, increased handle size slightly, and raised the React Flow connection radius so connection drops are less finicky.
- Added a shape drag preview overlay that follows the pointer over the canvas using the drag payload dimensions and shape icon, and clears on drop, drag end, or leaving the canvas.
- Moved the active current issues for connection handles and drag preview into the resolved section of `context/current-issues.md`.
- Started canvas connection handle and shape drag preview issue fixes from `context/current-issues.md`.
- Completed Liveblocks-style editor canvas visual polish from the provided screenshot.
- Changed the editor shell so the AI sidebar starts closed, the workspace canvas sits inside an inset rounded bordered surface, and the top actions use compact bordered dark buttons closer to the reference.
- Tuned the editor navbar with a base-background top bar, larger project title, and muted subtitle.
- Restyled the shape panel as a lower, translucent rounded pill with muted outline icons, tightened spacing, and screenshot-like hover/focus states.
- Darkened and framed the React Flow minimap, tightened the dot-grid spacing, and added a grab cursor on the canvas pane.
- Verified with `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `git diff --check`; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`.
- Started Liveblocks-style editor canvas visual polish from the provided screenshot.
- Completed shape panel from `context/feature-specs/12-shape-panel.md`.
- Added a bottom-center floating shape toolbar with draggable icon buttons for rectangle, diamond, circle, pill, cylinder, and hexagon.
- Added validated shape drag payloads with shape, width, and height; canvas dragover and drop handling; screen-to-canvas coordinate conversion; node ID generation using shape name, timestamp, and a counter; and Liveblocks-backed node creation through React Flow node add changes.
- Added a custom `canvasNode` renderer that displays newly dropped nodes as simple bordered rectangles with centered labels while preserving default node color data and shape metadata.
- Verified with `npm run build`, `npm run lint`, and `git diff --check`; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`.
- Started implementation of `context/feature-specs/12-shape-panel.md`.
- Completed Liveblocks-backed base canvas from `context/feature-specs/11-base-canvas.md`.
- Added shared canvas schema types in `types/canvas.ts` with `canvasNode`, `canvasEdge`, the documented node color palette, and supported node shapes.
- Replaced the workspace canvas placeholder with a Liveblocks-backed React Flow canvas using `/api/liveblocks-auth`, room-scoped `RoomProvider`, initial cursor presence, `ClientSideSuspense`, a connection error fallback, empty initial nodes and edges, loose connections, `fitView`, `MiniMap`, dot background, and Liveblocks cursors.
- Typed the Liveblocks `flow` storage key for React Flow sync while keeping storage initialization handled by `useLiveblocksFlow`.
- Verified with `npx tsc --noEmit`, `npm run build`, `npm run lint`, `git diff --check`, signed-out HTTP checks for `/editor` and `/sign-in` on the existing dev server, and a compiled CSS check for React Flow styles; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`.
- Started implementation of `context/feature-specs/11-base-canvas.md`.
- Completed Liveblocks collaboration setup from `context/feature-specs/10-liveblocks-setup.md`.
- Added strict Liveblocks app types for cursor presence, AI thinking state, and user metadata with name, avatar, and cursor color.
- Installed the missing `@liveblocks/node` package at the existing Liveblocks package version, added a cached server-only Liveblocks client, and added deterministic Clerk user ID to cursor color mapping.
- Added `POST /api/liveblocks-auth` with Clerk authentication, owner-or-collaborator project access verification, private Liveblocks room creation, room-scoped write authorization, and Clerk-derived user metadata.
- Verified with `npx tsc --noEmit`, `npm run lint`, and `npm run build`; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`.
- Started implementation of `context/feature-specs/10-liveblocks-setup.md`.
- Started implementation of `context/feature-specs/09-share-dialog.md`.
- Added share dialog collaborator management with owner-only invite, owner-only remove, read-only collaborator viewing, and project-link copy feedback.
- Added collaborator `GET`, `POST`, and `DELETE` route logic with server-side ownership checks and Clerk Backend API enrichment for collaborator display names and avatars.
- Completed share dialog collaborator management from `context/feature-specs/09-share-dialog.md`.
- Verified with `npx tsc --noEmit`, `npm run lint`, `npm run build`, `git diff --check`, and an unauthenticated collaborator API `401` check; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`.
- Polished the share dialog desktop layout so it stays centered and constrained on laptop-width screens instead of stretching across the viewport.
- Adjusted the share dialog body back to three stacked sections: invite, project link, and collaborator list.
- Capped the share dialog collaborator list with internal scrolling after four collaborators so the modal does not grow indefinitely.
- Addressed Codex PR review feedback by making Clerk collaborator enrichment fail soft, keeping owner mutations auth-only, and serializing collaborator mutations during load/invite/remove.
- Refined the share dialog toward the provided dark-mode reference with a wider modal, reference-style invite row, footer copy-link action, scroll-capped people list, accessible invite button labeling, and real avatar images with initials fallback.
- Reworked the share dialog structure to more closely match the provided reference, with a custom wide modal shell, cleaner empty collaborator state, and fixed-size avatar image rendering.
- Fixed the sidebar preference hydration mismatch by making `useSidebarPreference` render the same fallback state during SSR and the browser's initial render, then applying localStorage/sessionStorage preferences after mount.
- Verified the hydration fix with `npx tsc --noEmit`, `npm run lint`, `npm run build`, `git diff --check`, signed-out HTTP checks for `/editor` and `/sign-in`, and a post-patch dev-server browser log tail with no new hydration error; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`.
- Moved the local project sidebar default-open setting out of the project sidebar footer and into a custom Workspace page inside Clerk's `UserButton` user settings.
- Kept sidebar preference persistence local to the existing `useSidebarPreference` localStorage flow; no account-synced settings, sharing revoke logic, or new server persistence was added.
- Verified with `npx tsc --noEmit`, `npm run lint`, `npm run build`, `git diff --check`, and signed-out HTTP checks for `/editor` and `/sign-in`; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`, and T3 preview snapshot timed out at the automation layer.
- Completed email-based project sharing access.
- Added an owner-only collaborator share endpoint at `/api/projects/[projectId]/collaborators` that grants access by normalized email without adding share settings, collaborator listing, or revoke behavior.
- Replaced the workspace share action with an email dialog that grants access and exposes/copies the workspace link.
- Preserved shared workspace return URLs through local Clerk sign-in and sign-up so invited users can create an account and land on the shared project when their primary email matches the collaborator email.
- Updated the access denied screen to tell signed-in users they lack access and route them to create their own project.
- Verified with `npx tsc --noEmit`, `npm run lint`, `npm run build`, `git diff --check`, an unauthenticated collaborator API `401` check, and a signed-out shared workspace redirect check; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`, and T3 preview navigation failed at the automation layer.
- Started email-based project sharing access.
- Completed workspace shell issue cleanup from `context/current-issues.md`.
- Matched the AI chat sidebar to the floating project sidebar style and added a close button plus mobile scrim.
- Added a local project sidebar default-open setting, and collapse-on-project-open behavior for sidebar links and project creation.
- Initially enabled the Share action as link copy only; this was superseded by email-based collaborator sharing without share settings or revoke behavior.
- Normalized direct Postgres `sslmode=prefer`, `require`, and `verify-ca` values to `verify-full` before initializing the Prisma PG adapter.
- Verified with `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `git diff --check`; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`, and T3 preview automation timed out before browser UI smoke testing.
- Started workspace shell issue cleanup from `context/current-issues.md`.
- Completed editor workspace shell from `context/feature-specs/08-editor-workspace-shell.md`.
- Added `lib/project-access.ts` for current Clerk identity lookup and owner-or-collaborator project access checks.
- Added `AccessDenied` for missing or unauthorized workspaces, and changed `/editor/[roomId]` to redirect signed-out users to `/sign-in` before loading project access.
- Added a workspace shell with project title in the navbar, disabled share action, AI sidebar toggle, highlighted active room in the existing project sidebar, canvas placeholder, and AI sidebar placeholder.
- Adjusted proxy matching so `/editor/[roomId]` is handled by the server page access checks while `/editor` keeps the existing middleware protection.
- Verified with `npx next typegen`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, `git diff --check`, and signed-out HTTP checks for `/editor` and `/editor/non-existent-room`; lint still reports the existing warning in `.agents/skills/clerk-tanstack-patterns/templates/tanstack-basic-auth/src/routes/__root.tsx`.
- Started implementation of `context/feature-specs/08-editor-workspace-shell.md`.
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
