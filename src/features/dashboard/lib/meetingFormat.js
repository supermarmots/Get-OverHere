export { getMeetingStatusLabel } from '../../meetings/lib/meetingStatus'

export function getMeetingParticipantLabel(meeting) {
  return `${meeting.participantCount ?? 0}명 참여`
}
