import { SERVICE_NAME } from '../../../shared/lib/appCopy'

function LandingPage({ onLogin, onSignup }) {
  return (
    <main className="landing">
      <section className="landing__content" aria-labelledby="service-title">
        <p className="landing__eyebrow">약속 일정 도우미</p>
        <h1 id="service-title">모두의 가능한 시간을 한 번에 모으세요</h1>
        <p className="landing__description">
          {SERVICE_NAME}는 링크 하나로 후보 날짜와 가능 시간을 모으고, 가장 많이 겹치는 약속 시간을 바로 보여줍니다.
        </p>
        <nav className="landing__actions" aria-label="인증">
          <button type="button" className="landing__login" onClick={onSignup}>
            약속 만들기
          </button>
          <button type="button" className="landing__signup" onClick={onLogin}>
            로그인
          </button>
        </nav>
      </section>

      <section className="landing__features" aria-label="핵심 기능">
        <article>
          <strong>1분 생성</strong>
          <p>제목, 후보 월, 가능한 날짜만 고르면 초대 링크가 만들어집니다.</p>
        </article>
        <article>
          <strong>로그인 후 일정 관리</strong>
          <p>내가 만든 약속과 참여 중인 약속을 대시보드에서 바로 확인합니다.</p>
        </article>
        <article>
          <strong>추천 날짜 자동 계산</strong>
          <p>참여자 가능 시간이 모이면 가장 많이 겹치는 날짜를 먼저 보여줍니다.</p>
        </article>
      </section>
    </main>
  )
}

export default LandingPage
