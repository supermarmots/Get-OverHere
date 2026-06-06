import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import { getMeetingJoinUrl } from '../../../routes/paths'
import { getMeetingStatusLabel } from '../../dashboard/lib/meetingFormat'
import { getAvailabilityTimeLabel, getDateWithWeekdayLabel } from '../lib/createMeetingForm'
import { createConfirmedResultFromRecommendation, getConfirmedResultLabel } from '../lib/confirmedResult'
import { getMeetingErrorMessage } from '../lib/meetingErrors'
import { getDateRecommendations } from '../lib/meetingRecommendations'
import { MEETING_STATUS } from '../lib/meetingStatus'
import {
  cancelMeetingParticipation,
  confirmMeeting,
  deleteMeeting,
  getMeeting,
  getMeetingParticipants,
  reopenMeeting,
} from '../services/meetingService'

function MeetingDetailPage({ meetingId, onDashboard, onEdit, onJoin }) {
  const user = useAuthStore((state) => state.user)
  const [meeting, setMeeting] = useState(null)
  const [participants, setParticipants] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [participantTotal, setParticipantTotal] = useState(0)
  const [error, setError] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const [confirmForm, setConfirmForm] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadMeeting() {
      try {
        if (isMounted) {
          setMeeting(null)
          setParticipants([])
          setRecommendations([])
          setParticipantTotal(0)
          setError('')
        }

        const loadedMeeting = await getMeeting({ meetingId, userId: user.uid })

        if (isMounted) {
          setMeeting(loadedMeeting)
          setError('')
        }

        const participants = await getMeetingParticipants(meetingId)

        if (isMounted) {
          setParticipantTotal(participants.length)
          setParticipants(participants)
          setRecommendations(getVisibleRecommendations(participants))
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

  async function deleteCurrentMeeting() {
    try {
      await deleteMeeting({ meetingId })
      onDashboard()
    } catch (deleteError) {
      setError(getMeetingErrorMessage(deleteError))
    }
  }

  async function cancelCurrentParticipation() {
    try {
      await cancelMeetingParticipation({ meetingId, user })
      onDashboard()
    } catch (cancelError) {
      setError(getMeetingErrorMessage(cancelError))
    }
  }

  async function copyInviteUrl(inviteUrl) {
    setCopyStatus('')

    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopyStatus('초대 링크를 복사했습니다.')
    } catch {
      setCopyStatus('자동 복사에 실패했습니다. 링크를 직접 선택해 복사해 주세요.')
    }
  }

  function openConfirmDialog() {
    if (recommendations.length === 0) {
      setError('추천 날짜가 있을 때 확정할 수 있습니다.')
      return
    }

    setConfirmForm((currentForm) => currentForm ?? createConfirmedResultFromRecommendation(recommendations[0]))
    setShowConfirmDialog(true)
    setError('')
  }

  function closeConfirmDialog() {
    setShowConfirmDialog(false)
    setError('')
  }

  function selectConfirmDate(recommendation) {
    setConfirmForm((currentForm) => ({
      ...createConfirmedResultFromRecommendation(recommendation),
      startTime: currentForm?.startTime ?? '',
      endTime: currentForm?.endTime ?? '',
    }))
    setError('')
  }

  function updateConfirmTime(event) {
    const { name, value } = event.target

    setConfirmForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
    setError('')
  }

  async function confirmCurrentMeeting(event) {
    event.preventDefault()

    const validationMessage = getConfirmValidationMessage(confirmForm)

    if (validationMessage) {
      setError(validationMessage)
      return
    }

    try {
      await confirmMeeting({ confirmedResult: confirmForm, meetingId, user })
      setMeeting((currentMeeting) => ({
        ...currentMeeting,
        confirmedResult: {
          ...confirmForm,
          confirmedBy: user.uid,
        },
        status: MEETING_STATUS.confirmed,
      }))
      setShowConfirmDialog(false)
      setError('')
    } catch (confirmError) {
      setError(getMeetingErrorMessage(confirmError))
    }
  }

  async function reopenCurrentMeeting() {
    try {
      await reopenMeeting({ meetingId })
      setMeeting((currentMeeting) => ({
        ...currentMeeting,
        confirmedResult: null,
        status: MEETING_STATUS.collecting,
      }))
      setError('')
    } catch (reopenError) {
      setError(getMeetingErrorMessage(reopenError))
    }
  }

  if (error && !meeting) {
    return (
      <main className="meeting-detail">
        <p className="form-status form-status--error">{error}</p>
      </main>
    )
  }

  if (!meeting) {
    return (
      <main className="meeting-detail">
        <p className="landing__eyebrow">약속을 불러오는 중</p>
      </main>
    )
  }

  const inviteUrl = getMeetingJoinUrl(meeting.id)
  const isHost = meeting.hostId === user.uid
  const currentParticipant = participants.find((participant) => participant.id === user.uid) ?? meeting.participant
  const canConfirm = isHost && meeting.status === MEETING_STATUS.collecting
  const isConfirmed = meeting.status === MEETING_STATUS.confirmed
  const confirmedResultLabel = getConfirmedResultLabel(meeting.confirmedResult)
  const confirmTitle = isHost ? '이 약속을 삭제할까요?' : '참여를 취소할까요?'
  const confirmDescription = isHost
    ? '삭제하면 대시보드에서 더 이상 보이지 않습니다.'
    : '참여 취소 후에는 초대 링크로 다시 참여할 수 있습니다.'
  const confirmActionLabel = isHost ? '약속 삭제' : '참여 취소'
  const handleConfirmAction = isHost ? deleteCurrentMeeting : cancelCurrentParticipation

  return (
    <main className="meeting-detail">
      <header className="meeting-detail__header">
        <button
          type="button"
          className="plain-icon-button meeting-detail__back"
          aria-label="대시보드로 돌아가기"
          title="대시보드로 돌아가기"
          onClick={onDashboard}
        >
          <BackIcon />
        </button>
        <h1>{meeting.title}</h1>
        {canConfirm && (
          <button type="button" className="meeting-detail__confirm" onClick={openConfirmDialog}>
            확정하기
          </button>
        )}
        <p>{meeting.description || '설명이 없습니다.'}</p>
      </header>

      <section className="meeting-detail__summary" aria-label="약속 정보">
        <p>
          <strong>상태</strong>
          <span>{getMeetingStatusLabel(meeting.status)}</span>
        </p>
        <p>
          <strong>희망 날짜(월)</strong>
          <span>{meeting.targetMonth}</span>
        </p>
        {confirmedResultLabel && (
          <p>
            <strong>확정 일정</strong>
            <span>{confirmedResultLabel}</span>
          </p>
        )}
        <p>
          <strong>
            참여자
            <span className="meeting-detail__count">{participantTotal}명</span>
          </strong>
          <span className="meeting-detail__participants">
            {participants.map((participant) => (
              <span key={participant.id}>{getParticipantName(participant)}</span>
            ))}
          </span>
        </p>
        <p>
          <strong>초대 링크</strong>
          <span className="meeting-detail__invite">
            <span className="invite-share__link">{inviteUrl}</span>
            <button
              type="button"
              className="icon-button"
              aria-label="초대 링크 복사"
              title="초대 링크 복사"
              onClick={() => copyInviteUrl(inviteUrl)}
            >
              <CopyIcon />
            </button>
          </span>
        </p>
      </section>

      {copyStatus && <p className="form-status form-status--success">{copyStatus}</p>}

      <section className="meeting-recommendations" aria-labelledby="recommendations-title">
        <header className="meeting-recommendations__header">
          <h2 id="recommendations-title">추천 날짜</h2>
          <span>자동 계산</span>
        </header>

        {recommendations.length > 0 && (
          <ol className="meeting-recommendations__list">
            {recommendations.map((recommendation) => (
              <li key={recommendation.date}>
                <strong>{getDateWithWeekdayLabel(recommendation.date)}</strong>
                <span>{recommendation.participantCount}명 가능</span>
              </li>
            ))}
          </ol>
        )}

        {recommendations.length === 0 && (
          <p className="meeting-recommendations__empty">{getRecommendationEmptyMessage(participantTotal)}</p>
        )}
      </section>

      {error && <p className="form-status form-status--error">{error}</p>}

      <section className="meeting-review__slots" aria-label="내 가능 일정">
        <h2>내 가능 일정</h2>
        <ul className="step-list">
          {(currentParticipant?.availability ?? []).map((slot) => (
            <li key={slot.id}>
              <span>{getDateWithWeekdayLabel(slot.date)}</span>
              <span>{getAvailabilityTimeLabel(slot)}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="meeting-detail__actions">
        {isConfirmed && isHost ? (
          <button
            type="button"
            className="text-button meeting-detail__action"
            onClick={reopenCurrentMeeting}
          >
            재개최하기
          </button>
        ) : (
          <button
            type="button"
            className="text-button meeting-detail__action"
            onClick={() => (isHost ? onEdit(meeting.id) : onJoin(meeting.id))}
          >
            수정
          </button>
        )}
        <button
          type="button"
          className="text-button meeting-detail__action danger-button"
          onClick={() => setShowDeleteConfirm(true)}
        >
          {confirmActionLabel}
        </button>
      </footer>

      {showDeleteConfirm && (
        <dialog className="confirm-dialog" open>
          <section aria-labelledby="delete-title">
            <h2 id="delete-title">{confirmTitle}</h2>
            <p>{confirmDescription}</p>
            <footer className="confirm-dialog__actions">
              <button type="button" className="text-button danger-button" onClick={handleConfirmAction}>
                {confirmActionLabel}
              </button>
              <button type="button" className="text-button" onClick={() => setShowDeleteConfirm(false)}>
                취소
              </button>
            </footer>
          </section>
        </dialog>
      )}

      {showConfirmDialog && confirmForm && (
        <dialog className="confirm-dialog" open>
          <form aria-labelledby="confirm-meeting-title" onSubmit={confirmCurrentMeeting}>
            <h2 id="confirm-meeting-title">일정 확정</h2>
            <fieldset className="confirm-date-options">
              <legend>확정 날짜</legend>
              {recommendations.map((recommendation) => (
                <button
                  type="button"
                  key={recommendation.date}
                  aria-pressed={confirmForm.date === recommendation.date}
                  onClick={() => selectConfirmDate(recommendation)}
                >
                  <span>{getDateWithWeekdayLabel(recommendation.date)}</span>
                  <span>{recommendation.participantCount}명 가능</span>
                </button>
              ))}
            </fieldset>
            <fieldset className="time-row">
              <legend>확정 시간</legend>
              <section className="time-row__inputs" aria-label="확정 시간 입력">
                <label>
                  시작
                  <input
                    type="time"
                    name="startTime"
                    value={confirmForm.startTime}
                    onChange={updateConfirmTime}
                  />
                </label>
                <label>
                  종료
                  <input
                    type="time"
                    name="endTime"
                    value={confirmForm.endTime}
                    onChange={updateConfirmTime}
                  />
                </label>
              </section>
            </fieldset>
            {error && <p className="form-status form-status--error">{error}</p>}
            <footer className="confirm-dialog__actions">
              <button type="button" className="text-button" onClick={closeConfirmDialog}>
                취소
              </button>
              <button type="submit" className="text-button confirm-dialog__primary">
                확정
              </button>
            </footer>
          </form>
        </dialog>
      )}
    </main>
  )
}

function getVisibleRecommendations(participants) {
  if (participants.length < 2) {
    return []
  }

  return getDateRecommendations(participants)
}

function getRecommendationEmptyMessage(participantTotal) {
  if (participantTotal < 2) {
    return '참여자가 2명 이상일 때 추천 날짜를 표시합니다.'
  }

  return '아직 추천할 수 있는 후보가 없습니다.'
}

function getConfirmValidationMessage(confirmForm) {
  if (!confirmForm?.date) {
    return '확정할 날짜를 선택해 주세요.'
  }

  if (!confirmForm.startTime && !confirmForm.endTime) {
    return ''
  }

  if (!confirmForm.startTime || !confirmForm.endTime) {
    return '시간은 비워두거나 시작/종료를 모두 입력해 주세요.'
  }

  if (confirmForm.endTime <= confirmForm.startTime) {
    return '확정 종료 시간은 시작 시간보다 늦어야 합니다.'
  }

  return ''
}

function getParticipantName(participant) {
  return participant.displayName || participant.email || '이름 없는 참여자'
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M8 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V7Zm2 0v8h8V7h-8Z" />
      <path d="M4 11a2 2 0 0 1 2-2v2H6v8h8v-.02h2V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8Z" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M15.7 5.3a1 1 0 0 1 0 1.4L11.4 11H20a1 1 0 1 1 0 2h-8.6l4.3 4.3a1 1 0 0 1-1.4 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.4 0Z" />
    </svg>
  )
}

export default MeetingDetailPage
