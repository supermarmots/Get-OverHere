const authErrorMessages = {
  'app/missing-config': 'Firebase 환경변수가 설정되지 않았습니다. .env.local을 확인해 주세요.',
  'auth/email-already-in-use': '이미 가입된 이메일입니다.',
  'auth/invalid-email': '이메일 형식이 올바르지 않습니다.',
  'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
  'auth/operation-not-allowed': 'Firebase 콘솔에서 이메일 또는 Google 로그인을 활성화해 주세요.',
  'auth/popup-closed-by-user': 'Google 로그인 창이 닫혔습니다.',
  'auth/too-many-requests': '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
  'auth/user-disabled': '비활성화된 계정입니다.',
  'auth/user-not-found': '가입된 계정을 찾을 수 없습니다.',
  'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.',
  'auth/wrong-password': '이메일 또는 비밀번호가 올바르지 않습니다.',
}

export function getAuthErrorMessage(error) {
  return authErrorMessages[error.code] ?? '가입 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'
}
