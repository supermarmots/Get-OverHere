# Project Work Log

## Completed

- [x] Replaced Vite starter screen with a minimal dark landing page.
- [x] Added Firebase email/password signup.
- [x] Added Google OAuth signup/login.
- [x] Added Firebase email/password login.
- [x] Stored user profile metadata in Firestore at `users/{uid}`.
- [x] Moved route constants and redirect normalization into `src/routes`.
- [x] Moved styles into `src/styles` with dark theme defaults and mobile-first auth layouts.
- [x] Reduced avoidable `div` usage in page markup.
- [x] Moved source architecture to feature-based folders:
  - `src/app`
  - `src/features`
  - `src/shared`
  - `src/routes`
  - `src/stores`
  - `src/styles`
- [x] Added Zustand dependency and `src/stores/authStore.js`.
- [x] Moved non-root documentation into `docs/`.
- [x] Created architecture guide at `docs/architecture/directory-architecture.md`.
- [x] Created authenticated dashboard planning doc at `docs/product/authenticated-landing.md`.

## Current Verification

- [x] Run `npm run lint`.
- [x] Run `npm run build`.

## Next Candidate Work

- [ ] Wire Firebase auth state into `authStore`.
- [ ] Redirect authenticated users to `/dashboard`.
- [ ] Implement `DashboardPage` from `docs/product/authenticated-landing.md`.
- [ ] Add meeting creation route and page skeleton.
