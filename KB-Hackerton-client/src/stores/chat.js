import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/chat'

export const useChatStore = defineStore('chat', () => {
  const loading = ref(false)
  const error = ref(null)

  const chatRoomList = ref([])

  // 채팅방 목록 조회
  const getChatRoomList = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api.getChatRoomList()
      chatRoomList.value = res ?? []
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  // 채팅방 상세 조회
  const getChatRoomDetail = async (roomId) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.getChatRoomDetail(roomId)
      return res
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  // 채팅방 메시지 히스토리 조회
  const getChatHistory = async (roomId) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.getChatHistory(roomId)
      return res
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  // 채팅방 읽음 처리
  const markAsRead = async (roomId) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.markAsRead(roomId)
      return res
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  // 채팅방 생성
  const createChatRoom = async ({ sos_id, other_member_id }) => {
    loading.value = true
    error.value = null

    try {
      const res = await api.createChatRoom({ sos_id, other_member_id })
      return res
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    chatRoomList,
    getChatRoomList,
    getChatRoomDetail,
    getChatHistory,
    markAsRead,
    createChatRoom,
  }
})
