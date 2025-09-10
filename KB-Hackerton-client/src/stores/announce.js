import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/announce'

export const useAnnounceStore = defineStore('announce', () => {
  const loading = ref(false)
  const error = ref(null)

  const announceList = ref([])
  const announceDetail = ref({})

  const getAnnounceDetail = async (id) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.getAnnounceDetail(id)
      announceDetail.value = res?.data ?? {}
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  const getAnnounceList = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api.getAnnounceList()
      announceList.value = res?.data ?? []
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, announceList, announceDetail, getAnnounceDetail, getAnnounceList }
})
