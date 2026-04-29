export const initialSignupForm = {
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  nickname: '',
}

export function validateSignupForm(form) {
  const errors = {}
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!form.email.trim()) {
    errors.email = '이메일을 입력해 주세요.'
  } else if (!emailPattern.test(form.email)) {
    errors.email = '올바른 이메일을 입력해 주세요.'
  }

  if (!form.password) {
    errors.password = '비밀번호를 입력해 주세요.'
  } else if (form.password.length < 6) {
    errors.password = '비밀번호는 6자 이상이어야 합니다.'
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = '비밀번호 확인을 입력해 주세요.'
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다.'
  }

  if (!form.name.trim()) {
    errors.name = '이름을 입력해 주세요.'
  }

  if (!form.nickname.trim()) {
    errors.nickname = '닉네임을 입력해 주세요.'
  }

  return errors
}
