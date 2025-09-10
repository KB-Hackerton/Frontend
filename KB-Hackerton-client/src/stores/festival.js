import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/festival'

export const useFestivalStore = defineStore('festival', () => {
  const loading = ref(false)
  const error = ref(null)

  const festivalList = ref([])
  const festivalDetail = ref({})

  const getFestivalList = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api.getFestivalList()
      festivalList.value = res?.data ?? []
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  const getFestivalDetail = async (festivalId) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.getFestivalDetail(festivalId)
      festivalDetail.value = res?.data ?? {}
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, festivalList, festivalDetail, getFestivalList, getFestivalDetail }
})
