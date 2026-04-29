import { getMeetingParticipantLabel, getMeetingStatusLabel } from '../lib/meetingFormat'

function MeetingCard({ meeting, onOpen }) {
  return (
    <article
      className="meeting-card"
      role="button"
      tabIndex="0"
      onClick={() => onOpen(meeting.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(meeting.id)
        }
      }}
    >
      <header className="meeting-card__header">
        <h4>{meeting.title}</h4>
        <span>{getMeetingStatusLabel(meeting.status)}</span>
      </header>
      <dl className="meeting-card__meta">
        <div>
          <dt>조율 월</dt>
          <dd>{meeting.targetMonth}</dd>
        </div>
        <div>
          <dt>참여자</dt>
          <dd>{getMeetingParticipantLabel(meeting)}</dd>
        </div>
      </dl>
    </article>
  )
}

export default MeetingCard
