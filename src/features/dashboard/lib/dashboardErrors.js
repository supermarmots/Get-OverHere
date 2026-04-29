const dashboardErrorMessages = {
  'app/missing-config': 'Firebase 환경변수가 설정되지 않았습니다. .env 파일을 확인해 주세요.',
  'app/missing-user': '로그인 정보가 없습니다. 다시 로그인한 뒤 시도해 주세요.',
  'failed-precondition': '대시보드 목록을 불러오기 위한 Firestore 인덱스가 필요합니다.',
  'permission-denied': '약속 목록을 읽을 권한이 없습니다. Firestore 규칙을 확인해 주세요.',
}

export function getDashboardErrorMessage(error) {
  return dashboardErrorMessages[error.code] ?? '약속 목록을 불러오지 못했습니다.'
}
