# 약속 참여 플로우 기획

## 목적

초대 링크를 받은 사용자가 가능한 날짜와 시간을 제출해 추천 날짜 계산에 참여하게 한다. 참여 응답은 `meetings/{meetingId}/participants/{uid}`에 저장한다.

## 현재 사용자 흐름

1. 사용자가 `/meetings/{meetingId}/join` 링크로 들어온다.
2. 로그인 상태가 아니면 로그인 화면으로 이동한다.
3. 로그인/회원가입 후 원래 join route로 돌아온다.
4. 약속 제목, 설명, 희망 날짜(월), 주최자 가능 날짜를 확인한다.
5. 같은 월 안에서 가능한 날짜를 선택한다.
6. 필요하면 선택한 날짜별 시간을 입력한다.
7. 제출 내용을 확인한다.
8. 제출하면 현재 로그인 사용자 이름으로 응답을 저장한다.
9. 기존 참여자가 다시 들어오면 기존 availability를 불러와 수정한다.
10. 제출 완료 후 대시보드로 이동할 수 있다.

## 데이터 기준

- 약속 정보: `meetings/{meetingId}`
- 주최자 가능 날짜: `meetings/{meetingId}/participants/{hostId}.availability`
- 참여자 응답: `meetings/{meetingId}/participants/{uid}`
- 참여자 응답 필드: `uid`, `availability`, `displayName`, `role`, `createdAt`, `updatedAt`
- 새 참여자는 parent meeting의 `participantIds`에 uid를 추가한다.
- 기존 참여자 수정 시 기존 `role`을 유지한다.
- 주최자가 join route로 제출해도 `host` role을 유지한다.

## UI 원칙

- 참여 화면은 `날짜 선택 -> 시간 선택 -> 제출 확인` 단계형 UI다.
- 주최자 가능 날짜는 선택 제한이 아니라 참고 표시로만 사용한다.
- 참여자 이름을 별도로 입력받지 않는다. Firebase Auth 사용자 정보를 사용한다.
- 가능한 시간 입력은 선택 사항이다.

## 완료된 범위

- [x] `/meetings/{meetingId}/join` route
- [x] 참여 page
- [x] 주최자 가능 날짜 참고 표시
- [x] 같은 월 전체 날짜 선택 허용
- [x] 선택 시간 입력
- [x] 제출 확인 단계
- [x] 참여자 응답 저장 service
- [x] 기존 응답 수정
- [x] 로그인 redirect 보존
- [x] 참여 취소 flow
- [x] Firestore rules에서 participant create/update/delete 보호
- [x] lint/build 검증

## 범위 제외 / 다음 후보

- 비로그인 게스트 참여
- 참여자별 응답 공개/비공개 설정
- 참석 불가 표시
- 시간대별 추천
