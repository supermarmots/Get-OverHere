import { getMonthCalendar, getTargetMonthLabel } from '../lib/createMeetingForm'

const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토']

function getDayLabel(date) {
  return String(Number(date.slice(-2)))
}

function MeetingDatesStep({ form, onToggleDate }) {
  const selectedDates = new Set(form.availability.map((slot) => slot.date))
  const calendarItems = getMonthCalendar(form.targetMonth)

  return (
    <fieldset className="step-field">
      <legend>가능한 날짜</legend>
      <p>{getTargetMonthLabel(form.targetMonth)}</p>
      <p>가능한 날짜를 눌러 선택하거나 해제해 주세요.</p>

      <section className="date-picker" aria-label={`${form.targetMonth} 가능한 날짜`}>
        <header className="date-picker__weekdays">
          {weekdayLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </header>
        <ol className="date-picker__grid">
          {calendarItems.map((date, index) => {
            if (!date) {
              return <li className="date-picker__empty" key={`empty-${index}`} />
            }

            return (
              <li key={date}>
                <button
                  type="button"
                  className="date-picker__day"
                  aria-pressed={selectedDates.has(date)}
                  onClick={() => onToggleDate(date)}
                >
                  {getDayLabel(date)}
                </button>
              </li>
            )
          })}
        </ol>
      </section>
    </fieldset>
  )
}

export default MeetingDatesStep
