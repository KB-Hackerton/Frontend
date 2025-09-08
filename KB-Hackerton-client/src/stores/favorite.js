import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/favorite'

export const useFavoriteStore = defineStore('favorite', () => {
  const loading = ref(false)
  const error = ref(null)

  const setFavorite = async (announceId) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.setFavorite(announceId)
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  const deleteFavorite = async (announceId) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.deleteFavorite(announceId)
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, setFavorite, deleteFavorite }
})
