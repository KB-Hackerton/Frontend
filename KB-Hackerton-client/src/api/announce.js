import api from '@/api'

const BASE_URL = '/announce'

export default {
  async getAnnounceList() {
    const res = await api.get(BASE_URL)
    return res
  },
}
