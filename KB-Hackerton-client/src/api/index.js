import axios from 'axios'

const api = axios.create({
  baseURL: 'https://zibitz.shop/',
  // baseURL: 'http://localhost:8080',

  timeout: 10000,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
})

// 요청 인터셉터 (토큰 자동 추가)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')

    // 로그인/비밀번호찾기/회원가입/이메일 요청에는 토큰 안 붙임
    const isAuthRequest =
      config.url.includes('/auth/login') ||
      config.url.includes('/auth/password') ||
      (config.url.includes('/auth/member-info') && config.method === 'post') ||
      config.url.includes('/email')
    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('인증 오류 발생')
    }
    return Promise.reject(error)
  },
)

export default api
