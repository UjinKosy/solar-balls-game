# Client Behavior Contracts

## Exit flow contract (T-003)

1. User clicks `ВЫХОД` in `MainMenuScene`.
2. Client tries to call existing logout/session-clear hook.
3. If logout hook succeeds, client navigates to auth route/screen.
4. If logout hook is missing or throws, client still navigates to auth route/screen (fallback redirect).
5. Exit action must never leave user on main menu silently.
