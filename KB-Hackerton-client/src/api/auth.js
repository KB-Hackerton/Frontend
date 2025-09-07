import api from './index'

// 로그인
export const postLogin = ({ email, password }) => {
  return api.post('/auth/login', {
    member_email: email,
    password,
  })
}
