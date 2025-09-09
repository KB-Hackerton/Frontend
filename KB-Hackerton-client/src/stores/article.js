import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/article'

export const useArticleStore = defineStore('article', () => {
  const loading = ref(false)
  const error = ref(null)

  const articleList = ref([])

  const getArticleList = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api.getArticleList()
      articleList.value = res.data ?? []
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, articleList, getArticleList }
})
