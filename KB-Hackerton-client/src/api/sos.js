import api from '@/api'

const BASE_URL = '/sos'

export default {
  // SOS 목록 조회
  async getSosList() {
    const res = await api.get(BASE_URL)
    return res
  },

  // SOS 상세 조회
  async getSosDetail(sosId) {
    const res = await api.get(`${BASE_URL}/${sosId}`)
    return res
  },

  // SOS 생성
  async createSos(payload) {
    const res = await api.post(BASE_URL, payload)
    return res
  },

  // SOS 수정
  async updateSos(sosId, payload) {
    const res = await api.put(`${BASE_URL}/${sosId}`, payload)
    return res
  },

  // SOS 삭제
  async deleteSos(sosId) {
    const res = await api.delete(`${BASE_URL}/${sosId}`)
    return res
  },
}
