# 디렉토리 아키텍처

## 목적

이 프로젝트는 React, Vite, Firebase, Zustand를 기준으로 기능 단위 확장이 쉬운 구조를 사용한다. 화면, 도메인 로직, 외부 서비스, 전역 상태, 스타일, 라우트 정의를 분리해서 `App`과 개별 페이지가 비대해지는 것을 방지한다.

## 현재 기술 스택

- React 19
- Vite
- Firebase Auth
- Firebase Firestore
- Firebase Hosting
- Zustand
- CSS Modules가 아닌 전역 CSS 레이어 구조

## 최상위 정책

- `README.md`, `AGENTS.md`를 제외한 문서화용 Markdown은 `docs/` 하위에서 관리한다.
- 제품 기획 문서: `docs/product/`
- 아키텍처 문서: `docs/architecture/`
- 진행 기록과 작업 메모: `docs/project/`

## Source Structure

```text
src/
  app/
    App.jsx
  features/
    auth/
      components/
      lib/
      pages/
      services/
    dashboard/
      pages/
    landing/
      pages/
    meetings/
      components/
      lib/
      pages/
      services/
  routes/
    paths.js
  shared/
    lib/
  stores/
    authStore.js
  styles/
    main.css
    base.css
    pages.css
    auth.css
    dashboard.css
    meetings.css
  main.jsx
```

## Layer Rules

### `app/`

앱 조립과 최상위 라우트 선택만 담당한다. 페이지 UI, 폼 검증, Firebase 호출을 직접 넣지 않는다.

### `features/`

도메인 또는 기능 단위 코드를 둔다. 현재는 `auth`, `dashboard`, `landing`, `meetings`가 있다.

- `components/`: 해당 기능에서만 쓰는 UI 조각
- `pages/`: 라우트 단위 화면
- `lib/`: 검증, 에러 매핑, 순수 유틸
- `services/`: Firebase 등 외부 API 호출

### `shared/`

여러 기능에서 함께 쓰는 인프라 코드를 둔다. Firebase 초기화처럼 도메인에 종속되지 않는 코드가 여기에 해당한다.

### `stores/`

Zustand 전역 상태를 둔다. 서버 영속 데이터 전체를 복제하지 말고, 인증 사용자와 UI 전역 상태처럼 앱 전반에서 필요한 최소 상태만 관리한다.

### `routes/`

경로 상수와 리다이렉션/정규화 규칙을 둔다. 컴포넌트 내부에서 `/login`, `/signup` 같은 문자열을 직접 흩뿌리지 않는다.

### `styles/`

스타일 엔트리는 `main.css` 하나로 유지한다. 다크 테마 토큰은 `base.css`, 화면별 스타일은 목적에 맞게 분리한다.

## UI Markup Rules

- 불필요한 `div` 사용을 피한다.
- 우선순위: `main`, `section`, `header`, `nav`, `footer`, `form`, `fieldset`, `p`.
- 카드형 UI는 반복 항목, 모달, 실제 정보 묶음이 필요한 경우에만 사용한다.
- 모바일에서는 CTA와 폼 컨트롤이 터치 가능한 크기와 전체 너비를 갖도록 설계한다.

## Zustand Usage Plan

1차로 `authStore`에서 Firebase 사용자와 인증 준비 상태를 관리한다.

향후 추가 가능 store:

- `meetingStore`: 약속 생성 플로우의 임시 입력 상태
- `dashboardStore`: 대시보드 필터와 탭 상태
- `uiStore`: 전역 모달, 토스트 등 UI 상태

Firestore 원본 데이터는 가능한 서비스/구독 계층에서 가져오고, store에는 화면 간 공유가 필요한 파생 상태만 둔다.

## Import Direction

- `app`은 `features`, `routes`, `stores`를 조립할 수 있다.
- `features/*`는 `shared`, `stores`, 같은 feature 내부 모듈을 사용할 수 있다.
- `shared`는 feature에 의존하지 않는다.
- `routes`는 UI와 Firebase에 의존하지 않는다.
