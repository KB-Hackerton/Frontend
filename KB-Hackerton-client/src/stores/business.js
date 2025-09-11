import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/business'

export const useBusinessStore = defineStore('business', () => {
  const loading = ref(false)
  const error = ref('')
  const checkedBusinessValid = ref({})

  const checkedBusiness = async (business) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.postBusinessValidate(business)
      checkedBusinessValid.value = res?.data?.[0]?.valid || null
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }
  return { loading, error, checkedBusinessValid, checkedBusiness }
})
