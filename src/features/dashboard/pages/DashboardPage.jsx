import { useEffect, useState } from 'react'
import { getMeetingJoinPathFromInput } from '../../../routes/paths'
import { useAuthStore } from '../../../stores/authStore'
import { DEFAULT_USER_NAME, DASHBOARD_COPY } from '../../../shared/lib/appCopy'
import { MEETING_STATUS } from '../../meetings/lib/meetingStatus'
import MeetingListSection from '../components/MeetingListSection'
import { getDashboardErrorMessage } from '../lib/dashboardErrors'
import { meetingSections } from '../lib/meetingSections'

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
  const [hostedMeetings, setHostedMeetings] = useState([])
  const [participatingMeetings, setParticipatingMeetings] = useState([])
  const [inviteLink, setInviteLink] = useState('')
  const [inviteError, setInviteError] = useState('')
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [listError, setListError] = useState('')
  const user = useAuthStore((state) => state.user)
  const nickname = getDisplayName(user)
  const activeHostedMeetings = hostedMeetings.filter((meeting) => meeting.status !== MEETING_STATUS.confirmed)
  const activeParticipatingMeetings = participatingMeetings.filter((meeting) => meeting.status !== MEETING_STATUS.confirmed)
  const confirmedMeetings = getUniqueMeetings([
    ...hostedMeetings.filter((meeting) => meeting.status === MEETING_STATUS.confirmed),
    ...participatingMeetings.filter((meeting) => meeting.status === MEETING_STATUS.confirmed),
  ])

  useEffect(() => {
    if (!user?.uid) {
      return undefined
    }

    let unsubscribeHosted = () => { }
    let unsubscribeParticipating = () => { }
    let isMounted = true

    async function subscribe() {
      try {
        const { subscribeHostedMeetings, subscribeParticipatingMeetings } = await import('../services/dashboardService')

        unsubscribeHosted = subscribeHostedMeetings(
          user.uid,
          (meetings) => {
            if (isMounted) {
              setHostedMeetings(meetings)
              setListError('')
            }
          },
          (error) => {
            if (isMounted) {
              setListError(getDashboardErrorMessage(error))
            }
          },
        )
        unsubscribeParticipating = subscribeParticipatingMeetings(
          user.uid,
          (meetings) => {
            if (isMounted) {
              setParticipatingMeetings(meetings)
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
      unsubscribeHosted()
      unsubscribeParticipating()
    }
  }, [user?.uid])

  async function handleLogout() {
    setStatus('')

    try {
      const { logout } = await import('../../auth/services/authService')
      await logout()
      onLogout()
    } catch {
      setStatus(DASHBOARD_COPY.logoutError)
    }
  }

  async function reopenMeeting(meeting) {
    setStatus('')

    try {
      const { updateMeetingStatus } = await import('../../meetings/services/meetingService')
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
        <h1>
          {nickname}
          {DASHBOARD_COPY.greetingSuffix}
        </h1>
        <nav className="dashboard__nav" aria-label="사용자 메뉴">
          <button type="button" className="text-button">
            {DASHBOARD_COPY.profile}
          </button>
          <button type="button" className="text-button" onClick={handleLogout}>
            {DASHBOARD_COPY.logout}
          </button>
        </nav>
      </header>

      <section className="dashboard__actions" aria-label="주요 작업">
        <button type="button" className="landing__login" onClick={onCreateMeeting}>
          {DASHBOARD_COPY.createMeeting}
        </button>
        <button type="button" className="landing__signup" onClick={openInviteDialog}>
          {DASHBOARD_COPY.joinWithInvite}
        </button>
      </section>

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

function getUniqueMeetings(meetings) {
  return Array.from(new Map(meetings.map((meeting) => [meeting.id, meeting])).values())
}

export default DashboardPage
