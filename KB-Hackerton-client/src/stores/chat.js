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
      console.log('채팅방 목록:', chatRoomList.value)
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

  // 채팅방 삭제
  const deleteChatRoom = async (roomId) => {
    loading.value = true
    error.value = null
    try {
      // 1단계에서 만든 api 함수를 호출합니다.
      await api.deleteChatRoom(roomId)

      // 성공적으로 삭제되면, 현재 목록(chatRoomList)에서도 해당 채팅방을 제거합니다.
      // 이렇게 하면 페이지를 새로고침하지 않아도 목록이 바로 갱신됩니다.
      chatRoomList.value = chatRoomList.value.filter(
        (room) => room.chatRoomId !== roomId, // room 객체의 id 키 이름(예: id, roomId)을 확인해주세요.
      )
    } catch (e) {
      error.value = e
      throw e // 에러를 상위로 전달하여 컴포넌트에서 처리할 수 있게 합니다.
    } finally {
      loading.value = false
    }
  }


  // 참여자 목록 불러오기
  const fetchChatMembersForCompletion = async (roomId) => {
    loading.value = true
    error.value = null
    try {
      // API를 호출하고 결과를 바로 반환합니다.
      const memberList = await api.getChatMembersForCompletion(roomId)
      return memberList
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  // SOS 최종 완료
  const completeSos = async (sosId, helperMemberIds) => {
    loading.value = true
    error.value = null
    try {
      await api.completeSosRequest(sosId, helperMemberIds)
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
    deleteChatRoom, // 추가한 함수
    fetchChatMembersForCompletion,
    completeSos,
  }
})
