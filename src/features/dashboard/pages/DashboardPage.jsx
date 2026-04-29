import { useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import { DEFAULT_USER_NAME, DASHBOARD_COPY, SERVICE_NAME } from '../../../shared/lib/appCopy'
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

function DashboardPage({ onCreateMeeting, onLogout }) {
  const [status, setStatus] = useState('')
  const user = useAuthStore((state) => state.user)
  const nickname = getDisplayName(user)

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

      <section className="dashboard__meetings" aria-labelledby="meetings-title">
        <header className="dashboard__section-header">
          <h2 id="meetings-title">{DASHBOARD_COPY.meetingsTitle}</h2>
          <p>{DASHBOARD_COPY.emptyRealtimeNotice}</p>
        </header>

        {meetingSections.map((section) => (
          <section
            className="meeting-list"
            key={section.id}
            aria-labelledby={`${section.id}-title`}
          >
            <header className="meeting-list__header">
              <h3 id={`${section.id}-title`}>{section.title}</h3>
              <span>0개</span>
            </header>
            <p className="meeting-list__empty">{section.description}</p>
          </section>
        ))}
      </section>
    </main>
  )
}

export default DashboardPage
