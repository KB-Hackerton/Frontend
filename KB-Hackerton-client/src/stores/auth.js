import { ref } from 'vue'
import { defineStore } from 'pinia'
import { postLogin } from '@/api/auth.js'

export const useAuthStore = defineStore('Auth', () => {
  const accessToken = ref(localStorage.getItem('accessToken') || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const loading = ref(false)
  const error = ref('')

  // 로그인
  const loginUser = async (payload) => {
    loading.value = true
    error.value = ''

    try {
      // res = { code, message, data }
      const res = await postLogin(payload)

      if (res.code !== 200 || !res.data) {
        error.value = res.message || '로그인에 실패했습니다.'
        return false
      }

      const { access_token, refresh_token, member } = res.data

      if (!access_token || !refresh_token || !member) {
        error.value = '로그인 응답이 올바르지 않습니다.'
        return false
      }

      accessToken.value = access_token
      refreshToken.value = refresh_token
      user.value = member

      localStorage.setItem('accessToken', access_token)
      localStorage.setItem('refreshToken', refresh_token)
      localStorage.setItem('user', JSON.stringify(member))

      return true
    } catch (err) {
      console.error('❌ 로그인 에러', err)

      const status = err.response?.status
      if (status && String(status).startsWith('4')) {
        error.value = '이메일 또는 비밀번호가 올바르지 않습니다.'
      } else if (status && String(status).startsWith('5')) {
        error.value = '서버 오류로 로그인할 수 없습니다.'
      } else {
        error.value = '네트워크 오류로 로그인할 수 없습니다.'
      }

      return false
    } finally {
      loading.value = false
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    loading,
    error,
    loginUser,
  }
})
