import api from '@/api'

// 프로필 이미지 업로드
export const uploadProfileImage = (file) => {
  const formData = new FormData()
  formData.append('file', file)

  return api.post('/profile-image/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// 사업 정보 수정
export const updateBusinessInfo = async (payload) => {
  const res = await api.patch('/auth/member-info', payload)
  return res
}

// 비밀번호 수정
export const updatePassword = (payload) => {
  return api.patch('/password', payload)
}
