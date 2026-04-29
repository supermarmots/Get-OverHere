import { getMeetingParticipantLabel, getMeetingStatusLabel } from '../lib/meetingFormat'

function MeetingCard({ actionLabel, canUseAction, meeting, onAction, onOpen }) {
  const showAction = actionLabel && onAction && canUseAction?.(meeting)

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
          <dt>희망 날짜(월)</dt>
          <dd>{meeting.targetMonth}</dd>
        </div>
        <div>
          <dt>참여자</dt>
          <dd>{getMeetingParticipantLabel(meeting)}</dd>
        </div>
      </dl>
      {showAction && (
        <button
          type="button"
          className="text-button meeting-card__button"
          onClick={(event) => {
            event.stopPropagation()
            onAction(meeting)
          }}
        >
          {actionLabel}
        </button>
      )}
    </article>
  )
}

export default MeetingCard
