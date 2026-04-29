function MeetingDescriptionStep({ form, onChange }) {
  return (
    <label className="step-field">
      설명
      <textarea
        name="description"
        value={form.description}
        onChange={onChange}
        placeholder="장소 후보나 참고할 내용을 적어주세요."
        rows="5"
      />
    </label>
  )
}

export default MeetingDescriptionStep
