<script setup>
import { onMounted,watchEffect } from 'vue'
import { useRouter } from 'vue-router';
import { useChatRoomListStore } from '@/stores/chatRoomList.js'
import { storeToRefs } from 'pinia'

const chatRoomListStore = useChatRoomListStore()
const { chatRoomList, loading, error } = storeToRefs(chatRoomListStore)

const router = useRouter();


// 특정 채팅방으로 이동하는 함수
const goToChatRoom = (roomId) => {
  router.push(`/chat-room/${roomId}`);
};



onMounted(() => {
  chatRoomListStore.getChatRoomList();
});
</script>

<template>
  <div class="chat-list-container">
    <h2>참여중인 채팅방 목록</h2>

    <div v-if="loading" class="loading-message">
      <p>채팅 목록을 불러오는 중입니다...</p>
    </div>

    <div v-if="error" class="error-message">
      <p>오류가 발생했습니다: {{ error }}</p>
    </div>

    <ul v-if="!loading && !error && chatRoomList.length > 0" class="chat-room-list">
      <li
        v-for="room in chatRoomList"
        :key="room.roomId"
        class="chat-room-item"
        @click="goToChatRoom(room.roomId)"
      >
        <span class="room-name">{{ room.roomName }}</span>
        <span v-if="room.unReadCount > 0" class="unread-badge">
          {{ room.unReadCount }}
        </span>
      </li>
    </ul>

    <div v-if="!loading && !error && chatRoomList.length === 0" class="no-rooms-message">
      <p>참여중인 채팅방이 없습니다.</p>
    </div>
  </div>
</template>


<style scoped>
.chat-list-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
  margin-top: 0;
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
}

.chat-room-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.chat-room-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.2rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.chat-room-item:hover {
  background-color: #f9f9f9;
}

.chat-room-item:last-child {
  border-bottom: none;
}

.room-name {
  font-size: 1.1rem;
  font-weight: 500;
  color: #444;
}

.unread-badge {
  background-color: #ef4444; /* red-500 */
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.3rem 0.6rem;
  border-radius: 9999px; /* pill shape */
  min-width: 24px;
  text-align: center;
}

.loading-message,
.error-message,
.no-rooms-message {
  text-align: center;
  color: #777;
  padding: 2rem;
}

.error-message {
  color: #d9534f;
}
</style>
