# Current Issues

- No active issues currently.

## Resolved

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
