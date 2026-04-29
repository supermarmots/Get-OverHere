import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import OAuthButton from '../components/OAuthButton'
import { getAuthErrorMessage } from '../lib/authErrors'
import { initialLoginForm, validateLoginForm } from '../lib/loginValidation'
import { mapAuthUser } from '../lib/mapAuthUser'
import { useAuthStore } from '../../../stores/authStore'
import { SERVICE_NAME } from '../../../shared/lib/appCopy'

function LoginPage({ onBack, onSignup, onSuccess }) {
  const setAuthUser = useAuthStore((state) => state.setAuthUser)
  const [loginForm, setLoginForm] = useState(initialLoginForm)
  const [formErrors, setFormErrors] = useState({})
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateLoginField(event) {
    const { name, value } = event.target
    setLoginForm((form) => ({ ...form, [name]: value }))
    setFormErrors((errors) => ({ ...errors, [name]: '' }))
  }

  async function handleEmailLogin(event) {
    event.preventDefault()
    setStatus({ type: '', message: '' })

    const errors = validateLoginForm(loginForm)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const { loginWithEmail } = await import('../services/authService')

      const user = await loginWithEmail({
        email: loginForm.email.trim(),
        password: loginForm.password,
      })

      setAuthUser(mapAuthUser(user))
      setLoginForm(initialLoginForm)
      setStatus({ type: 'success', message: '로그인되었습니다.' })
      onSuccess()
    } catch (error) {
      setStatus({ type: 'error', message: getAuthErrorMessage(error) })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleLogin() {
    setStatus({ type: '', message: '' })
    setIsSubmitting(true)

    try {
      const { continueWithGoogle } = await import('../services/authService')
      const user = await continueWithGoogle()
      setAuthUser(mapAuthUser(user))
      setStatus({ type: 'success', message: 'Google 계정으로 로그인되었습니다.' })
      onSuccess()
    } catch (error) {
      setStatus({ type: 'error', message: getAuthErrorMessage(error) })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <button type="button" className="text-button" onClick={onBack}>
          {SERVICE_NAME}
        </button>
        <header className="auth-panel__header">
          <p className="landing__eyebrow">다시 시작하기</p>
          <h1 id="login-title">로그인</h1>
          <p>저장된 약속과 참여 일정을 확인해 보세요.</p>
        </header>

        <OAuthButton disabled={isSubmitting} onClick={handleGoogleLogin} />

        <p className="divider">또는 이메일로 로그인</p>

        <LoginForm
          errors={formErrors}
          form={loginForm}
          isSubmitting={isSubmitting}
          onChange={updateLoginField}
          onSubmit={handleEmailLogin}
          status={status}
        />

        <footer className="auth-panel__footer">
          아직 계정이 없으신가요?
          <button type="button" className="text-button" onClick={onSignup}>
            회원가입
          </button>
        </footer>
      </section>
    </main>
  )
}

export default LoginPage
