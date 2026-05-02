# 약속 만들기 플로우 기획

## 목적

주최자가 약속 방을 만들고 본인의 가능한 날짜와 시간대를 입력하는 단계형 플로우다. 생성된 약속은 초대 링크로 공유되고, 참여자 응답이 모이면 상세 화면에서 추천 날짜를 확인한다.

## 현재 사용자 흐름

1. 대시보드에서 `새 약속`을 누른다.
2. `/meetings/new`로 이동한다.
3. 약속 제목을 입력한다.
4. 약속 설명을 선택적으로 입력한다.
5. 희망 날짜의 월을 선택한다.
6. 해당 월에서 가능한 날짜를 선택한다.
7. 선택한 날짜별 가능한 시간을 선택적으로 입력한다.
8. 입력 내용을 확인하고 `약속 만들기`를 누른다.
9. Firestore batch로 meeting 문서와 주최자 participant 문서를 함께 생성한다.
10. `/meetings/{meetingId}/invite`로 이동해 초대 링크를 공유한다.

## 입력 항목

- 약속 제목: 필수
- 약속 설명: 선택
- 희망 날짜(월): 필수, `YYYY-MM`
- 내 가능 일정: 최소 1개 필수
  - 날짜: 필수, `YYYY-MM-DD`
  - 시작 시간: 선택, `HH:mm` 또는 빈 문자열
  - 종료 시간: 선택, `HH:mm` 또는 빈 문자열

## UI 원칙

- 다크 테마 유지
- 모바일 우선 단일 컬럼 단계형 폼
- 한 단계에 하나의 주된 입력만 둔다.
- 상단에는 취소 버튼과 진행률을 배치한다.
- 취소 버튼 클릭 시 확인 dialog를 띄운다.
- 하단 고정 CTA로 이전/다음/생성을 제공한다.
- 가능한 날짜는 직접 만든 월 캘린더 UI로 선택한다.
- 기본 날짜 버튼 배경은 제거하고, 선택된 날짜만 강조한다.
- 가능한 시간 입력은 선택 사항이며 비워두면 `시간 미정`으로 표시한다.

## 단계 구성

1. 약속 제목
2. 약속 설명 선택 입력
3. 희망 날짜(월) 선택
4. 가능한 날짜 선택
5. 가능한 시간 선택
6. 입력 내용 확인

## Firestore 데이터

`meetings/{meetingId}`

```js
{
  title: string,
  description: string,
  hostId: string,
  targetMonth: 'YYYY-MM',
  status: 'collecting',
  participantIds: [hostUid],
  recommendation: null,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

`meetings/{meetingId}/participants/{hostUid}`

```js
{
  uid: string,
  displayName: string,
  role: 'host',
  availability: [
    {
      id: string,
      date: 'YYYY-MM-DD',
      startTime: 'HH:mm' | '',
      endTime: 'HH:mm' | ''
    }
  ],
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

## 검증 규칙

- 제목은 공백 제외 1자 이상
- 희망 날짜(월)는 필수
- 가능 일정은 최소 1개
- 각 가능 일정 날짜는 희망 날짜(월)에 포함되어야 함
- 시간을 입력하는 경우 시작 시간과 종료 시간을 모두 입력해야 함
- 종료 시간은 시작 시간보다 늦어야 함

## 완료된 범위

- [x] `/meetings/new` route
- [x] 단계형 생성 page
- [x] 단계별 컴포넌트 분리
- [x] 생성/검증 유틸 분리
- [x] Firestore batch 생성 service
- [x] 주최자를 participant로 함께 저장
- [x] 생성 성공 후 초대 공유 화면으로 이동
- [x] 생성 오류 메시지 처리
- [x] lint/build 검증

## 범위 제외 / 다음 후보

- 반복 약속
- 여러 달에 걸친 후보 날짜
- 위치/장소 입력
- 캘린더 라이브러리 도입
- 생성 중 임시 저장
