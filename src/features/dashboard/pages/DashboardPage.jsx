import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import { DEFAULT_USER_NAME, DASHBOARD_COPY, SERVICE_NAME } from '../../../shared/lib/appCopy'
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

function DashboardPage({ onCreateMeeting, onLogout, onOpenMeeting }) {
  const [status, setStatus] = useState('')
  const [hostedMeetings, setHostedMeetings] = useState([])
  const [participatingMeetings, setParticipatingMeetings] = useState([])
  const [listError, setListError] = useState('')
  const user = useAuthStore((state) => state.user)
  const nickname = getDisplayName(user)

  useEffect(() => {
    if (!user?.uid) {
      return undefined
    }

    let unsubscribeHosted = () => {}
    let unsubscribeParticipating = () => {}
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

  return (
    <main className="dashboard">
      <header className="dashboard__header">
        <p className="landing__eyebrow">{SERVICE_NAME}</p>
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
        <button type="button" className="landing__signup">
          {DASHBOARD_COPY.joinWithInvite}
        </button>
      </section>

      {status && <p className="form-status form-status--error">{status}</p>}
      {listError && <p className="form-status form-status--error">{listError}</p>}

      <section className="dashboard__meetings" aria-labelledby="meetings-title">
        <header className="dashboard__section-header">
          <h2 id="meetings-title">{DASHBOARD_COPY.meetingsTitle}</h2>
          <p>{DASHBOARD_COPY.emptyRealtimeNotice}</p>
        </header>

        <MeetingListSection
          description={meetingSections.hosting.description}
          meetings={hostedMeetings}
          onOpenMeeting={onOpenMeeting}
          title={meetingSections.hosting.title}
        />
        <MeetingListSection
          description={meetingSections.participating.description}
          meetings={participatingMeetings}
          onOpenMeeting={onOpenMeeting}
          title={meetingSections.participating.title}
        />
        <MeetingListSection
          description={meetingSections.confirmed.description}
          title={meetingSections.confirmed.title}
        />
      </section>
    </main>
  )
}

export default DashboardPage
