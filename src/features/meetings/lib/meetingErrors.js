const meetingErrorMessages = {
  'app/missing-config': 'Firebase 환경변수가 설정되지 않았습니다. .env 파일을 확인해 주세요.',
  'app/missing-user': '로그인 정보가 없습니다. 다시 로그인한 뒤 시도해 주세요.',
  'app/not-found': '약속을 찾을 수 없습니다.',
  'permission-denied': 'Firestore 권한이 없습니다. 보안 규칙 배포 상태를 확인해 주세요.',
  unauthenticated: '로그인이 만료되었습니다. 다시 로그인해 주세요.',
}

export function getMeetingErrorMessage(error) {
  return meetingErrorMessages[error.code] ?? '약속을 만드는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'
}
