import api from '@/api'

const BASE_URL = '/checklists'

export default {
  async getChecklistList(announceId) {
    const res = await api.get(`${BASE_URL}/${announceId}`)
    return res
  },

  async isSaveDocument(announceId, items) {
    const res = api.put(`${BASE_URL}/announces/${announceId}/check`, items)
    return res
  },
}
