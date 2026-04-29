import { useState } from 'react'
import { getMeetingJoinUrl } from '../../../routes/paths'

function InviteSharePage({ meetingId, meetingTitle, onDashboard }) {
  const [status, setStatus] = useState({ type: '', message: '' })
  const inviteUrl = getMeetingJoinUrl(meetingId)
  const title = meetingTitle || '생성된 약속'

  async function copyInviteUrl() {
    setStatus({ type: '', message: '' })

    try {
      await navigator.clipboard.writeText(inviteUrl)
      setStatus({ type: 'success', message: '초대 링크를 복사했습니다.' })
    } catch {
      setStatus({
        type: 'error',
        message: '자동 복사에 실패했습니다. 링크를 직접 선택해 복사해 주세요.',
      })
    }
  }

  return (
    <main className="invite-page">
      <section className="invite-share" aria-labelledby="invite-title">
        <header className="invite-share__header">
          <p className="landing__eyebrow">약속 생성 완료</p>
          <h1 id="invite-title">이 링크를 참여자에게 공유해 주세요.</h1>
        </header>

        <section className="invite-share__body" aria-label="초대 링크">
          <p>
            <strong>약속</strong>
            <span>{title}</span>
          </p>
          <p>
            <strong>초대 링크</strong>
            <span className="invite-share__link">{inviteUrl}</span>
          </p>
        </section>

        {status.message && (
          <p className={`form-status form-status--${status.type}`}>
            {status.message}
          </p>
        )}

        <footer className="invite-share__actions">
          <button type="button" className="landing__login" onClick={copyInviteUrl}>
            초대 링크 복사
          </button>
          <button type="button" className="landing__signup" onClick={onDashboard}>
            대시보드로 이동
          </button>
        </footer>
      </section>
    </main>
  )
}

export default InviteSharePage
