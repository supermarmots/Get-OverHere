# 리팩토링 로드맵

## 목적

현재 앱은 핵심 약속 생성/참여/관리 흐름이 동작한다. 다음 리팩토링은 기능 추가보다 유지보수 비용을 줄이는 데 집중한다. 완료된 일회성 작업은 기록만 남기고, 앞으로 할 작업은 작게 나눠 진행한다.

## 완료된 리팩토링

### 대시보드 조회 구조 정리

- `participantIds` 배열 도입
- 약속 생성 시 주최자 uid 포함
- 참여 제출 시 `arrayUnion(user.uid)` 저장
- 참여 취소 시 `arrayRemove(user.uid)` 저장
- 대시보드 조회를 `participantIds array-contains uid`로 단순화
- collection group participants 조회와 관련 rule 제거
- backfill 스크립트와 Admin SDK 의존성 제거

### Firestore Rules 정리

- `isSignedIn`, `isHost`, `isParticipantDocOwner` 등 helper 분리
- meeting update 권한을 host update, participant join metadata update, participant cancel metadata update로 분리
- participant create/update/delete와 parent meeting `participantIds` 동기화 검증

### Meeting Status 상수화

- `MEETING_STATUS` 상수 도입
- status 라벨 함수를 meeting status lib로 이동
- 직접 문자열 비교를 줄임

### 참여자 상세 액션 정리

- 주최자: 수정, 약속 삭제, 확정하기
- 참여자: 수정, 참여 취소
- 참여자 수정은 join flow 재사용

### Route adapter 제거

- `src/routes/adapters/*`의 얇은 wrapper 파일 제거
- route 연결 callback은 `src/routes/AppRoutes.jsx`에서 직접 구성
- 실제 page UI와 business logic은 feature page/service에 유지

### UI 단순화

- 랜딩 페이지 핵심 가치 제안과 기능 3개를 명확히 표시
- 대시보드 약속 현황 1행 3열 구성
- 대시보드 주요 액션 `새 약속`, `초대 참여` 1행 2열 구성
- 기능 없는 프로필 버튼 제거

## 다음 리팩토링 후보

### 1. `MeetingDetailPage` 컴포넌트 분리

현재 상세 조회, 참여자 목록, 추천 날짜, 초대 링크, 확정/삭제/취소 dialog 로직이 한 파일에 모여 있다.

작업 후보:

- `MeetingDetailHeader`
- `MeetingSummary`
- `InviteLinkField`
- `RecommendedDates`
- `ParticipationSlots`
- `MeetingDetailActions`
- `ConfirmActionDialog`

검증:

- 상세 조회, 링크 복사, 확정, 수정, 삭제, 참여 취소가 기존처럼 동작한다.
- 모바일 레이아웃이 깨지지 않는다.
- `npm run lint`, `npm run build` 통과

### 2. `JoinMeetingPage` 단계 컴포넌트 분리

현재 참여 데이터 로딩, 단계 상태, 날짜 선택, 시간 입력, 확인, 제출 로직이 한 파일에 있다.

작업 후보:

- `JoinDateStep`
- `JoinTimeStep`
- `JoinReviewStep`
- `joinMeetingForm.js` 또는 `joinValidation.js`

검증:

- 초대 링크 접근
- 로그인 redirect 복귀
- 기존 응답 수정
- 새 참여자 제출
- 주최자 role 유지

### 3. 공통 dialog/button 스타일 정리

현재 dialog, icon button, danger action 스타일이 feature CSS에 섞여 있다. 단, 성급한 component library는 만들지 않는다.

작업 후보:

- 반복되는 dialog class 정리
- icon button 스타일 명명 통일
- destructive action 스타일 통일

검증:

- 카드형 UI 남용 없이 semantic markup 유지
- 기존 visual regression이 없어야 함

### 4. Firestore rules 테스트 도입 검토

현재 rules는 수동 검증에 가깝다. 참여 생성/수정/취소처럼 batch 동기화가 중요한 로직은 rules 테스트를 도입할 가치가 있다.

작업 후보:

- Firebase emulator 기반 rules 테스트 환경 조사
- participant join/cancel happy path와 forbidden path 테스트
- host-only update/delete 시나리오 테스트

## 작업 원칙

- 하드코딩을 줄이되 과한 추상화는 피한다.
- 기능 변경 없는 리팩토링은 작게 나눠 진행한다.
- 각 단계마다 `npm run lint`, `npm run build`를 통과해야 한다.
- Firestore rules 변경 시 `firebase deploy --only firestore:rules`가 필요하다.
