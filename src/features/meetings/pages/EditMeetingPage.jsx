import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import MeetingDatesStep from '../components/MeetingDatesStep'
import MeetingTimesStep from '../components/MeetingTimesStep'
import {
  createMeetingFormFromMeeting,
  initialMeetingForm,
  toggleAvailabilityDate,
  updateAvailabilitySlot,
  validateMeetingForm,
} from '../lib/createMeetingForm'
import { getMeetingErrorMessage } from '../lib/meetingErrors'
import { getMeeting, updateMeeting } from '../services/meetingService'

function EditMeetingPage({ meetingId, onCancel, onSaved }) {
  const user = useAuthStore((state) => state.user)
  const [form, setForm] = useState(initialMeetingForm)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadMeeting() {
      if (isMounted) {
        setForm(initialMeetingForm)
        setError('')
        setLoadError('')
        setIsLoading(true)
      }

      try {
        const meeting = await getMeeting({ meetingId, userId: user.uid })

        if (isMounted) {
          setForm(createMeetingFormFromMeeting(meeting))
          setError('')
        }
      } catch (loadError) {
        if (isMounted) {
          setLoadError(getMeetingErrorMessage(loadError))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadMeeting()

    return () => {
      isMounted = false
    }
  }, [meetingId, user.uid])

  function updateField(event) {
    const { name, value } = event.target
    setForm((currentForm) => {
      if (name === 'targetMonth') {
        return { ...currentForm, targetMonth: value, availability: [] }
      }

      return { ...currentForm, [name]: value }
    })
    setError('')
  }

  function toggleDate(date) {
    setForm((currentForm) => ({
      ...currentForm,
      availability: toggleAvailabilityDate(currentForm.availability, date),
    }))
    setError('')
  }

  function updateSlot(slotId, field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      availability: updateAvailabilitySlot(currentForm.availability, slotId, field, value),
    }))
    setError('')
  }

  async function saveMeeting(event) {
    event.preventDefault()

    const errors = validateMeetingForm(form)
    const firstError = errors.title || errors.targetMonth || errors.availability

    if (firstError) {
      setError(firstError)
      return
    }

    setIsSubmitting(true)

    try {
      await updateMeeting({ form, meetingId, user })
      onSaved(meetingId)
    } catch (saveError) {
      setError(getMeetingErrorMessage(saveError))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadError) {
    return (
      <main className="meeting-detail">
        <p className="form-status form-status--error">{loadError}</p>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="meeting-detail">
        <p className="landing__eyebrow">약속을 불러오는 중</p>
      </main>
    )
  }

  return (
    <main className="meeting-detail">
      <form className="meeting-edit" onSubmit={saveMeeting} noValidate>
        <header className="meeting-detail__header">
          <button type="button" className="text-button" onClick={onCancel}>
            취소
          </button>
          <h1>약속 수정</h1>
        </header>

        <label className="step-field">
          약속 이름
          <input type="text" name="title" value={form.title} onChange={updateField} />
        </label>

        <label className="step-field">
          설명
          <textarea name="description" value={form.description} onChange={updateField} rows="4" />
        </label>

        <label className="step-field">
          희망 날짜(월)
          <input type="month" name="targetMonth" value={form.targetMonth} onChange={updateField} />
        </label>

        <MeetingDatesStep form={form} onToggleDate={toggleDate} />
        <MeetingTimesStep form={form} onChangeSlot={updateSlot} />

        {error && <p className="form-status form-status--error">{error}</p>}

        <footer className="meeting-detail__actions meeting-edit__actions">
          <button
            type="submit"
            className="landing__login meeting-edit__submit"
            disabled={isSubmitting}
          >
            저장
          </button>
        </footer>
      </form>
    </main>
  )
}

export default EditMeetingPage
