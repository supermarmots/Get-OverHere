import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import { getMeetingJoinUrl } from '../../../routes/paths'
import { getMeetingStatusLabel } from '../../dashboard/lib/meetingFormat'
import { getDateWithWeekdayLabel } from '../lib/createMeetingForm'
import { getMeetingErrorMessage } from '../lib/meetingErrors'

function MeetingDetailPage({ meetingId, onDashboard, onEdit }) {
  const user = useAuthStore((state) => state.user)
  const [meeting, setMeeting] = useState(null)
  const [error, setError] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadMeeting() {
      try {
        const { getMeeting } = await import('../services/meetingService')
        const loadedMeeting = await getMeeting({ meetingId, userId: user.uid })

        if (isMounted) {
          setMeeting(loadedMeeting)
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
  }, [meetingId, user.uid])

  async function deleteCurrentMeeting() {
    try {
      const { deleteMeeting } = await import('../services/meetingService')
      await deleteMeeting({ meetingId })
      onDashboard()
    } catch (deleteError) {
      setError(getMeetingErrorMessage(deleteError))
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

  if (error) {
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
        <p>{meeting.description || '설명이 없습니다.'}</p>
      </header>

      <section className="meeting-detail__summary" aria-label="약속 정보">
        <p>
          <strong>상태</strong>
          <span>{getMeetingStatusLabel(meeting.status)}</span>
        </p>
        <p>
          <strong>조율 월</strong>
          <span>{meeting.targetMonth}</span>
        </p>
        <p>
          <strong>참여자</strong>
          <span>{meeting.participantCount ?? 0}명</span>
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

      <section className="meeting-review__slots" aria-label="내 가능 일정">
        <h2>내 가능 일정</h2>
        <ul className="step-list">
          {(meeting.participant?.availability ?? []).map((slot) => (
            <li key={slot.id}>
              <span>{getDateWithWeekdayLabel(slot.date)}</span>
              <span>{getTimeLabel(slot)}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="meeting-detail__actions">
        <button type="button" className="text-button meeting-detail__action" onClick={() => onEdit(meeting.id)}>
          수정
        </button>
        <button
          type="button"
          className="text-button meeting-detail__action danger-button"
          onClick={() => setShowDeleteConfirm(true)}
        >
          삭제
        </button>
      </footer>

      {showDeleteConfirm && (
        <dialog className="confirm-dialog" open>
          <section aria-labelledby="delete-title">
            <h2 id="delete-title">이 약속을 삭제할까요?</h2>
            <p>삭제하면 대시보드에서 더 이상 보이지 않습니다.</p>
            <footer className="confirm-dialog__actions">
              <button type="button" className="landing__signup" onClick={() => setShowDeleteConfirm(false)}>
                취소
              </button>
              <button type="button" className="text-button danger-button" onClick={deleteCurrentMeeting}>
                삭제
              </button>
            </footer>
          </section>
        </dialog>
      )}
    </main>
  )
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

function getTimeLabel(slot) {
  if (!slot.startTime && !slot.endTime) {
    return '시간 미정'
  }

  return `${slot.startTime} - ${slot.endTime}`
}

export default MeetingDetailPage
