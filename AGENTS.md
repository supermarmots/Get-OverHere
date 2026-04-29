# Repository Guidelines

## Project Structure & Module Organization

This is a React 19 + Vite web app for scheduling coordination, with Firebase planned for auth, Firestore, and hosting. App source lives in `src/`: `main.jsx` mounts React, `App.jsx` contains the current UI, and `App.css` plus `index.css` hold styles. Static public assets belong in `public/`, while imported component assets belong in `src/assets/`. Firebase configuration is kept at the repo root in `firebase.json`, `firestore.rules`, and `firestore.indexes.json`. Production output is generated in `dist/` and should not be edited by hand.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Vite development server with hot reload.
- `npm run build`: create a production build in `dist/`.
- `npm run preview`: serve the production build locally for smoke testing.
- `npm run lint`: run ESLint across the project.
- `firebase deploy`: deploy hosting and Firebase config when the Firebase project is selected.

## Coding Style & Naming Conventions

Use modern ES modules and React function components. Match the existing style: two-space indentation, single quotes, no semicolons, and JSX files named with PascalCase for components such as `App.jsx`. Prefer descriptive component, hook, and handler names (`ScheduleForm`, `useAvailability`, `handleSubmit`). Keep CSS selectors close to the component they style, and use assets through imports when they are bundled by Vite.

## Testing Guidelines

No test framework is configured yet. Until one is added, verify changes with `npm run lint`, `npm run build`, and manual checks through `npm run dev` or `npm run preview`. When tests are introduced, colocate them near source files using `*.test.jsx` or place broader integration tests under `src/__tests__/`.

## Commit & Pull Request Guidelines

The current history uses a capitalized type prefix, for example `Docs: README 기획안 작성`. Continue with concise messages like `Feat: add schedule creation form` or `Fix: validate empty time slots`. Pull requests should include a clear summary, linked issue when applicable, screenshots for UI changes, and notes on lint/build/manual verification.

## Security & Configuration Tips

Do not commit Firebase service account keys or local environment secrets. Keep client-safe Firebase settings in environment variables when added, and review `firestore.rules` whenever data access patterns change.
