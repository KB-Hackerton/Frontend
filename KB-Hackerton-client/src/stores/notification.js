import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/notification'

export const useNotificationStore = defineStore('notification', () => {
  const loading = ref(false)
  const error = ref(null)

  const notificationList = ref([])

  const getNotificationList = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api.getNotificationList()
      notificationList.value = res.data ?? []
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, notificationList, getNotificationList }
})
