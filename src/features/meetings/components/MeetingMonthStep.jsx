const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1)

function formatTargetMonth(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`
}

function MeetingMonthStep({ displayYear, form, onChangeYear, onSelectMonth }) {
  return (
    <fieldset className="step-field">
      <legend>조율할 월</legend>
      <nav className="month-picker__nav" aria-label="연도 선택">
        <button type="button" className="text-button" onClick={() => onChangeYear(-1)}>
          이전 해
        </button>
        <strong>{displayYear}년</strong>
        <button type="button" className="text-button" onClick={() => onChangeYear(1)}>
          다음 해
        </button>
      </nav>
      <ol className="month-picker">
        {monthOptions.map((month) => {
          const targetMonth = formatTargetMonth(displayYear, month)

          return (
            <li key={targetMonth}>
              <button
                type="button"
                className="month-picker__month"
                aria-pressed={form.targetMonth === targetMonth}
                onClick={() => onSelectMonth(targetMonth)}
              >
                {month}월
              </button>
            </li>
          )
        })}
      </ol>
    </fieldset>
  )
}

export default MeetingMonthStep
