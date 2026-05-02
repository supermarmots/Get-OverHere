# Next Work Plan

## Goal

다음 작업은 핵심 플로우를 유지하면서 제품 완성도를 높이는 순서로 진행한다. 큰 추상화보다 작은 기능 완성, 검증 가능한 리팩토링, 사용자에게 바로 보이는 UI 개선을 우선한다.

## Feature Candidates

### Feature 1: 확정 날짜/시간 저장

**Why:** 현재 `확정하기`는 meeting status만 `confirmed`로 바꾼다. 실제로 어떤 날짜/시간이 확정되었는지 저장하지 않는다.

**Scope:**

- `meetings/{meetingId}`에 확정 결과 필드 추가
  - 예: `confirmedDate`, `confirmedStartTime`, `confirmedEndTime`
- 상세 화면 추천 날짜에서 주최자가 후보를 선택할 수 있게 한다.
- 확정 완료 dashboard card와 상세 화면에 확정 결과를 표시한다.
- Firestore rules에서 host만 확정 결과를 수정할 수 있게 확인한다.

**Files likely touched:**

- `src/features/meetings/pages/MeetingDetailPage.jsx`
- `src/features/meetings/lib/meetingRecommendations.js`
- `src/features/meetings/services/meetingService.js`
- `src/features/dashboard/components/MeetingCard.jsx`
- `firestore.rules`
- `docs/product/meeting-recommendations.md`

**Verification:**

```bash
npm run lint
npm run build
```

Manual check:

- 주최자가 추천 날짜를 선택해 확정한다.
- 대시보드 확정 완료 섹션에 확정 결과가 보인다.
- 참여자는 확정 결과를 읽을 수 있지만 수정할 수 없다.

### Feature 2: 대시보드 필터/검색

**Why:** 약속 수가 늘어나면 3개 섹션만으로 찾기 어렵다.

**Scope:**

- 제목 검색 input 추가
- 상태/역할 필터는 과하지 않게 최소 범위로 시작
- Firestore query를 늘리기보다 현재 구독 결과를 클라이언트에서 필터링

**Files likely touched:**

- `src/features/dashboard/pages/DashboardPage.jsx`
- `src/features/dashboard/components/MeetingListSection.jsx`
- `src/styles/dashboard.css`

**Verification:**

- 검색어 입력 시 세 섹션 모두 필터링된다.
- 빈 결과 메시지가 어색하지 않다.
- 모바일에서 input과 버튼이 겹치지 않는다.

## Refactor Candidates

### Refactor 1: `MeetingDetailPage` 컴포넌트 분리

**Why:** 상세 화면 파일이 여러 책임을 가진다.

**Scope:**

- UI 조각만 먼저 분리한다.
- 데이터 fetch/subscription은 1차로 page에 남겨둔다.
- 로직 이동보다 JSX 가독성 개선을 우선한다.

**Suggested components:**

- `MeetingDetailHeader`
- `MeetingSummary`
- `InviteLinkField`
- `RecommendedDates`
- `ParticipationSlots`
- `MeetingDetailActions`
- `ConfirmActionDialog`

**Verification:**

```bash
npm run lint
npm run build
```

Manual check:

- 상세 조회
- 초대 링크 복사
- 확정하기
- 수정 이동
- 삭제/참여 취소 dialog

### Refactor 2: `JoinMeetingPage` 단계 UI 분리

**Why:** 참여 flow도 데이터 로딩, 단계 상태, submit이 한 파일에 모여 있다.

**Scope:**

- 날짜 선택, 시간 선택, 확인 UI를 component로 분리한다.
- validation/helper는 `lib`로 이동한다.
- 기존 생성 flow component와 억지로 합치지 않는다.

**Verification:**

- 새 참여 제출
- 기존 참여 수정
- 주최자 role 유지
- 로그인 redirect 후 join route 복귀

### Refactor 3: Bundle size 개선 조사

**Why:** Vite build에서 500 kB 초과 경고가 발생한다.

**Scope:**

- Firebase/React Router bundle 영향 확인
- route-level dynamic import 적용 여부 검토
- 성급한 최적화 대신 warning 원인 기록부터 진행

**Verification:**

- build warning 감소 또는 원인 문서화
- 기능 regression 없음

## UI Improvement Candidates

### UI 1: 모바일 대시보드 밀도 점검

**Why:** 약속 현황 1행 3열, 주요 액션 1행 2열을 유지하므로 작은 화면에서 텍스트/간격이 타이트할 수 있다.

**Scope:**

- 360px 폭 기준 확인
- 숫자/라벨 줄바꿈 여부 점검
- 버튼 터치 영역 유지
- 필요하면 font-size와 gap만 미세 조정

**Verification:**

- 브라우저 모바일 viewport에서 dashboard 확인
- 텍스트 겹침 없음
- 버튼 2개가 한 행에 유지됨

### UI 2: 상세 화면 추천 날짜 CTA 강화

**Why:** 추천 날짜가 보여도 다음 행동인 확정이 시각적으로 약할 수 있다.

**Scope:**

- 추천 날짜와 `확정하기` 관계를 더 명확하게 표현
- 확정 기능이 status만 바꾸는 현재 한계를 copy로 숨기지 않는다.
- Feature 1과 함께 진행하면 확정 후보 선택 UI로 자연스럽게 연결된다.

### UI 3: 랜딩 페이지 브랜드 정체성 보강

**Why:** 현재 핵심 기능은 보이지만 브랜드 로고/상단 구조는 단순하다.

**Scope:**

- 상단에 작은 서비스명/브랜드 영역 추가 검토
- CTA는 계속 `약속 만들기` 중심 유지
- 기능 카드 3개는 유지하되 copy를 더 짧게 다듬는다.

## Documentation Tasks

- 기능 구현 후 관련 `docs/product/*.md`를 즉시 최신화한다.
- 리팩토링 완료 시 `docs/refactor/refactor-roadmap.md`의 완료 섹션으로 이동한다.
- 다음 작업 우선순위가 바뀌면 이 문서를 먼저 수정한다.
