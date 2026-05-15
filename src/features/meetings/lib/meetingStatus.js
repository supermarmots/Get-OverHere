export const MEETING_STATUS = {
  collecting: 'collecting',
  confirmed: 'confirmed',
}

export function getMeetingStatusLabel(status) {
  if (status === MEETING_STATUS.collecting) {
    return '진행중'
  }

  if (status === MEETING_STATUS.confirmed) {
    return '확정됨'
  }

  return '확정 대기'
}
