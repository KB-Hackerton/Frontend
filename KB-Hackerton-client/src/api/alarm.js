import api from '@/api'

const BASE_URL = '/alarm/prefernce'

export default {
  async getAlarm() {
    const res = await api.get(BASE_URL)
    return res
  },
}
