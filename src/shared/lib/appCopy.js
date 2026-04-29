export const SERVICE_NAME = 'Get Over Here'

export const AUTH_COPY = {
  brand: SERVICE_NAME,
  googleContinue: 'Google로 계속하기',
  login: '로그인',
  processing: '처리 중',
  signup: '가입하기',
}

export function getSubmitLabel(isSubmitting, idleLabel) {
  if (isSubmitting) {
    return AUTH_COPY.processing
  }

  return idleLabel
}

export const DASHBOARD_COPY = {
  createMeeting: '약속 만들기',
  emptyRealtimeNotice: '약속 목록은 Firestore 연결 후 실시간으로 표시됩니다.',
  greetingSuffix: '님, 약속을 조율해 볼까요?',
  joinWithInvite: '초대 링크로 참여',
  logout: '로그아웃',
  logoutError: '로그아웃 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  meetingsTitle: '내 약속',
  profile: '마이페이지',
}

export const DEFAULT_USER_NAME = '사용자'
