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
- [x] Refactored dashboard copy and meeting section labels out of page components.
- [x] Added shared app copy constants without introducing broad abstractions.
- [x] Replaced submit button ternaries with a small readable label helper.

## Current Verification

- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Update meeting creation date selection to calendar UI.
- [x] Make meeting time selection optional.
- [x] Mark meeting description step as optional in the title.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Keep the meeting creation next/submit button visible on mobile with a sticky footer.
- [x] Add a top cancel button to exit meeting creation.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Add cancel confirmation dialog for meeting creation.
- [x] Move step progress to the top-right opposite the cancel button.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Replace native month input with year navigation and month selection UI.
- [x] Fix meeting date calendar weekday alignment.
- [x] Show selected target month above the date calendar.
- [x] Remove default date button fill and only highlight selected days.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Show weekdays in meeting creation review availability list.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.

## Next Candidate Work

- [x] Wire Firebase auth state into `authStore`.
- [x] Redirect authenticated users to `/dashboard`.
- [x] Implement `DashboardPage` from `docs/product/authenticated-landing.md`.
- [x] Add `/dashboard` route and protected-route redirect behavior.
- [x] Add dashboard dark mobile styles.
- [x] Add logout action.
- [x] Update dashboard product plan implementation status.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Review `docs/product/meeting-creation.md` before implementation.
- [x] Add meeting creation route and step-based page.
- [x] Add meeting creation validation helpers.
- [x] Add Firestore meeting creation service.
- [x] Add Firestore rules for `meetings` and `participants`.
- [x] Connect dashboard `약속 만들기` to `/meetings/new`.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [ ] Review `docs/product/meeting-invite-share.md` before implementation.
- [x] Review `docs/product/meeting-invite-share.md` before implementation.
- [x] Add invite share dynamic route handling.
- [x] Redirect meeting creation success to invite share page.
- [x] Add invite link copy UI.
- [x] Add dashboard return action.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Make meeting creation writes atomic with Firestore batch.
- [x] Add meeting creation error messages for missing auth/config and permission errors.
- [ ] Deploy Firestore rules after Firebase CLI login.
