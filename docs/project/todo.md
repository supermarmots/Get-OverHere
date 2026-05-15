# Project Status

## Current Completed Scope

### Authentication

- [x] Email/password signup
- [x] Email/password login
- [x] Google OAuth login/signup
- [x] Firebase Auth state wired to Zustand `authStore`
- [x] User profile metadata stored at `users/{uid}`
- [x] Protected route redirect with post-auth return path

### Landing and Dashboard

- [x] Dark landing page with service value proposition
- [x] Landing feature section: 1분 생성, 일정 관리, 추천 날짜 자동 계산
- [x] Authenticated dashboard at `/dashboard`
- [x] Dashboard greeting and logout
- [x] Dashboard Firestore query by `participantIds array-contains uid`
- [x] Dashboard sections: 내가 조율 중, 참여 중, 확정 완료
- [x] Dashboard status summary: 1행 3열
- [x] Dashboard actions: `새 약속`, `초대 참여` 1행 2열
- [x] Invite link join dialog
- [x] Empty state guide

### Meetings

- [x] Step-based meeting creation at `/meetings/new`
- [x] Meeting creation validation helpers
- [x] Firestore batch creation for meeting and host participant
- [x] Invite share page at `/meetings/{meetingId}/invite`
- [x] Meeting detail page at `/meetings/{meetingId}`
- [x] Meeting edit page at `/meetings/{meetingId}/edit`
- [x] Invite join page at `/meetings/{meetingId}/join`
- [x] Participant response create/update
- [x] Participant cancellation
- [x] Host-only soft delete
- [x] Host-only confirm action
- [x] Host reopen action from confirmed dashboard section
- [x] Participant availability query
- [x] Recommended dates based on participant availability

### Refactor / Maintenance

- [x] Feature-based source directory structure
- [x] Centralized route paths and redirect state helpers
- [x] Removed thin route adapter files
- [x] Centralized meeting status constants
- [x] Simplified dashboard query through `participantIds`
- [x] Removed one-time backfill script and unused Admin SDK dependency
- [x] Removed unused collection group participant rule
- [x] Updated docs to current product and architecture state

## Current Verification

Last verified commands:

```bash
npm run lint
npm run build
```

Both commands pass. Vite may warn that the production bundle is larger than 500 kB; this is a performance follow-up, not a build failure.

## Recent Work

### Meeting Edit Loading Fix

- [x] Separate meeting document loading from participant availability loading on meeting detail.
- [x] Add explicit load state to the meeting edit form.
- [x] Keep join/edit availability reads from blocking primary meeting rendering.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Document the result after verification.

Review:

- Superseded by Simplification Pass 1. Splitting meeting and availability loading added more states than this CRUD app needs.

### Simplification Audit

- [x] Review route composition for unnecessary indirection.
- [x] Review meeting service API shape for duplicate read paths.
- [x] Review meeting pages for over-split loading and form state.
- [x] Review dashboard realtime usage against simple CRUD requirements.
- [x] Review helpers and docs for stale complexity.
- [x] Choose a simplification pass before making more feature changes.

### Simplification Pass 1

- [x] Collapse split meeting/availability loading in edit and join screens.
- [x] Use existing `getMeeting` and `getMeetingJoinData` as the simple read entrypoints.
- [x] Remove temporary `getMeetingDocument` and `getMeetingParticipant` helpers.
- [x] Keep current dashboard/detail realtime behavior unchanged for this pass.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Document the result.

Review:

- Edit and join screens now use a single initial CRUD read path again.
- Temporary `getMeetingDocument` and `getMeetingParticipant` helpers were removed.
- Detail keeps the existing participant subscription but uses `getMeeting` for the initial meeting read.
- `npm run lint` passed.
- `npm run build` passed. Vite still reports the existing large bundle warning.

### Simplification Pass 2

- [x] Replace dashboard realtime subscription with one-shot meeting fetch.
- [x] Replace meeting detail participant realtime subscription with one-shot participant fetch.
- [x] Remove now-unused subscription service helpers and Firestore `onSnapshot` imports.
- [x] Update local state after dashboard reopen so the list remains correct without realtime.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Document the result.

Review:

- Dashboard now fetches the user's meetings once on page load instead of keeping a realtime subscription open.
- Meeting detail now fetches participants once on page load and computes recommendations from that snapshot.
- `onSnapshot` is no longer used in app services.
- Reopening a confirmed meeting updates dashboard local state after the write succeeds.
- User-facing realtime copy was changed to simple CRUD-oriented copy.
- `npm run lint` passed.
- `npm run build` passed. Vite still reports the existing large bundle warning.

## Operational Note

- Firestore rules changes require Firebase CLI login and deployment:

```bash
firebase deploy --only firestore:rules
```

## Next Work

See `docs/project/next-work.md` for the next feature, refactor, and UI improvement candidates.
