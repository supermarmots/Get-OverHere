# Get Over Here


## 접속하기 

### 👉 [Get Over Here!!!](https://get-overhere.web.app/) 👈

## 프로젝트 개요
다수의 인원이 빠르고 직관적으로 일정을 조율할 수 있는 약속 일정 도우미 웹앱 서비스

## 기술스택

- React.js, Vite
- Firebase Auth, Firebase Firestore, Firebase Hosting


## 주요 기능 및 강점

**⚡ 실시간 동기화 (Real-time Sync)**
- Firebase Firestore를 활용하여 참여자들의 일정 투표 현황 및 업데이트가 즉각적으로 모든 화면에 반영됩니다.
- 주최자와 참여자 간의 지연 없는 실시간 약속 조율이 가능합니다.

**🔒 간편하고 안전한 인증 (Secure Auth)**
- 이메일/비밀번호 뿐만 아니라 Google OAuth를 통한 원클릭 소셜 로그인을 지원합니다.
- 복잡한 절차 없이 최소한의 정보로 안전하게 가입하고 서비스를 이용할 수 있습니다.

**📱 모바일 최적화 및 다크 모드 (Mobile First & Dark Theme)**
- 다양한 디바이스 환경에서 깨짐 없이 직관적으로 사용할 수 있는 반응형 웹을 제공합니다.
- 피로도를 낮추고 몰입감을 높이는 세련된 다크 테마를 기본으로 채택하였습니다.

**🔗 원클릭 공유 및 참여 (Seamless Sharing)**
- 복잡한 앱 설치 없이 고유 URL 링크 하나로 누구나 즉시 약속 방에 접속해 투표를 진행할 수 있습니다.



## 시작하기 (Getting Started)

```bash
# 1. 클론 및 의존성 설치
git clone <repository-url>
cd getoverhere
npm install

# 2. 로컬 서버 실행 (Web 앱)
npm run dev 

# 3. 빌드
npm run build

# 4. Firebase 배포
firebase deploy

# 5. Firestore 보안 규칙만 배포
firebase deploy --only firestore:rules

```
