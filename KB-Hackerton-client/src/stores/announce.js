import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/announce'

export const useAnnounceStore = defineStore('announce', () => {
  const loading = ref(false)
  const error = ref(null)

  const announceList = ref([])

  const getAnnounceList = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api.getAnnounceList()
      announceList.value = res.data.data
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, announceList, getAnnounceList }
})
