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
    autoComplete: 'new-password',
  },
  {
    label: '비밀번호 확인',
    name: 'confirmPassword',
    type: 'password',
    autoComplete: 'new-password',
  },
  {
    label: '이름',
    name: 'name',
    type: 'text',
    autoComplete: 'name',
  },
  {
    label: '닉네임',
    name: 'nickname',
    type: 'text',
    autoComplete: 'nickname',
  },
]

function SignupForm({ errors, form, isSubmitting, onChange, onSubmit, status }) {
  return (
    <form className="signup-form" onSubmit={onSubmit} noValidate>
      {fields.map((field) => {
        const errorId = `${field.name}-error`

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
        {isSubmitting ? '처리 중' : '가입하기'}
      </button>
    </form>
  )
}

export default SignupForm
