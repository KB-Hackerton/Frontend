import api from './index'

// 로그인
export const postLogin = ({ email, password }) => {
  return api.post('/auth/login', {
    member_email: email,
    password,
  })
}

// 회원가입
export const postSignup = async (payload) => {
  const res = await api.post('/auth/member-info', payload)
  return res
}

// 이메일 인증번호 전송
export const sendEmailCode = (email) => {
  return api.post('/email', { email })
}

// 이메일 인증번호 검증
export const verifyEmailCode = ({ email, code }) => {
  return api.post('/email/verification', {
    email,
    verification_code: code,
  })
}
