# Current Issues

- No active issues currently.

## Resolved

- Shape drag-and-drop now allows canvas drops during `dragover` by checking the drag MIME type instead of reading protected drag data before `drop`.
- Canvas toolbar and minimap overlays now use app-owned absolute positioning instead of relying on React Flow panel placement, the React Flow attribution is hidden, and initial fit view is capped at 1x zoom.
- Canvas nodes now expose stable top, right, bottom, and left connection handle IDs with start/end connectability and a larger connection radius.
- Shape dragging now shows a canvas-positioned drop preview before the node is created.
- Sidebar preference hydration mismatch fixed by deferring localStorage/sessionStorage reads until after mount.
- Right AI chat sidebar now matches the floating left sidebar treatment.
- Opening a project collapses the left sidebar for the next workspace load, including project creation.
- Share now grants workspace access to one email address and exposes the workspace link; share settings, collaborator management, and revoke behavior are intentionally not implemented yet.
- Direct Postgres connection strings normalize SSL alias modes to `verify-full` before initializing the Prisma PG adapter.
- Added a local user setting to control whether the project sidebar opens by default.
- Verified the pasted project review findings against current code; no new code changes were needed because the project API race guards, dialog request guards, collaborator email normalization, project listing index, and shared-project tab behavior are already implemented.
- Clerk user settings badges such as "This device" and "Primary" now use visible dark-theme contrast.
- Non-sluggable create-project names such as `!!` no longer generate a misleading room ID.
- Project name text contrast on dark dialog backgrounds.
- Subtle background texture for the editor window.
