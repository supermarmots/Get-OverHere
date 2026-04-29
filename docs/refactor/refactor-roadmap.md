# 리팩토링 로드맵

## 목적

현재 기능 구현은 동작을 우선해 빠르게 확장되었다. 다음 작업에서는 데이터 조회 안정성, Firestore 규칙 명확성, 화면 파일 분리를 중심으로 유지보수 비용을 줄인다.

## 우선순위

### 1. 대시보드 참여 목록 조회 구조 개선

- 현재: `meetings` 전체 구독 후 `participants/{uid}` 문서를 직접 확인한다.
- 문제: 약속이 많아지면 읽기 비용이 증가한다.
- 목표: `meetings.participantIds` 배열을 추가하고 `array-contains` 쿼리로 참여 약속을 조회한다.
- 작업:
  - 참여 제출 시 `participantIds: arrayUnion(user.uid)` 저장
  - 약속 생성 시 주최자 uid를 `participantIds`에 포함
  - 대시보드 참여 목록 쿼리 변경
  - 기존 데이터는 재제출 시 점진 보강
- 검증: 참여 후 새로고침해도 `참여 중`에 표시되고, 확정 상태는 `확정됨`으로 이동한다.

### 2. Firestore Rules 정리

- 현재: 권한 조건이 기능 추가 과정에서 누적되었다.
- 목표: 주최자, 참여자, 상태 변경, 참여자 수 증가 규칙을 함수로 분리한다.
- 작업:
  - `isSignedIn`, `isHost`, `isParticipantDocOwner` 함수 추가
  - status 변경은 주최자만 허용
  - participantCount 증가는 참여자 생성 흐름에서만 허용
  - collection group 조회 규칙 필요 여부 재검토
- 검증: 약속 생성/참여/확정/재개최/삭제가 의도한 권한에서만 동작한다.

### 3. Meeting Status 상수화

- 현재: `collecting`, `confirmed`, `deleted` 문자열이 여러 파일에 직접 사용된다.
- 목표: `src/features/meetings/lib/meetingStatus.js`로 상수와 라벨을 관리한다.
- 작업:
  - `MEETING_STATUS` 상수 추가
  - status 라벨 함수 이동 또는 통합
  - 서비스와 화면에서 문자열 직접 사용 제거
- 검증: 상태 라벨은 `진행중`, `확정됨`, `확정 대기`로 기존과 동일하게 표시된다.

### 4. MeetingDetailPage 컴포넌트 분리

- 현재: 상세 조회, 참여자 목록, 추천 날짜, 초대 링크, 확정/삭제 액션이 한 파일에 있다.
- 목표: 화면 책임을 작은 컴포넌트로 나눈다.
- 작업:
  - `MeetingSummary`
  - `ParticipantList`
  - `RecommendedDates`
  - `MeetingDetailActions`
  - `InviteLinkField`
- 검증: 상세 화면의 기존 기능과 모바일 레이아웃이 유지된다.

### 5. JoinMeetingPage 단계 컴포넌트 분리

- 현재: 단계 상태, 달력, 시간 입력, 확인, 제출 로직이 한 파일에 있다.
- 목표: 단계 UI와 검증 로직을 분리한다.
- 작업:
  - `JoinDateStep`
  - `JoinTimeStep`
  - `JoinReviewStep`
  - `joinValidation.js`
- 검증: 날짜 선택, 선택 시간 입력, 제출 확인, 재제출이 기존처럼 동작한다.

### 6. Shared UI 스타일 정리

- 현재: 모달, 아이콘 버튼, 액션 버튼 스타일이 feature CSS에 섞여 있다.
- 목표: 반복되는 UI 패턴만 shared CSS 또는 shared component로 분리한다.
- 작업:
  - modal 스타일 공통화
  - icon button 스타일 공통화
  - destructive action 스타일 공통화
- 검증: 카드 UI 남용 없이 semantic markup 원칙을 유지한다.

## 작업 원칙

- 하드코딩을 줄이되 과한 추상화는 피한다.
- 기능 변경 없이 구조만 바꾸는 리팩토링은 작게 나눠 진행한다.
- 각 단계마다 `npm run lint`, `npm run build`를 통과해야 한다.
- Firestore rules 변경 시 README의 배포 명령을 다시 확인한다.
