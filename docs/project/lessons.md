# Lessons

- Do not concentrate page UI, form state, validation, and Firebase calls in `App.jsx`. Keep `App` as composition glue.
- Keep route paths and redirect normalization under `src/routes`; do not hard-code route strings throughout UI components.
- Thin route adapter files can become unnecessary indirection. If they only pass `navigate` callbacks, keep them in `AppRoutes.jsx` instead.
- Do not let CSS become a catch-all file. Keep global tokens, auth, landing/page, dashboard, and meeting styles separated by purpose.
- Prefer semantic HTML (`main`, `section`, `header`, `nav`, `footer`, `form`, `fieldset`, `p`) over generic `div`.
- Avoid card-style UI wrappers unless the content is genuinely a repeated card, modal, or framed tool.
- Keep all documentation Markdown under `docs/` except root `README.md` and `AGENTS.md`.
- Store Firestore source data in services/page state rather than copying all server data into Zustand.
- During refactoring, avoid broad abstractions. Remove indirection first; extract only repeated or complex logic with a clear reason.
- For participant dashboard queries, keep `meetings.participantIds` synchronized with participant documents so one `array-contains` query can power the dashboard.
- For simple CRUD screens in this app, avoid escalating loading fixes into realtime architecture changes; first simplify the read/write flow and remove stale indirection.
