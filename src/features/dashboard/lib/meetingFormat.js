export function getMeetingStatusLabel(status) {
  if (status === 'collecting') {
    return '투표 중'
  }

  if (status === 'confirmed') {
    return '확정됨'
  }

  return '확정 대기'
}

export function getMeetingParticipantLabel(meeting) {
  return `${meeting.participantCount ?? 0}명 참여`
}
