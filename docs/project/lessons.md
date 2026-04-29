# Lessons

- Do not concentrate page UI, form state, validation, and Firebase calls in `App.jsx`. For non-trivial UI, design the directory structure first and keep `App` as composition/navigation glue.
- Do not let `App.css` become a catch-all stylesheet. Put shared tokens/base rules and feature/page styles under `src/styles`, and account for theme and mobile layout up front.
- Do not hard-code route names or redirect decisions inside UI components. Keep route paths and normalization rules under `src/routes` even before adopting a router library.
- Prefer semantic HTML (`main`, `section`, `header`, `nav`, `footer`, `form`, `p`) over generic `div`. Avoid card-style UI wrappers unless the content is genuinely a repeated card or modal.
- Keep all documentation Markdown under `docs/` except root `README.md` and `AGENTS.md`.
- Align directory architecture with the actual stack: React/Vite app composition, Firebase services, feature folders, shared infrastructure, routes, styles, and Zustand stores.
