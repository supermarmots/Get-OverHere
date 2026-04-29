import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import MeetingDatesStep from '../components/MeetingDatesStep'
import MeetingTimesStep from '../components/MeetingTimesStep'
import {
  createEmptyAvailability,
  createMeetingFormFromMeeting,
  initialMeetingForm,
  validateMeetingForm,
} from '../lib/createMeetingForm'
import { getMeetingErrorMessage } from '../lib/meetingErrors'

function EditMeetingPage({ meetingId, onCancel, onSaved }) {
  const user = useAuthStore((state) => state.user)
  const [form, setForm] = useState(initialMeetingForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadMeeting() {
      try {
        const { getMeeting } = await import('../services/meetingService')
        const meeting = await getMeeting({ meetingId, userId: user.uid })

        if (isMounted) {
          setForm(createMeetingFormFromMeeting(meeting))
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getMeetingErrorMessage(loadError))
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
      availability: currentForm.availability.map((slot) => {
        if (slot.id !== slotId) {
          return slot
        }

        return { ...slot, [field]: value }
      }),
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
      const { updateMeeting } = await import('../services/meetingService')
      await updateMeeting({ form, meetingId, user })
      onSaved(meetingId)
    } catch (saveError) {
      setError(getMeetingErrorMessage(saveError))
    } finally {
      setIsSubmitting(false)
    }
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
          조율 월
          <input type="month" name="targetMonth" value={form.targetMonth} onChange={updateField} />
        </label>

        <MeetingDatesStep form={form} onToggleDate={toggleDate} />
        <MeetingTimesStep form={form} onChangeSlot={updateSlot} />

        {error && <p className="form-status form-status--error">{error}</p>}

        <footer className="meeting-detail__actions">
          <button type="submit" className="landing__login" disabled={isSubmitting}>
            저장
          </button>
        </footer>
      </form>
    </main>
  )
}

function toggleAvailabilityDate(availability, date) {
  const hasDate = availability.some((slot) => slot.date === date)

  if (hasDate) {
    return availability.filter((slot) => slot.date !== date)
  }

  return [...availability, createEmptyAvailability(date)]
}

export default EditMeetingPage
