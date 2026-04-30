# 리팩토링 로드맵

## 목적

현재 기능 구현은 동작을 우선해 빠르게 확장되었다. 리팩토링은 데이터 조회 안정성, Firestore 규칙 명확성, 화면 파일 분리, 반복 UI 정리를 중심으로 유지보수 비용을 줄인다.

## 현재 상태

- 완료: 대시보드 참여 목록 조회 구조 개선
- 완료: Firestore Rules 정리
- 완료: Meeting Status 상수화
- 완료: 참여자 상세 액션 정리
- 진행 전: `MeetingDetailPage` 컴포넌트 분리
- 진행 전: `JoinMeetingPage` 단계 컴포넌트 분리
- 진행 전: Shared UI 스타일 정리

## 우선순위

### 1. 대시보드 참여 목록 조회 구조 개선 - 완료

- 변경:
  - `meetings.participantIds` 배열 추가
  - 약속 생성 시 주최자 uid를 `participantIds`에 포함
  - 참여 제출 시 `participantIds: arrayUnion(user.uid)` 저장
  - 대시보드 참여 목록을 `array-contains` 쿼리로 변경
  - 기존 데이터는 일회성 backfill로 보강 완료
  - 완료된 backfill 스크립트와 Admin SDK 의존성 제거
- 남은 주의사항:
  - 새 참여/참여 수정/참여 취소가 parent meeting의 `participantIds`와 항상 동기화되어야 한다.
- 검증:
  - 기존 참여 약속이 대시보드에 다시 표시됨
  - `npm run lint`, `npm run build` 통과

### 2. Firestore Rules 정리 - 완료

- 변경:
  - `isSignedIn`, `isHost`, `isParticipantDocOwner` 함수 추가
  - meeting create/update 권한을 `isMeetingHostOnCreate`, `canUpdateMeeting`로 분리
  - 참여 생성/수정은 자기 participant 문서와 parent meeting metadata 동기화를 요구
  - 참여 취소는 자기 participant 문서 삭제와 `participantIds` 제거가 함께 일어날 때만 허용
  - 완료된 collection group participants 조회 규칙 제거
- 남은 주의사항:
  - Firestore rules 변경 후에는 `firebase deploy --only firestore:rules`가 필요하다.
- 검증:
  - `npm run lint`, `npm run build` 통과
  - `git diff --check` 통과

### 3. Meeting Status 상수화 - 완료

- 변경:
  - `MEETING_STATUS` 상수 추가
  - status 라벨 함수를 `src/features/meetings/lib/meetingStatus.js`로 이동
  - 서비스와 화면의 직접 status 문자열 사용 제거
- 검증: 상태 라벨은 `진행중`, `확정됨`, `확정 대기`로 기존과 동일하게 표시된다.

### 4. 참여자 상세 액션 정리 - 완료

- 변경:
  - 참여자 상세 화면에서 약속 삭제 대신 `참여 취소` 표시
  - 주최자는 `수정`, `약속 삭제` 사용
  - 참여자는 `수정`, `참여 취소` 사용
  - 참여자 `수정`은 기존 참여 제출 화면(`/meetings/{meetingId}/join`)으로 이동해 제출 날짜/시간을 수정한다.
  - `조율 월` 문구를 `희망 날짜(월)`로 변경
  - 대시보드 인사말을 `{닉네임}님, 시간 되시나요?`로 변경
- 검증:
  - `npm run lint`, `npm run build` 통과

### 5. MeetingDetailPage 컴포넌트 분리

- 현재: 상세 조회, 참여자 목록, 추천 날짜, 초대 링크, 확정/삭제 액션이 한 파일에 있다.
- 목표: 화면 책임을 작은 컴포넌트로 나눈다.
- 작업:
  - `MeetingSummary`
  - `ParticipantList`
  - `RecommendedDates`
  - `MeetingDetailActions`
  - `InviteLinkField`
- 추가 후보:
  - `ParticipationSlots`
  - `ConfirmActionDialog`
- 검증: 상세 화면의 기존 기능과 모바일 레이아웃이 유지된다.

### 6. JoinMeetingPage 단계 컴포넌트 분리

- 현재: 단계 상태, 달력, 시간 입력, 확인, 제출 로직이 한 파일에 있다.
- 목표: 단계 UI와 검증 로직을 분리한다.
- 작업:
  - `JoinDateStep`
  - `JoinTimeStep`
  - `JoinReviewStep`
  - `joinValidation.js`
- 검증:
  - 날짜 선택, 선택 시간 입력, 제출 확인, 재제출이 기존처럼 동작한다.
  - 기존 참여자가 수정으로 들어왔을 때 기존 availability가 유지된다.

### 7. Shared UI 스타일 정리

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
- rules와 앱 코드가 함께 필요한 변경은 Hosting과 Firestore rules를 같은 배포 흐름에서 확인한다.
