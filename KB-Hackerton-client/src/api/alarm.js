import api from '@/api'

const BASE_URL = '/alarm'

export default {
  async getAlarm() {
    const res = await api.get(`${BASE_URL}/preference`)
    return res
  },
}
