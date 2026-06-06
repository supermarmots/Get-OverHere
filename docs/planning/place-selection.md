# 장소 정하기 기능 기획

## 목적

사용자가 약속 일정뿐 아니라 모임 장소도 함께 정할 수 있게 한다. 장소 정하기는 일정 조율에 종속되지 않고, 사용자가 필요한 순서대로 사용할 수 있어야 한다.

지원해야 하는 사용 흐름:

- 장소만 먼저 정하기
- 일정이 확정된 뒤 이어서 장소 정하기
- 장소를 먼저 정하고 나중에 일정 정하기
- 일정과 장소를 모두 정하지 않고 초대 링크로 의견만 모으기

## 핵심 원칙

- 일정과 장소는 독립된 결정 항목이다.
- 사용자는 약속 생성 시 `일정 정하기`, `장소 정하기`, `일정과 장소 모두 정하기` 중 선택할 수 있다.
- 장소 추천은 자동 후보를 제공하되, 최종 확정은 주최자가 한다.
- 사용자는 자동 추천과 별개로 희망 모임 장소를 직접 입력할 수 있다.
- 무료 지도 API만 사용한다.
- 출발지 정보는 민감할 수 있으므로 최소한으로 저장하고 화면에 과도하게 노출하지 않는다.

## 사용자 흐름

### 1. 약속 생성 시 선택

주최자는 약속을 만들 때 조율 항목을 선택한다.

- `일정만 정하기`
- `장소만 정하기`
- `일정과 장소 정하기`

선택에 따라 이후 단계가 달라진다.

- 일정만: 기존 날짜/시간 flow 사용
- 장소만: 출발지와 희망 장소 입력 flow 사용
- 일정과 장소: 일정 flow와 장소 flow를 순서대로 진행하거나, 생성 후 상세 화면에서 이어서 입력

### 2. 참여자 장소 응답

참여자는 초대 링크로 들어와 장소 조율에 필요한 정보를 입력한다.

입력 항목:

- 출발지: 필수
  - 예: 동네, 지하철역, 주소 일부
  - 정확한 집 주소 입력을 강제하지 않는다.
- 희망 모임 장소: 선택
  - 예: 강남역, 홍대입구역, 특정 카페명
- 장소 메모: 선택
  - 예: 주차 가능, 지하철역 근처, 조용한 곳 선호

### 3. 자동 장소 추천

앱은 주최자와 참여자의 출발지를 기준으로 중간 후보 지역을 계산한다.

기본 방식:

1. 출발지를 geocoding으로 좌표화한다.
2. 참여자 좌표의 중심점을 계산한다.
3. 중심점 근처의 역, 번화가, 카페/음식점 밀집 지역 등 후보를 가져온다.
4. 후보별 이동 부담을 계산한다.
5. 상위 후보를 보여주고, 그중 하나를 추첨 또는 추천한다.

추천 기준:

- 전체 이동 시간이 낮은 곳
- 특정 참여자에게 지나치게 먼 곳을 피하는 곳
- 수동 희망 장소와 가까운 곳
- 지도 API 사용량을 과도하게 늘리지 않는 곳

### 4. 수동 장소 입력

자동 추천 외에 주최자나 참여자는 직접 장소 후보를 입력할 수 있다.

수동 후보 예:

```js
{
  name: '강남역',
  address: '서울 강남구 강남역',
  note: '2호선/신분당선 접근 가능',
  suggestedBy: uid,
  source: 'manual'
}
```

수동 후보도 자동 추천 후보와 같은 목록에 표시한다. 단, 자동 후보와 구분할 수 있도록 `직접 입력` 표시를 둔다.

## 무료 지도 API 후보

### 1순위: OpenStreetMap 기반

- Geocoding: Nominatim
- 장소 검색: Overpass API 또는 Nominatim search
- 경로/이동시간: OSRM public demo server 또는 self-hosted OSRM 검토

장점:

- 무료로 시작 가능
- vendor lock-in이 낮음
- 지도 표시에는 Leaflet을 사용할 수 있음

주의:

- Nominatim public API는 사용량 제한과 usage policy가 엄격하다.
- 대량 요청, 자동완성처럼 잦은 호출에는 부적합하다.
- production에서는 캐싱, debounce, 요청 제한이 필요하다.

### 대안: 브라우저 링크 기반 MVP

초기 MVP에서는 지도 API 연동을 최소화하고 다음 방식으로 시작할 수 있다.

