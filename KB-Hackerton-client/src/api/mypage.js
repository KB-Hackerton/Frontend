import api from '@/api'

// 프로필 이미지 업로드 API
export const uploadProfileImage = (file) => {
  const formData = new FormData()
  formData.append('file', file)

  return api.post('/profile-image/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
