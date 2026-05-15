# 디렉토리 아키텍처

## 목적

Get Over Here는 React 19 + Vite 기반의 약속 일정 조율 앱이다. Firebase Auth, Firestore, Firebase Hosting, Zustand를 사용하며, 기능 단위 폴더 구조로 화면과 도메인 로직을 분리한다.

이 문서는 현재 구현 기준의 디렉토리 역할과 작업 규칙을 정리한다.

## 현재 기술 스택

- React 19
- Vite
- React Router
- Firebase Auth
- Firebase Firestore
- Firebase Hosting
- Zustand
- 전역 CSS 레이어 구조

## 문서 위치 정책

- 루트에 둘 수 있는 Markdown: `README.md`, `AGENTS.md`
- 제품 문서: `docs/product/`
- 아키텍처 문서: `docs/architecture/`
- 약점/보안/기술 부채 점검: `docs/audit/`
- 진행 기록, 회고, 다음 작업: `docs/project/`
- 리팩토링 로드맵: `docs/refactor/`

## 현재 Source Structure

```text
src/
  app/
    App.jsx
    useFirebaseAuth.js
  features/
    auth/
      components/
      lib/
      pages/
      services/
    dashboard/
      components/
      lib/
      pages/
      services/
    landing/
      pages/
    meetings/
      components/
      lib/
      pages/
      services/
  hooks/
    useAuthRedirect.js
  routes/
    AppRoutes.jsx
    paths.js
    routeState.js
  shared/
    lib/
      appCopy.js
      firebase.js
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

### `src/app/`

앱 조립만 담당한다.

- `App.jsx`: `BrowserRouter`와 `AppRoutes` 연결, Firebase Auth 구독 hook 실행
- `useFirebaseAuth.js`: Firebase Auth 상태를 Zustand store에 반영

페이지 UI, 폼 검증, Firebase CRUD를 `App.jsx`에 넣지 않는다.

### `src/routes/`

React Router 라우트 정의와 경로 helper를 둔다.

- `AppRoutes.jsx`: 라우트별 page 컴포넌트 연결과 navigate callback 구성
- `paths.js`: route 상수, meeting path helper, protected route 판별
- `routeState.js`: 로그인/회원가입 후 원래 목적지로 돌아가기 위한 redirect state 정규화

얇은 route adapter 파일은 제거했다. 별도 파일을 다시 만들기보다, route 연결 로직은 `AppRoutes.jsx`에서 작게 유지한다.

### `src/features/`

도메인 또는 기능 단위 코드를 둔다.

- `components/`: 해당 feature 안에서 재사용되는 UI 조각
- `pages/`: 라우트 단위 화면
- `lib/`: 검증, 에러 매핑, 포맷팅, 순수 유틸
- `services/`: Firebase 등 외부 서비스 호출

현재 feature:

- `auth`: 로그인, 회원가입, OAuth, 사용자 프로필 생성
- `landing`: 비로그인 랜딩 페이지
- `dashboard`: 로그인 후 약속 목록과 시작 액션
- `meetings`: 약속 생성, 초대 공유, 상세, 수정, 참여, 추천 날짜

### `src/shared/`

여러 feature에서 함께 사용하는 인프라와 작은 공통 상수를 둔다.

- Firebase 초기화
- 서비스명/공통 copy처럼 여러 feature에서 쓰는 작은 값

큰 UI 추상화나 도메인 로직을 `shared`로 성급하게 올리지 않는다.

### `src/stores/`

Zustand 전역 상태를 둔다. 현재는 인증 사용자와 인증 준비 상태만 관리한다.

Firestore 원본 데이터를 전역 store에 복제하지 않는다. 약속 목록과 상세 데이터는 service/subscription 계층에서 가져오고 각 page state로 유지한다.

### `src/styles/`

`main.css`가 스타일 엔트리이며, 파일별 역할을 유지한다.

- `base.css`: 토큰, reset, 타이포그래피, 다크 테마 기본값
- `pages.css`: 랜딩 등 일반 page 레이아웃
- `auth.css`: 로그인/회원가입/공통 버튼 스타일
- `dashboard.css`: 대시보드와 약속 카드 스타일
- `meetings.css`: 약속 생성/상세/참여/모달 스타일

## UI Markup Rules

- `main`, `section`, `header`, `nav`, `footer`, `form`, `fieldset`, `p` 중심의 시맨틱 HTML을 우선한다.
- 불필요한 `div`는 피한다.
- 카드형 UI는 반복 목록 항목, 모달, 실제 정보 묶음에만 사용한다.
- 다크 테마가 기본이다.
- 모바일 우선으로 작성하되, 대시보드의 `약속 현황`은 1행 3열, 주요 액션은 1행 2열을 유지한다.

## Import Direction

- `app`은 `routes`, `stores`, app hook을 조립할 수 있다.
- `routes`는 page 컴포넌트와 route helper를 연결할 수 있다.
- `features/*`는 `shared`, `stores`, 같은 feature 내부 모듈을 사용할 수 있다.
- `shared`는 feature에 의존하지 않는다.
- Firebase 호출은 page에서 직접 작성하지 말고 feature service로 분리한다.

## 검증 명령

문서만 수정해도 앱 구조와 맞는지 확인하기 위해 가능하면 다음을 실행한다.

```bash
npm run lint
npm run build
```
