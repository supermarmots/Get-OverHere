import MeetingCard from './MeetingCard'

function MeetingListSection({ description, meetings = [], onOpenMeeting, title }) {
  const hasMeetings = meetings.length > 0

  return (
    <section className="meeting-list" aria-labelledby={`${title}-title`}>
      <header className="meeting-list__header">
        <h3 id={`${title}-title`}>{title}</h3>
        <span>{meetings.length}개</span>
      </header>

      {hasMeetings && (
        <ol className="meeting-list__items">
          {meetings.map((meeting) => (
            <li key={meeting.id}>
              <MeetingCard meeting={meeting} onOpen={onOpenMeeting} />
            </li>
          ))}
        </ol>
      )}

      {!hasMeetings && <p className="meeting-list__empty">{description}</p>}
    </section>
  )
}

export default MeetingListSection
