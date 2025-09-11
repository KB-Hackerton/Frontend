import { defineStore } from 'pinia'
import { ref } from 'vue'
import { updateProfileImage, updateBusinessInfo, updatePassword } from '@/api/mypage'
import { useAuthStore } from '@/stores/auth'

export const useMypageStore = defineStore('mypage', () => {
  const loading = ref(false)
  const error = ref(null)

  // 사업정보 수정 데이터
  const businessInfo = ref({
    businessNum: '',
    ceoName: '',
    companyName: '',
    openDate: '',
    categorySub: '', // minor_code (소분류 코드)
    address: '',
    addressDetail: '',
  })

  // 프로필 이미지 수정
  const editProfileImage = async (file) => {
    loading.value = true
    error.value = null
    try {
      const res = await updateProfileImage(file)
      console.log('🔎 업로드 응답:', res)

      if (res.code === 200) {
        const authStore = useAuthStore()

        const imageUrl = typeof res.data === 'string' ? res.data : res.data.url

        Object.assign(authStore.user, { profile_image_id: imageUrl })

        localStorage.setItem('user', JSON.stringify(authStore.user))

        return { code: 200, url: imageUrl }
      } else {
        error.value = res.message || '이미지 업로드 실패'
        return false
      }
    } catch (err) {
      console.error('❌ 프로필 이미지 업로드 실패', err)
      error.value = '업로드 중 오류 발생'
      return false
    } finally {
      loading.value = false
    }
  }

  // 사업 정보 수정
  const editBusinessInfo = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const res = await updateBusinessInfo(payload)
      console.log('🔎 수정 응답:', res)

      if (res.code === 200) {
        const authStore = useAuthStore()
        // authStore.user 갱신
        authStore.user = { ...authStore.user, ...payload }

        localStorage.setItem('user', JSON.stringify(authStore.user))
        return true
      } else {
        error.value = res.message || '사업 정보 수정 실패'
        return false
      }
    } catch (err) {
      console.error('❌ 사업 정보 수정 실패', err)
      error.value = '요청 중 오류 발생'
      return false
    } finally {
      loading.value = false
    }
  }

  // 비밀번호 수정
  const changePassword = async ({ originalPassword, newPassword }) => {
    loading.value = true
    error.value = null
    try {
      const res = await updatePassword({
        original_password: originalPassword,
        new_password: newPassword,
      })
      return res
    } catch (err) {
      error.value = err.response?.data?.message || '비밀번호 변경 실패'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    editProfileImage,
    editBusinessInfo,
    changePassword,
  }
})
