import api from '@/api'

const BASE_URL = '/alarm'

export default {
  async getNotificationList() {
    const res = await api.get(`${BASE_URL}`)
    return res
  },

  async readNotification(notificationId) {
    const res = await api.patch(`${BASE_URL}/${notificationId}/read`)
    return res
  },
}
