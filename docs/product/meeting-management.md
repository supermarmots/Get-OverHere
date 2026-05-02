# 약속 조회/수정/삭제 기획

## 목적

주최자와 참여자가 약속 상세 화면에서 약속 정보, 참여자, 추천 날짜, 초대 링크, 내 가능 일정을 확인하고 필요한 액션을 수행할 수 있게 한다.

## 현재 사용자 흐름

1. 대시보드 약속 카드를 누른다.
2. `/meetings/{meetingId}` 상세 화면으로 이동한다.
3. 약속 제목, 설명, 상태, 희망 날짜(월), 참여자, 초대 링크, 추천 날짜, 내 가능 일정을 확인한다.
4. 주최자는 `확정하기`, `수정`, `약속 삭제`를 사용할 수 있다.
5. 참여자는 `수정`, `참여 취소`를 사용할 수 있다.
6. 주최자의 `수정`은 `/meetings/{meetingId}/edit`로 이동한다.
7. 참여자의 `수정`은 `/meetings/{meetingId}/join`으로 이동해 기존 응답을 수정한다.
8. 삭제/참여 취소는 확인 dialog 후 처리한다.

## 상세 화면 구성

- 뒤로가기 버튼
- 약속 제목
- 상태
- 설명
- 희망 날짜(월)
- 참여자 수와 참여자 이름 목록
- 초대 링크와 복사 버튼
- 추천 날짜 영역
- 내 가능 일정
- 하단 액션

## 액션 권한

### 주최자

- `확정하기`: `collecting` 상태를 `confirmed`로 변경
- `수정`: 약속 기본 정보와 주최자 가능 일정 수정
- `약속 삭제`: soft delete

### 참여자

- `수정`: join flow로 이동해 내 availability 수정
- `참여 취소`: participant 문서를 삭제하고 parent meeting의 `participantIds`에서 uid 제거

주최자의 participant 문서는 삭제할 수 없다.

## 수정 화면

1차 구현은 단계형 생성 UI를 재사용하지 않고 한 화면 편집으로 유지한다.

- 약속 제목
- 설명
- 희망 날짜(월)
- 내 가능 날짜/시간

희망 날짜(월)을 바꾸면 기존 가능 일정은 해당 월과 맞지 않을 수 있으므로 초기화한다.

## 삭제 정책

Firestore 클라이언트에서 서브컬렉션 hard delete를 안전하게 처리하기 어렵기 때문에 meeting 삭제는 soft delete다.

```js
{
  status: 'deleted',
  deletedAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

대시보드와 상세 조회는 deleted 약속을 숨긴다.

## 완료된 범위

- [x] `/meetings/{meetingId}` 상세 route/page
- [x] `/meetings/{meetingId}/edit` 수정 route/page
- [x] 상세 조회 service
- [x] 수정 service
- [x] soft delete service
- [x] 삭제 확인 dialog
- [x] 카드 전체 클릭으로 상세 진입
- [x] 초대 링크 복사
- [x] 참여자 목록 구독
- [x] 추천 날짜 표시
- [x] 주최자 확정 액션
- [x] 참여자 수정/취소 액션
- [x] 확정 약속 재개최 액션

## 범위 제외 / 다음 후보

- 상세 화면 컴포넌트 분리
- 확정 날짜/시간 선택 저장
- 서브컬렉션 hard delete
- 수정 화면 단계형 UX
- 참여자별 응답 상세 보기
