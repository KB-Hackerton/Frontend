import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/checklist'

export const useChecklistStore = defineStore('checklist', () => {
  const loading = ref(false)
  const error = ref(null)

  const checklistData = ref({})

  const getChecklistList = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.getChecklistList(id)
      checklistData.value = response ?? {}
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const updateChecklist = async (announceId, items) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.isSaveDocument(announceId, items)
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, checklistData, getChecklistList, updateChecklist }
})
