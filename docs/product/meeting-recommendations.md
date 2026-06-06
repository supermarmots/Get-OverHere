# 약속 추천 날짜 기획

## 목적

참여자 가능 일정 데이터를 약속 상세 화면 진입 시 집계해 가장 많은 사람이 가능한 날짜 후보를 보여준다.

## 현재 사용자 흐름

1. 사용자가 대시보드에서 약속 상세 화면으로 들어간다.
2. 상세 화면에서 `추천 날짜` 영역을 확인한다.
3. 참여자 응답이 2명 이상이면 availability를 집계해 득표가 높은 날짜 최대 3개를 표시한다.
4. 후보가 없으면 빈 상태 메시지를 보여준다.
5. 주최자는 `확정하기`에서 추천 후보 중 하나를 선택하고, 필요하면 시작/종료 시간을 입력한다.
6. 확정 결과는 meeting 문서에 저장되고 상세 화면과 대시보드 확정 카드에 표시된다.

## 추천 기준

- 입력 데이터: `meetings/{meetingId}/participants/*`의 `availability`
- 집계 단위: 날짜
- 점수: 해당 날짜를 선택한 참여자 수
- 표시 조건: 참여자 2명 이상
- 정렬:
  - 1순위: 참여자 수 높은 순
  - 2순위: 날짜 빠른 순
- 최대 표시 개수: 3개

같은 참여자가 같은 날짜에 여러 시간대를 입력해도 날짜 득표는 1표로 계산한다.

## 화면 구성

- 제목: `추천 날짜`
- 상태 배지: `자동 계산`
- 후보 항목:
  - 날짜와 요일
  - 가능한 참여자 수
- 빈 상태:
  - 참여자 수가 부족하거나 겹치는 날짜가 없다는 안내

## Firestore 작업

- `meetings/{meetingId}/participants` 서브컬렉션 조회
- 클라이언트에서 날짜별 집계
- 추천 결과 자체는 저장하지 않고 화면에서 계산한다.
- 최종 확정 결과는 `meetings/{meetingId}.confirmedResult`에 저장한다.

```js
{
  confirmedResult: {
    date: 'YYYY-MM-DD',
    startTime: 'HH:mm' | '',
    endTime: 'HH:mm' | '',
    confirmedAt: serverTimestamp(),
    confirmedBy: hostUid
  },
  status: 'confirmed',
  updatedAt: serverTimestamp()
}
```

## 완료된 범위

- [x] 참여자 availability 조회 service
- [x] 날짜 후보 계산 유틸
- [x] 참여자 2명 이상일 때 추천 날짜 최대 3개 표시
- [x] 빈 상태 UI
- [x] 주최자 확정 날짜/시간 저장 액션
- [x] 확정 결과 상세/대시보드 표시
- [x] 재개최 시 확정 결과 초기화
- [x] lint/build 검증

## 범위 제외 / 다음 후보

- 시간대별 추천
- 추천 결과 Firestore 저장
- 알림/공유 기능
