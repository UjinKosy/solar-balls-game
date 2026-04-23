# Client Behavior Contracts

## Exit flow contract (T-003)

1. User clicks `ВЫХОД` in `MainMenuScene`.
2. Client tries to call existing logout/session-clear hook.
3. If logout hook succeeds, client navigates to auth route/screen.
4. If logout hook is missing or throws, client still navigates to auth route/screen (fallback redirect).
5. Exit action must never leave user on main menu silently.

## Localization contract (T-004)

1. Supported locales: `ru`, `en`.
2. Both locale files contain exactly the same key set for menu/stub/exit UI.
3. Translator function returns active-locale value when key exists.
4. If key is missing in active locale, translator falls back to `en`.
5. If key is missing in both locales, translator returns key name to expose mismatch during QA.
