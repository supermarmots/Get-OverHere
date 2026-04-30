function MeetingTimesStep({ form, onChangeSlot }) {
  return (
    <fieldset className="step-field">
      <legend>가능한 시간</legend>
      <p>시간을 정하지 않아도 괜찮습니다. 가능한 시간대가 있으면 입력해 주세요.</p>

      {form.availability.map((slot) => (
        <fieldset className="time-row" key={slot.id}>
          <legend>{slot.date}</legend>
          <div className="time-row__inputs">
            <label>
              시작
              <input
                type="time"
                value={slot.startTime}
                onChange={(event) => onChangeSlot(slot.id, 'startTime', event.target.value)}
              />
            </label>
            <label>
              종료
              <input
                type="time"
                value={slot.endTime}
                onChange={(event) => onChangeSlot(slot.id, 'endTime', event.target.value)}
              />
            </label>
          </div>
          <button
            type="button"
            className="text-button time-row__reset"
            disabled={!slot.startTime && !slot.endTime}
            onClick={() => {
              onChangeSlot(slot.id, 'startTime', '')
              onChangeSlot(slot.id, 'endTime', '')
            }}
          >
            초기화
          </button>
        </fieldset>
      ))}
    </fieldset>
  )
}

export default MeetingTimesStep
