export { getMeetingStatusLabel } from '../../meetings/lib/meetingStatus'

export function getMeetingParticipantLabel(meeting) {
  return `${meeting.participantIds?.length ?? meeting.participantCount ?? 0}명 참여`
}
