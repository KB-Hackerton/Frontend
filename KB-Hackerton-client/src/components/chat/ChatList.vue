<script setup>
import { useRouter } from 'vue-router'

// Props
const props = defineProps({
  chats: {
    type: Array,
    required: true,
  },
})

// Emits
const emit = defineEmits(['select'])

// Router
const router = useRouter()

// 시각 포맷 (ISO → HH:mm)
function formatTime(timeStr) {
  const date = new Date(timeStr)
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 특정 채팅방으로 이동
function goToChatRoom(roomId) {
  router.push(`/chat-room/${roomId}`)
  emit('select', roomId)
}
</script>

<template>
  <ul>
    <li
      v-for="chat in chats"
      :key="chat.roomId"
      class="flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
      @click="goToChatRoom(chat.roomId)"
    >
      <!-- 프로필 이미지 -->
      <img
        :src="chat.partnerImage"
        alt="프로필"
        class="w-12 h-12 rounded-md object-cover bg-gray-100 flex-shrink-0"
      />

      <!-- 채팅 내용 -->
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-center">
          <p class="font-medium text-15 truncate">{{ chat.partnerName }}</p>
          <span class="text-12 text-gray-400">
            {{ formatTime(chat.lastMessageTime) }}
          </span>
        </div>
        <div class="flex justify-between items-center mt-1">
          <p class="text-14 text-gray-600 truncate">
            {{ chat.lastMessage }}
          </p>
          <!-- 안 읽은 메시지 개수 -->
          <span
            v-if="chat.unreadCount > 0"
            class="ml-2 px-2 py-0.5 bg-main text-white text-12 rounded-full flex-shrink-0"
          >
            {{ chat.unreadCount }}
          </span>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
