import api from '@/api'

const BASE_URL = '/home'

export default {
  async getHome() {
    const res = await api.get(`${BASE_URL}`)
    return res
  },
}
