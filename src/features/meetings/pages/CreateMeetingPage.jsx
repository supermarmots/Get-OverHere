import { useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import MeetingDatesStep from '../components/MeetingDatesStep'
import MeetingDescriptionStep from '../components/MeetingDescriptionStep'
import MeetingMonthStep from '../components/MeetingMonthStep'
import MeetingReviewStep from '../components/MeetingReviewStep'
import MeetingTimesStep from '../components/MeetingTimesStep'
import MeetingTitleStep from '../components/MeetingTitleStep'
import StepLayout from '../components/StepLayout'
import {
  createMeetingSteps,
  initialMeetingForm,
  toggleAvailabilityDate,
  updateAvailabilitySlot,
  validateMeetingForm,
  validateMeetingStep,
} from '../lib/createMeetingForm'
import { getMeetingErrorMessage } from '../lib/meetingErrors'
import { createMeeting } from '../services/meetingService'

function CreateMeetingPage({ onCancel, onSuccess }) {
  const user = useAuthStore((state) => state.user)
  const [form, setForm] = useState(initialMeetingForm)
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear())
  const [stepIndex, setStepIndex] = useState(0)
  const [error, setError] = useState('')
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const currentStep = createMeetingSteps[stepIndex]
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === createMeetingSteps.length - 1

  function updateField(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
    setError('')
  }

  function changeDisplayYear(amount) {
    setDisplayYear((year) => year + amount)
  }

  function selectTargetMonth(targetMonth) {
    setForm((currentForm) => ({
      ...currentForm,
      availability: [],
      targetMonth,
    }))
    setError('')
  }

  function toggleCancelConfirm() {
    setShowCancelConfirm((isOpen) => !isOpen)
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

  function goBack() {
    if (isFirstStep) {
      onCancel()
      return
    }

    setStepIndex((index) => index - 1)
    setError('')
  }

  async function handleNext(event) {
    event.preventDefault()

    const errors = validateMeetingStep(currentStep.id, form)

    if (errors.title || errors.targetMonth || errors.availability) {
      setError(errors.title || errors.targetMonth || errors.availability)
      return
    }

    if (!isLastStep) {
      setStepIndex((index) => index + 1)
      setError('')
      return
    }

    await submitMeeting()
  }

  async function submitMeeting() {
    const errors = validateMeetingForm(form)
    const firstError = errors.title || errors.targetMonth || errors.availability

    if (firstError) {
      setError(firstError)
      return
    }

    setIsSubmitting(true)

    try {
      const meetingId = await createMeeting({ form, host: user })
      onSuccess({ id: meetingId, title: form.title.trim() })
    } catch (error) {
      setError(getMeetingErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  function renderStep() {
    if (currentStep.id === 'title') {
      return <MeetingTitleStep form={form} onChange={updateField} />
    }

    if (currentStep.id === 'description') {
      return <MeetingDescriptionStep form={form} onChange={updateField} />
    }

    if (currentStep.id === 'targetMonth') {
      return (
        <MeetingMonthStep
          displayYear={displayYear}
          form={form}
          onChangeYear={changeDisplayYear}
          onSelectMonth={selectTargetMonth}
        />
      )
    }

    if (currentStep.id === 'dates') {
      return (
        <MeetingDatesStep
          form={form}
          onToggleDate={toggleDate}
        />
      )
    }

    if (currentStep.id === 'times') {
      return <MeetingTimesStep form={form} onChangeSlot={updateSlot} />
    }

    return <MeetingReviewStep form={form} />
  }

  return (
    <main className="step-page">
      <StepLayout
        error={error}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        isSubmitting={isSubmitting}
        onBack={goBack}
        onCancel={onCancel}
        onCancelRequest={toggleCancelConfirm}
        onNext={handleNext}
        showCancelConfirm={showCancelConfirm}
        step={currentStep}
        stepIndex={stepIndex}
      >
        {renderStep()}
      </StepLayout>
    </main>
  )
}

export default CreateMeetingPage
