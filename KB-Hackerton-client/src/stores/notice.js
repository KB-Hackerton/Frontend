import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/notice'

export const useNoticeStore = defineStore('notice', () => {
  const loading = ref(false)
  const error = ref(null)
  const noticeList = ref([])
  const noticeDetail = ref({})

  const getNoticeList = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api.getNoticeList()
      noticeList.value = res.data ?? []
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  const getNoticeDetail = async (id) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.getNoticeDetail(id)
      noticeDetail.value = res.data ?? {}
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, noticeList, noticeDetail, getNoticeList, getNoticeDetail }
})
