# Current Issues

- Add a user setting to control whether the sidebar is expanded or collapsed by default.

## Resolved

- Verified the pasted project review findings against current code; no new code changes were needed because the project API race guards, dialog request guards, collaborator email normalization, project listing index, and shared-project tab behavior are already implemented.
- Clerk user settings badges such as "This device" and "Primary" now use visible dark-theme contrast.
- Non-sluggable create-project names such as `!!` no longer generate a misleading room ID.
- Project name text contrast on dark dialog backgrounds.
- Subtle background texture for the editor window.
