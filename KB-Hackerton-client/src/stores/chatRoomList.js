import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/chatRoomList'

export const useChatRoomListStore = defineStore('chatRoomList', () => {
  const loading = ref(false)
  const error = ref(null)

  const chatRoomList = ref([])

  const getChatRoomList = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api.getChatRoomList()
      chatRoomList.value = res ?? []

    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, chatRoomList, getChatRoomList }
})
