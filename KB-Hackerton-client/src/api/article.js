import api from '@/api'

const BASE_URL = '/articles'

export default {
  async getArticleList() {
    const res = await api.get(BASE_URL)
    return res
  },
}
