import { getDateWithWeekdayLabel } from '../lib/createMeetingForm'

function MeetingReviewStep({ form }) {
  return (
    <section className="meeting-review" aria-label="약속 생성 확인">
      <p>
        <strong>약속 이름</strong>
        <span>{form.title}</span>
      </p>
      <p>
        <strong>설명</strong>
        <span>{form.description || '입력하지 않음'}</span>
      </p>
      <p>
        <strong>조율 월</strong>
        <span>{form.targetMonth}</span>
      </p>
      <section className="meeting-review__slots" aria-label="가능 일정">
        <h2>가능 일정</h2>
        <ul className="step-list">
          {form.availability.map((slot) => (
            <li key={slot.id}>
              <span>{getDateWithWeekdayLabel(slot.date)}</span>
              <span>{getTimeLabel(slot)}</span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}

function getTimeLabel(slot) {
  if (!slot.startTime && !slot.endTime) {
    return '시간 미정'
  }

  return `${slot.startTime} - ${slot.endTime}`
}

export default MeetingReviewStep
