import axios from 'axios'

const api = axios.create({
  baseURL: 'https://zibitz.shop/',
  timeout: 10000,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
})

// 요청 인터셉터 (토큰 자동 추가)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
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
