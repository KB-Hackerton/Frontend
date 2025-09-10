import { defineStore } from 'pinia'
import { ref } from 'vue'
import { uploadProfileImage } from '@/api/mypage'
import { useAuthStore } from '@/stores/auth'

export const useMypageStore = defineStore('mypage', () => {
  const loading = ref(false)
  const error = ref(null)

  // 프로필 이미지 업로드
  const updateProfileImage = async (file) => {
    loading.value = true
    error.value = null
    try {
      const res = await uploadProfileImage(file)
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

  return {
    loading,
    error,
    updateProfileImage,
  }
})
