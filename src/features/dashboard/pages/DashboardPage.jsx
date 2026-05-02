import { useEffect, useState } from 'react'
import { getMeetingJoinPathFromInput } from '../../../routes/paths'
import { useAuthStore } from '../../../stores/authStore'
import { DEFAULT_USER_NAME, DASHBOARD_COPY } from '../../../shared/lib/appCopy'
import { logout } from '../../auth/services/authService'
import { MEETING_STATUS } from '../../meetings/lib/meetingStatus'
import { updateMeetingStatus } from '../../meetings/services/meetingService'
import MeetingListSection from '../components/MeetingListSection'
import { getDashboardErrorMessage } from '../lib/dashboardErrors'
import { meetingSections } from '../lib/meetingSections'
import { subscribeUserMeetings } from '../services/dashboardService'

function getDisplayName(user) {
  if (user?.displayName) {
    return user.displayName
  }

  if (user?.email) {
    return user.email.split('@')[0]
  }

  return DEFAULT_USER_NAME
}

function DashboardPage({ onCreateMeeting, onJoinWithInvite, onLogout, onOpenMeeting }) {
  const [status, setStatus] = useState('')
  const [meetings, setMeetings] = useState([])
  const [inviteLink, setInviteLink] = useState('')
  const [inviteError, setInviteError] = useState('')
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [listError, setListError] = useState('')
  const user = useAuthStore((state) => state.user)
  const nickname = getDisplayName(user)
  const activeHostedMeetings = meetings.filter((meeting) => {
    return meeting.hostId === user.uid
      && meeting.status !== MEETING_STATUS.confirmed
  })
  const activeParticipatingMeetings = meetings.filter((meeting) => {
    return meeting.hostId !== user.uid
      && meeting.status !== MEETING_STATUS.confirmed
  })
  const confirmedMeetings = meetings.filter((meeting) => meeting.status === MEETING_STATUS.confirmed)
  const activeMeetingCount = activeHostedMeetings.length + activeParticipatingMeetings.length

  useEffect(() => {
    if (!user?.uid) {
      return undefined
    }

    let unsubscribe = () => { }
    let isMounted = true

    async function subscribe() {
      try {
        unsubscribe = subscribeUserMeetings(
          user.uid,
          (meetings) => {
            if (isMounted) {
              setMeetings(meetings)
              setListError('')
            }
          },
          (error) => {
            if (isMounted) {
              setListError(getDashboardErrorMessage(error))
            }
          },
        )
      } catch (error) {
        if (isMounted) {
          setListError(getDashboardErrorMessage(error))
        }
      }
    }

    subscribe()

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [user?.uid])

  async function handleLogout() {
    setStatus('')

    try {
      await logout()
      onLogout()
    } catch {
      setStatus(DASHBOARD_COPY.logoutError)
    }
  }

  async function reopenMeeting(meeting) {
    setStatus('')

    try {
      await updateMeetingStatus({ meetingId: meeting.id, status: MEETING_STATUS.collecting })
    } catch {
      setStatus('약속을 다시 진행하는 중 문제가 발생했습니다.')
    }
  }

  function openInviteDialog() {
    setInviteLink('')
    setInviteError('')
    setShowInviteDialog(true)
  }

  function closeInviteDialog() {
    setShowInviteDialog(false)
    setInviteError('')
  }

  function joinWithInvite(event) {
    event.preventDefault()
    const joinPath = getMeetingJoinPathFromInput(inviteLink)

    if (!inviteLink.trim()) {
      setInviteError('초대 링크를 입력해 주세요.')
      return
    }

    if (!joinPath) {
      setInviteError('올바른 초대 링크를 입력해 주세요.')
      return
    }

    onJoinWithInvite(joinPath)
  }

  return (
    <main className="dashboard">
      <header className="dashboard__header">
        <div>
          <p className="landing__eyebrow">오늘의 약속 조율</p>
          <h1>
            {nickname}
            {DASHBOARD_COPY.greetingSuffix}
          </h1>
          <p className="dashboard__intro">
            링크로 가능 시간을 모으고, 겹치는 날짜를 확인한 뒤 확정하세요.
          </p>
        </div>
        <button type="button" className="text-button dashboard__logout" onClick={handleLogout}>
          {DASHBOARD_COPY.logout}
        </button>
      </header>

      <section className="dashboard__summary" aria-label="약속 현황">
        <p>
          <strong>{activeHostedMeetings.length}</strong>
          <span>내가 조율 중</span>
        </p>
        <p>
          <strong>{activeParticipatingMeetings.length}</strong>
          <span>참여 중</span>
        </p>
        <p>
          <strong>{confirmedMeetings.length}</strong>
          <span>확정 완료</span>
        </p>
      </section>

      <section className="dashboard__actions" aria-label="주요 작업">
        <button type="button" className="landing__login" onClick={onCreateMeeting}>
          새 약속
        </button>
        <button type="button" className="landing__signup" onClick={openInviteDialog}>
          초대 참여
        </button>
      </section>

      {activeMeetingCount === 0 && confirmedMeetings.length === 0 && (
        <section className="dashboard__empty-guide" aria-label="시작 안내">
          <h2>아직 약속이 없습니다</h2>
          <p>새 약속을 만들거나 받은 초대 링크로 참여하면 이곳에서 진행 상황을 볼 수 있습니다.</p>
        </section>
      )}

      {status && <p className="form-status form-status--error">{status}</p>}
      {listError && <p className="form-status form-status--error">{listError}</p>}

      <section className="dashboard__meetings" aria-label="약속 목록">
        <MeetingListSection
          description={meetingSections.hosting.description}
          meetings={activeHostedMeetings}
          onOpenMeeting={onOpenMeeting}
          title={meetingSections.hosting.title}
        />
        <MeetingListSection
          description={meetingSections.participating.description}
          meetings={activeParticipatingMeetings}
          onOpenMeeting={onOpenMeeting}
          title={meetingSections.participating.title}
        />
        <MeetingListSection
          actionLabel="재개최하기"
          canUseAction={(meeting) => meeting.hostId === user.uid}
          description={meetingSections.confirmed.description}
          meetings={confirmedMeetings}
          onMeetingAction={reopenMeeting}
          onOpenMeeting={onOpenMeeting}
          title={meetingSections.confirmed.title}
        />
      </section>

      {showInviteDialog && (
        <dialog className="confirm-dialog" open>
          <form aria-labelledby="invite-dialog-title" onSubmit={joinWithInvite}>
            <h2 id="invite-dialog-title">초대 링크로 참여</h2>
            <label className="step-field">
              초대 링크
              <input
                type="url"
                value={inviteLink}
                placeholder="https://..."
                onChange={(event) => {
                  setInviteLink(event.target.value)
                  setInviteError('')
                }}
              />
            </label>
            {inviteError && <p className="form-status form-status--error">{inviteError}</p>}
            <footer className="confirm-dialog__actions">
              <button type="button" className="landing__signup" onClick={closeInviteDialog}>
                취소
              </button>
              <button type="submit" className="landing__login">
                참여
              </button>
            </footer>
          </form>
        </dialog>
      )}
    </main>
  )
}

export default DashboardPage
