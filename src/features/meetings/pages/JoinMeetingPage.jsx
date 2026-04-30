import { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import MeetingTimesStep from '../components/MeetingTimesStep'
import {
  getAvailabilityTimeLabel,
  getAvailabilityTimeValidationMessage,
  getDateWithWeekdayLabel,
  getMonthCalendar,
  getTargetMonthLabel,
  toggleAvailabilityDate,
  updateAvailabilitySlot,
} from '../lib/createMeetingForm'
import { getMeetingErrorMessage } from '../lib/meetingErrors'
import { getMeetingJoinData, submitMeetingParticipation } from '../services/meetingService'

const joinSteps = [
  {
    id: 'dates',
    title: '가능한 날짜를 선택해 주세요',
  },
  {
    id: 'times',
    title: '가능한 시간이 있나요?',
  },
  {
    id: 'review',
    title: '제출 내용을 확인해 주세요',
  },
]

function JoinMeetingPage({ meetingId, onDashboard }) {
  const user = useAuthStore((state) => state.user)
  const userDisplayName = user.displayName
  const userEmail = user.email
  const userUid = user.uid
  const [meeting, setMeeting] = useState(null)
  const [hostAvailability, setHostAvailability] = useState([])
  const [availability, setAvailability] = useState([])
  const [stepIndex, setStepIndex] = useState(0)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadMeeting() {
      try {
        const joinData = await getMeetingJoinData({ meetingId, userId: userUid })

        if (isMounted) {
          setMeeting(joinData.meeting)
          setHostAvailability(joinData.hostAvailability)
          setAvailability(joinData.participant?.availability ?? [])
          setError('')
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
  }, [meetingId, userDisplayName, userEmail, userUid])

  const hostDates = useMemo(() => {
    return new Set(hostAvailability.map((slot) => slot.date).filter(Boolean))
  }, [hostAvailability])
  const calendarItems = useMemo(() => getMonthCalendar(meeting?.targetMonth), [meeting?.targetMonth])
  const currentStep = joinSteps[stepIndex]
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === joinSteps.length - 1

  function toggleDate(date) {
    setAvailability((currentAvailability) => toggleAvailabilityDate(currentAvailability, date))
    setError('')
  }

  function updateSlot(slotId, field, value) {
    setAvailability((currentAvailability) => updateAvailabilitySlot(currentAvailability, slotId, field, value))
    setError('')
  }

  function moveNext() {
    const validationMessage = getStepValidationMessage(currentStep.id, availability)

    if (validationMessage) {
      setError(validationMessage)
      return
    }

    setStepIndex((currentIndex) => Math.min(currentIndex + 1, joinSteps.length - 1))
    setError('')
  }

  function movePrevious() {
    setStepIndex((currentIndex) => Math.max(currentIndex - 1, 0))
    setError('')
  }

  async function submitParticipation(event) {
    event.preventDefault()

    const validationMessage = getValidationMessage({ availability })

    if (validationMessage) {
      setError(validationMessage)
      return
    }

    setIsSubmitting(true)

    try {
      await submitMeetingParticipation({
        availability,
        displayName: getUserDisplayName({ displayName: userDisplayName, email: userEmail }),
        meetingId,
        user,
      })
      setIsSubmitted(true)
      setError('')
    } catch (submitError) {
      setError(getMeetingErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (error && !meeting) {
    return (
      <main className="join-page">
        <p className="form-status form-status--error">{error}</p>
      </main>
    )
  }

  if (!meeting) {
    return (
      <main className="join-page">
        <p className="landing__eyebrow">약속을 불러오는 중</p>
      </main>
    )
  }

  if (isSubmitted) {
    return (
      <main className="join-page">
        <section className="join-flow" aria-labelledby="join-complete-title">
          <header className="join-flow__header">
            <p className="landing__eyebrow">참여 완료</p>
            <h1 id="join-complete-title">가능한 일정을 제출했습니다.</h1>
            <p>{meeting.title}</p>
          </header>
          <button type="button" className="landing__login" onClick={onDashboard}>
            대시보드로 이동
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="join-page">
      <form className="join-flow" onSubmit={submitParticipation} noValidate>
        <section className="join-flow__top" aria-label="참여 진행 상태">
          <span>{stepIndex + 1} / {joinSteps.length}</span>
        </section>

        <header className="join-flow__header">
          <p className="landing__eyebrow">약속 참여</p>
          <h1>{currentStep.title}</h1>
          <p>{meeting.description || '설명이 없습니다.'}</p>
          <strong>{meeting.title}</strong>
        </header>

        <section className="join-flow__body">
          {currentStep.id === 'dates' && (
            <fieldset className="step-field">
              <legend>가능한 날짜</legend>
              <p>{getTargetMonthLabel(meeting.targetMonth)}</p>
              <p>표시된 날짜는 주최자가 가능한 날입니다. 같은 월 안에서 다른 날짜도 선택할 수 있습니다.</p>

              <JoinCalendar
                calendarItems={calendarItems}
                hostDates={hostDates}
                selectedDates={new Set(availability.map((slot) => slot.date))}
                targetMonth={meeting.targetMonth}
                onToggleDate={toggleDate}
              />
            </fieldset>
          )}

          {currentStep.id === 'times' && (
            <MeetingTimesStep
              form={{ availability }}
              onChangeSlot={updateSlot}
            />
          )}

          {currentStep.id === 'review' && (
            <section className="meeting-review" aria-label="제출 내용 확인">
              <div className="meeting-review__count">
                <strong>선택한 날짜</strong>
                <span>{availability.length}개</span>
              </div>
              <ul className="step-list">
                {availability.map((slot) => (
                  <li key={slot.id}>
                    <span>{getDateWithWeekdayLabel(slot.date)}</span>
                    <span>{getAvailabilityTimeLabel(slot)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>

        {error && <p className="form-status form-status--error">{error}</p>}

        <footer className="join-flow__actions">
          <button type="button" className="landing__signup" onClick={isFirstStep ? onDashboard : movePrevious}>
            {isFirstStep ? '취소' : '이전'}
          </button>
          {!isLastStep && (
            <button type="button" className="landing__login" onClick={moveNext}>
              다음
            </button>
          )}
          {isLastStep && (
            <button type="submit" className="landing__login" disabled={isSubmitting}>
              {isSubmitting ? '제출 중' : '제출'}
            </button>
          )}
        </footer>
      </form>
    </main>
  )
}

const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토']

function JoinCalendar({ calendarItems, hostDates, onToggleDate, selectedDates, targetMonth }) {
  return (
    <section className="join-calendar" aria-label={`${targetMonth} 참여 가능 날짜`}>
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
                className="date-picker__day join-calendar__day"
                aria-pressed={selectedDates.has(date)}
                data-host-date={hostDates.has(date)}
                onClick={() => onToggleDate(date)}
              >
                {Number(date.slice(-2))}
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function getStepValidationMessage(stepId, availability) {
  if (stepId === 'dates' && availability.length === 0) {
    return '가능한 날짜를 1개 이상 선택해 주세요.'
  }

  if (stepId === 'times') {
    return getAvailabilityTimeValidationMessage(availability)
  }

  return ''
}

function getValidationMessage({ availability }) {
  const dateError = getStepValidationMessage('dates', availability)
  const timeError = getStepValidationMessage('times', availability)

  return dateError || timeError
}

function getUserDisplayName(user) {
  return user.displayName || user.email?.split('@')[0] || '참여자'
}

export default JoinMeetingPage
