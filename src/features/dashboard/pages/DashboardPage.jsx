import { useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'

const meetingSections = [
  {
    id: 'hosting',
    title: '주최 중',
    description: '내가 만든 약속 방이 여기에 표시됩니다.',
  },
  {
    id: 'participating',
    title: '참여 중',
    description: '투표해야 하거나 참여한 약속이 여기에 표시됩니다.',
  },
  {
    id: 'confirmed',
    title: '확정됨',
    description: '최종 일정이 정해진 약속이 여기에 표시됩니다.',
  },
]

function DashboardPage({ onLogout }) {
  const [status, setStatus] = useState('')
  const user = useAuthStore((state) => state.user)
  const nickname = user?.displayName || user?.email?.split('@')[0] || '사용자'

  async function handleLogout() {
    setStatus('')

    try {
      const { logout } = await import('../../auth/services/authService')
      await logout()
      onLogout()
    } catch {
      setStatus('로그아웃 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    }
  }

  return (
    <main className="dashboard">
      <header className="dashboard__header">
        <p className="landing__eyebrow">Get Over Here</p>
        <h1>{nickname}님, 약속을 조율해 볼까요?</h1>
        <nav className="dashboard__nav" aria-label="사용자 메뉴">
          <button type="button" className="text-button">
            프로필
          </button>
          <button type="button" className="text-button" onClick={handleLogout}>
            로그아웃
          </button>
        </nav>
      </header>

      <section className="dashboard__actions" aria-label="주요 작업">
        <button type="button" className="landing__login">
          약속 만들기
        </button>
        <button type="button" className="landing__signup">
          초대 링크로 참여
        </button>
      </section>

      {status && <p className="form-status form-status--error">{status}</p>}

      <section className="dashboard__meetings" aria-labelledby="meetings-title">
        <header className="dashboard__section-header">
          <h2 id="meetings-title">내 약속</h2>
          <p>약속 목록은 Firestore 연결 후 실시간으로 표시됩니다.</p>
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
