import api from '@/api'

const BASE_URL = '/checklists'

export default {
  async getChecklistList(announceId) {
    const res = await api.get(`${BASE_URL}/${announceId}`)
    return res
  },
}
