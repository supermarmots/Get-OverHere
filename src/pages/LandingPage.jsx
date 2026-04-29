function LandingPage({ onLogin, onSignup }) {
  return (
    <main className="landing">
      <section className="landing__content" aria-labelledby="service-title">
        <p className="landing__eyebrow">약속 일정 도우미</p>
        <h1 id="service-title">Get Over Here</h1>
        <p className="landing__description">
          빠르고 직관적인 약속 일정 조율 서비스
        </p>
        <nav className="landing__actions" aria-label="인증">
          <button type="button" className="landing__login" onClick={onLogin}>
            로그인
          </button>
          <button type="button" className="landing__signup" onClick={onSignup}>
            회원가입
          </button>
        </nav>
      </section>
    </main>
  )
}

export default LandingPage
