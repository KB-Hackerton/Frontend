import api from '@/api'

export default {
  async setFavorite() {
    const res = await api.put()
    return res
  },

  async deleteFavorite() {
    const res = await api.delete()
    return res
  },
}
