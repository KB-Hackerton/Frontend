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
