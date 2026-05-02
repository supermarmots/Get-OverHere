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
- [x] Landing feature section: 1분 생성, 실시간 관리, 추천 날짜 자동 계산
- [x] Authenticated dashboard at `/dashboard`
- [x] Dashboard greeting and logout
- [x] Dashboard Firestore realtime subscription by `participantIds array-contains uid`
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
- [x] Realtime participant subscription
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

## Operational Note

- Firestore rules changes require Firebase CLI login and deployment:

```bash
firebase deploy --only firestore:rules
```

## Next Work

See `docs/project/next-work.md` for the next feature, refactor, and UI improvement candidates.
