import api from '@/api'

const BASE_URL = '/alarm'

export default {
  async getNotificationList() {
    const res = await api.get(`${BASE_URL}`)
    return res
  },
}
