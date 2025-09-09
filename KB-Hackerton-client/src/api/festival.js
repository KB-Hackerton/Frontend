import api from '@/api'

const BASE_URL = '/festival'

export default {
  async getFestivalList() {
    const res = await api.get(BASE_URL)
    return res
  },

  async getFestivalDetail(festivalId) {
    const res = await api.get(`${BASE_URL}/${festivalId}`)
    return res
  },
}
