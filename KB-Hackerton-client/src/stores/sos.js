import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/sos'

export const useSosStore = defineStore('sos', () => {
  const loading = ref(false)
  const error = ref(null)

  const fetchList = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api.getSosList()
      return res
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  const fetchDetail = async (id) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.getSosDetail(id)
      return res
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  const createSos = async ({ sos_type, expires_at, sos_title, sos_content, images = [] }) => {
    loading.value = true
    error.value = null
    try {
      const fd = new FormData()
      fd.append('sos_type', sos_type)
      fd.append('expires_at', expires_at)
      fd.append('sos_title', sos_title)
      fd.append('sos_content', sos_content)
      images.forEach((f) => fd.append('images', f))

      const res = await api.createSos(fd)
      return res
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteSos = async (id) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.deleteSos(id)
      return res
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateSos = async (
    id,
    { sos_type, expires_at, sos_title, sos_content, deleteImageIds = [], newImages = [] },
  ) => {
    loading.value = true
    error.value = null
    try {
      const fd = new FormData()
      fd.append('sos_type', sos_type)
      fd.append('expires_at', expires_at)
      fd.append('sos_title', sos_title)
      fd.append('sos_content', sos_content)

      // ✅ 여기서 deleteImageIds와 newImages 안전하게 처리
      if (deleteImageIds && deleteImageIds.length > 0) {
        deleteImageIds.forEach((id) => fd.append('deleteImageIds', id))
      }

      if (newImages && newImages.length > 0) {
        newImages.forEach((file) => fd.append('newImages', file))
      }

      const res = await api.updateSos(id, fd)
      return res
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, fetchList, fetchDetail, createSos, deleteSos, updateSos }
})
