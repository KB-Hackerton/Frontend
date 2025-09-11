import api from '@/api/index.js'

const BASE_URL = '/chat'

export default {
  // 채팅방 목록 조회
  async getChatRoomList() {
    const res = await api.get(`${BASE_URL}/my/rooms`)
    return res
  },

  // 채팅방 상세 조회
  async getChatRoomDetail(roomId) {
    const res = await api.get(`${BASE_URL}/room/detail/${roomId}`)
    return res
  },

  // 채팅방 메시지 히스토리 조회
  async getChatHistory(roomId) {
    const res = await api.get(`${BASE_URL}/history/${roomId}`)
    return res
  },

  // 채팅방 읽음 처리
  async markAsRead(roomId) {
    const res = await api.post(`${BASE_URL}/room/${roomId}/read`, {})
    return res
  },

  // 채팅방 생성
  async createChatRoom(payload) {
    const res = await api.post(`${BASE_URL}/room/private/create`, payload)
    return res
  },


  // 채팅방 삭제
  async deleteChatRoom(roomId) {
    // 백엔드와 약속된 URL로 수정해야 합니다. 보통 /room/delete/{roomId} 형태를 많이 사용합니다.
    const res = await api.delete(`${BASE_URL}/room/delete/${roomId}`)
    return res
  },


  // 참여자 목록 불러오기 (SOS 종료 시)
  async getChatMembersForCompletion(roomId) {
    const res = await api.post(`${BASE_URL}/room/${roomId}/leave/select`, {})
    return res
  },

  // SOS 최종 완료
  async completeSosRequest(sosId, helperMemberIds) {
    const payload = { helperMemberIds } // { "helperMemberIds": [1, 2, 3] } 형태
    const res = await api.post(`/sos/${sosId}/complete`, payload)
    return res
  },


}
