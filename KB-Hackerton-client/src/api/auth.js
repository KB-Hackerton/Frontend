import api from './index'

// 로그인
export const postLogin = async ({ email, password }) => {
  const res = await api.post('/auth/login', {
    member_email: email,
    password: password,
  })
  return res
}

// 비밀번호 찾기 - 이메일 인증번호 전송
export const rpSendEmailCode = async (email) => {
  const res = await api.post('/auth/email', { email })
  return res
}

// 비밀번호 찾기 - 비밀번호 재설정
export const resetPassword = async ({ email, password }) => {
  const res = await api.patch('/auth/password', {
    member_email: email,
    password: password,
  })
  return res
}

// 회원가입
export const postSignup = async (payload) => {
  const res = await api.post('/auth/member-info', payload)
  return res
}

// 이메일 인증번호 전송
export const sendEmailCode = async (email) => {
  const res = await api.post('/email', { email })
  return res
}

// 이메일 인증번호 검증
export const verifyEmailCode = async ({ email, code }) => {
  const res = await api.post('/email/verification', {
    email,
    verification_code: code,
  })
  return res
}

// 회원 탈퇴
export const deleteUser = () => {
  return api.delete('/auth/member-info')
}
