function MeetingTimesStep({ form, onChangeSlot }) {
  return (
    <fieldset className="step-field">
      <legend>가능한 시간</legend>
      <p>시간을 정하지 않아도 괜찮습니다. 가능한 시간대가 있으면 입력해 주세요.</p>

      {form.availability.map((slot) => (
        <fieldset className="time-row" key={slot.id}>
          <legend>{slot.date}</legend>
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
        </fieldset>
      ))}
    </fieldset>
  )
}

export default MeetingTimesStep
