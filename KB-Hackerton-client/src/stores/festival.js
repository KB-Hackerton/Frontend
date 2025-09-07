import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/festival'

export const useFestivalStore = defineStore('festival', () => {
  const loading = ref(false)
  const error = ref(null)

  const festivalList = ref([])

  const getFestivalList = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api.getFestivalList()
      festivalList.value = res?.data ?? []
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { loading, error, festivalList, getFestivalList }
})
