function MeetingTitleStep({ form, onChange }) {
  return (
    <label className="step-field">
      약속 이름
      <input
        type="text"
        name="title"
        value={form.title}
        onChange={onChange}
        placeholder="예: 5월 저녁 모임"
        autoFocus
      />
    </label>
  )
}

export default MeetingTitleStep
