# Repository Guidelines

## Project Structure & Module Organization

This is a React 19 + Vite scheduling coordination app using Firebase Auth, Firestore, Firebase Hosting, and Zustand. Source code is feature-oriented:

- `src/app/`: app composition and top-level route selection only.
- `src/features/`: domain features such as `auth` and `landing`.
- `src/shared/`: cross-feature infrastructure, including Firebase initialization.
- `src/routes/`: route constants and redirect normalization.
- `src/stores/`: Zustand stores for app-wide state.
- `src/styles/`: global CSS entry and dark-theme style layers.
- `public/`: static assets served directly.

Keep `README.md` and `AGENTS.md` at the repo root. All other Markdown documentation must live under `docs/`, using subfolders such as `docs/product/`, `docs/architecture/`, and `docs/project/`.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Vite dev server.
- `npm run build`: create the production build in `dist/`.
- `npm run preview`: serve the production build locally.
- `npm run lint`: run ESLint.
- `firebase deploy`: deploy Firebase Hosting/config after selecting the correct project.

## Coding Style & Architecture Rules

Use modern ES modules, React function components, two-space indentation, single quotes, and no semicolons. Name components with PascalCase and handlers with clear verbs, for example `LoginForm` and `handleEmailLogin`.

Keep `App.jsx` thin. Do not put page markup, validation, Firebase calls, or feature business logic in `src/app/App.jsx`. Put feature UI in `features/*/components`, route-level screens in `features/*/pages`, validation/error helpers in `features/*/lib`, and Firebase calls in `features/*/services`.

Use Zustand for app-wide client state, but avoid copying all Firestore data into stores. Keep stores focused on shared UI/auth state and derived state needed across screens.

## UI & Styling Guidelines

Dark theme is the default. Manage CSS through `src/styles/main.css`, importing focused files such as `base.css`, `pages.css`, and `auth.css`. Avoid catch-all stylesheets.

Prefer semantic HTML (`main`, `section`, `header`, `nav`, `footer`, `form`, `fieldset`, `p`) over generic `div`. Avoid card-style UI unless the content is a true repeated card, modal, or framed tool. Design mobile first: full-width primary actions where appropriate, stable input sizing, and no overlapping text.

## Testing Guidelines

No automated test framework is configured yet. Before marking work complete, run `npm run lint` and `npm run build`. For auth changes, also manually verify email/password and Google flows in the browser when Firebase environment variables are available.

## Commit & Pull Request Guidelines

Existing history uses capitalized type prefixes, for example `Docs: README 기획안 작성`. Continue with concise messages like `Feat: add dashboard shell` or `Fix: handle invalid login`. PRs should include a clear summary, linked issue when applicable, screenshots for UI changes, and verification notes.

## Security & Configuration Tips

Do not commit `.env` files, Firebase service account keys, or local secrets. Client Firebase config belongs in Vite env variables such as `VITE_FIREBASE_API_KEY`; keep `.env.example` updated. Review `firestore.rules` whenever user data access changes.
