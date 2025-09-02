import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 더미 계정
  const dummy = {
    memberId: 1,
    businessId: 1,
    profileImageId: 1,
    email: 'test@test.com',
    memberName: '김감자',
    createdAt: '2025-09-02T04:12:45.000+00:00',
    helpCount: 10,
    badge: '도움왕',
    authMap: [{ authority: 'Member' }],
  }

  // 로그인
  async function loginUser(email, password) {
    if (loading.value) return
    loading.value = true
    error.value = null

    try {
      await new Promise((r) => setTimeout(r, 500)) // 더미 API 딜레이

      // 더미 계정 검증
      if (email === 'test@test.com' && password === '1234') {
        token.value = 'dummy-token'
        user.value = dummy

        localStorage.setItem('accessToken', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
        return true
      } else {
        error.value = '이메일 또는 비밀번호가 올바르지 않습니다.'
        return false
      }
    } catch (e) {
      error.value = e.message || '로그인에 실패했습니다.'
      return false
    } finally {
      loading.value = false
    }
  }

  // 로그아웃
  function logoutUser() {
    token.value = null
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  return { user, token, loading, error, loginUser, logoutUser }
})
