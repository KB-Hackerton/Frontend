import api from '@/api'

const BASE_URL = '/notice'

export default {
  async getNoticeList() {
    const res = await api.get(`${BASE_URL}`)
    return res
  },
}
