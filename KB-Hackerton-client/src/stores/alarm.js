import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/alarm'

export const useAlarmStore = defineStore('alarm', () => {
  const loading = ref(false)
  const error = ref(null)

  const alarmData = ref({})

  const getAlarmData = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api.getAlarm()
      alarmData.value = res?.data ?? {}
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, alarmData, getAlarmData }
})