- 사용자가 입력한 출발지/희망 장소를 텍스트로 저장
- 앱 내부에서는 후보명과 메모 중심으로 표시
- 외부 지도 링크를 열어 사용자가 직접 확인

이 방식은 자동 추천 품질은 낮지만 구현과 운영 리스크가 작다.

## 추첨/추천 방식

`추첨`은 완전 랜덤보다 사용자에게 납득 가능한 추천형 추첨이 좋다.

후보별 점수:

```text
score = 이동 부담 점수 + 편차 점수 + 수동 선호 보너스 + 데이터 신뢰도 점수
```

표시 방식:

- `추천 1순위`
- `후보`
- `직접 입력`
- `추첨 결과`

주최자는 추천 결과를 보고 최종 장소를 확정한다.

## Firestore 데이터 초안

`meetings/{meetingId}`

```js
{
  coordinationTypes: ['date', 'place'],
  confirmedResult: {
    date: 'YYYY-MM-DD',
    startTime: 'HH:mm' | '',
    endTime: 'HH:mm' | ''
  } | null,
  confirmedPlace: {
    name: string,
    address: string,
    lat: number | null,
    lng: number | null,
    source: 'auto' | 'manual',
    confirmedAt: serverTimestamp(),
    confirmedBy: hostUid
  } | null
}
```

`meetings/{meetingId}/participants/{uid}`

```js
{
  uid: string,
  displayName: string,
  availability: [],
  origin: {
    label: string,
    address: string,
    lat: number | null,
    lng: number | null
  } | null,
  placeSuggestions: [
    {
      id: string,
      name: string,
      address: string,
      note: string,
      lat: number | null,
      lng: number | null,
      source: 'manual'
    }
  ]
}
```

`meetings/{meetingId}/placeCandidates/{candidateId}`

```js
{
  name: string,
  address: string,
  lat: number | null,
  lng: number | null,
  source: 'auto' | 'manual',
  score: number | null,
  travelSummary: {
    averageMinutes: number | null,
    maxMinutes: number | null
  },
  suggestedBy: uid | null,
  createdAt: serverTimestamp()
}
```

## UI 구성 초안

### 약속 생성

- 조율 항목 선택 step 추가
- 선택값에 따라 일정 step, 장소 step 노출
- 장소만 선택한 경우 날짜/시간 step 생략

### 장소 입력

- 출발지 입력
- 희망 장소 입력
- 장소 메모 입력
- 입력 주소 검색 결과 선택

### 상세 화면

- 일정 상태와 장소 상태를 분리 표시
- `확정 일정`
- `확정 장소`
- `장소 후보`
- `장소 정하기` 또는 `장소 확정하기`

### 대시보드 카드

- 일정 확정 여부
- 장소 확정 여부
- 확정 장소가 있으면 카드에 표시

## 검증 규칙

- 장소 조율을 사용하는 약속은 주최자 출발지 또는 수동 장소 후보 중 하나 이상이 필요하다.
- 참여자 출발지는 텍스트 label만으로도 저장 가능해야 한다.
- 좌표 변환 실패 시에도 수동 후보 입력은 막지 않는다.
- 확정 장소는 주최자만 저장할 수 있다.
- 확정된 장소가 있는 상태에서 다시 장소 조율을 열면 `confirmedPlace`를 초기화한다.

## 보안/개인정보 고려

- 출발지는 집 주소가 될 수 있으므로 공개 범위를 신중하게 정한다.
- 기본 UI에서는 참여자별 출발지 상세 주소를 전체 공개하지 않는다.
- 지도 API 요청 결과는 필요한 필드만 저장한다.
- 무료 API 사용량 제한을 넘지 않도록 검색 debounce와 캐싱을 둔다.
- API key가 필요한 무료 서비스는 Vite env 변수로 관리하고 `.env`에 커밋하지 않는다.

## MVP 범위

1차 구현:

- 약속 생성 시 조율 항목 선택
- 출발지 텍스트 입력
- 수동 희망 장소 입력
- 장소 후보 목록 표시
- 주최자 장소 확정
- 상세/대시보드 확정 장소 표시

2차 구현:

- Nominatim geocoding
- 좌표 기반 중심점 계산
- 자동 장소 후보 생성
- Leaflet 지도 표시

3차 구현:

- 이동 시간 기반 점수 계산
- OSRM 또는 다른 무료 routing 기반 추천
- 장소 재조율

## 범위 제외 / 다음 후보

- 유료 지도 API
- 실시간 위치 공유
- 정확한 집 주소 강제 입력
- 예약 기능
- 결제/정산 기능
