export const initialLoginForm = {
  email: '',
  password: '',
}

export function validateLoginForm(form) {
  const errors = {}
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!form.email.trim()) {
    errors.email = '이메일을 입력해 주세요.'
  } else if (!emailPattern.test(form.email)) {
    errors.email = '올바른 이메일을 입력해 주세요.'
  }

  if (!form.password) {
    errors.password = '비밀번호를 입력해 주세요.'
  }

  return errors
}
