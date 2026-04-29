import { AUTH_COPY, getSubmitLabel } from '../../../shared/lib/appCopy'

const fields = [
  {
    label: '이메일',
    name: 'email',
    type: 'email',
    autoComplete: 'email',
  },
  {
    label: '비밀번호',
    name: 'password',
    type: 'password',
    autoComplete: 'current-password',
  },
]

function LoginForm({ errors, form, isSubmitting, onChange, onSubmit, status }) {
  return (
    <form className="signup-form" onSubmit={onSubmit} noValidate>
      {fields.map((field) => {
        const errorId = `login-${field.name}-error`

        return (
          <label key={field.name}>
            {field.label}
            <input
              type={field.type}
              name={field.name}
              value={form[field.name]}
              onChange={onChange}
              autoComplete={field.autoComplete}
              aria-describedby={errors[field.name] ? errorId : undefined}
            />
            {errors[field.name] && <span id={errorId}>{errors[field.name]}</span>}
          </label>
        )
      })}

      {status.message && (
        <p className={`form-status form-status--${status.type}`}>{status.message}</p>
      )}

      <button type="submit" className="landing__login" disabled={isSubmitting}>
        {getSubmitLabel(isSubmitting, AUTH_COPY.login)}
      </button>
    </form>
  )
}

export default LoginForm
