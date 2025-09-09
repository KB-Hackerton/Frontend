import api from '@/api'

const BASE_URL = '/favorites'

export default {
  async setFavorite(announceId) {
    const res = await api.post(BASE_URL, { announceId: announceId })
    return res
  },

  async deleteFavorite(announceId) {
    const res = await api.delete(`${BASE_URL}/${announceId}`)
    return res
  },

  async getFavoriteList() {
    const res = await api.get(BASE_URL)
    return res
  },
}
