import { useState } from 'react'
import OAuthButton from '../components/OAuthButton'
import SignupForm from '../components/SignupForm'
import { getAuthErrorMessage } from '../lib/authErrors'
import { mapAuthUser } from '../lib/mapAuthUser'
import { initialSignupForm, validateSignupForm } from '../lib/signupValidation'
import { continueWithGoogle, signupWithEmail } from '../services/authService'
import { useAuthStore } from '../../../stores/authStore'
import { SERVICE_NAME } from '../../../shared/lib/appCopy'

function SignupPage({ onBack, onLogin, onSuccess }) {
  const setAuthUser = useAuthStore((state) => state.setAuthUser)
  const [signupForm, setSignupForm] = useState(initialSignupForm)
  const [formErrors, setFormErrors] = useState({})
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateSignupField(event) {
    const { name, value } = event.target
    setSignupForm((form) => ({ ...form, [name]: value }))
    setFormErrors((errors) => ({ ...errors, [name]: '' }))
  }

  async function handleEmailSignup(event) {
    event.preventDefault()
    setStatus({ type: '', message: '' })

    const errors = validateSignupForm(signupForm)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const name = signupForm.name.trim()
      const nickname = signupForm.nickname.trim()

      const user = await signupWithEmail({
        email: signupForm.email.trim(),
        password: signupForm.password,
        name,
        nickname,
      })

      setAuthUser(mapAuthUser(user))
      setSignupForm(initialSignupForm)
      setStatus({ type: 'success', message: '회원가입이 완료되었습니다.' })
      onSuccess()
    } catch (error) {
      setStatus({ type: 'error', message: getAuthErrorMessage(error) })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleSignup() {
    setStatus({ type: '', message: '' })
    setIsSubmitting(true)

    try {
      const user = await continueWithGoogle()
      setAuthUser(mapAuthUser(user))
      setStatus({ type: 'success', message: 'Google 계정으로 가입되었습니다.' })
      onSuccess()
    } catch (error) {
      setStatus({ type: 'error', message: getAuthErrorMessage(error) })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="signup-title">
        <button type="button" className="text-button" onClick={onBack}>
          {SERVICE_NAME}
        </button>
        <header className="auth-panel__header">
          <p className="landing__eyebrow">계정 만들기</p>
          <h1 id="signup-title">회원가입</h1>
          <p>약속 조율에 사용할 기본 정보를 입력해 주세요.</p>
        </header>

        <OAuthButton disabled={isSubmitting} onClick={handleGoogleSignup} />

        <p className="divider">또는 이메일로 가입</p>

        <SignupForm
          errors={formErrors}
          form={signupForm}
          isSubmitting={isSubmitting}
          onChange={updateSignupField}
          onSubmit={handleEmailSignup}
          status={status}
        />

        <footer className="auth-panel__footer">
          이미 계정이 있으신가요?
          <button type="button" className="text-button" onClick={onLogin}>
            로그인
          </button>
        </footer>
      </section>
    </main>
  )
}

export default SignupPage
