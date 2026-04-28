# Get Over Here

## 프로젝트 개요
다수의 인원이 빠르고 직관적으로 일정을 조율할 수 있는 약속 일정 도우미 웹앱 서비스입니다.

## 기술스택

- React.js, Vite
- Firebase Auth, Firebase Firestore, Firebase Hosting


## 주요기능

**회원 시스템** (모든 사용자 필수 가입, 최소 정보만 수집)
- 아이디(이메일 or 휴대폰번호 or 임의문자열) + 비밀번호 입력을 통한 간편 회원가입
- 프로필(이름, 닉네임) 설정

**약속 조율 (주최자)**
- 캘린더를 통한 약속 일정 후보 날짜 및 가능 시간대 선택 (약속 방 생성)
- 고유 링크(URL)를 통한 참여자 초대
- 유력한 후보 날짜 실시간 모니터링
- 유력한 후보 날짜 시간대 최종 선정 (확정)

**약속 참여 (참여자)**
- 공유받은 초대 링크를 통해 접속
- 본인의 가능 시간대 선택 및 투표

## 화면
- 로그인
- 메인 대시보드
- 약속 생성
- 약속 참여
- 약속 결과 조회
- 약속 수정
- 약속 삭제

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

```