<script setup>
import { ref, onMounted } from 'vue'
import ChatFilterBar from '@/components/chat/ChatFilterBar.vue'
import ChatList from '@/components/chat/ChatList.vue'

// 더미 데이터
import chatData from '@/_dummy/chat.json'

const chats = ref([])
const selectedFilter = ref('전체')

onMounted(() => {
  chats.value = chatData
})

// 필터링 로직 (예시)
const filteredChats = computed(() => {
  if (selectedFilter.value === '전체') return chats.value
  if (selectedFilter.value === '안 읽은 채팅방') {
    return chats.value.filter((c) => c.unreadCount > 0)
  }
  // TODO: '요청', '출동' 카테고리 필터링 로직 추가
  return chats.value
})
</script>

<template>
  <div class="flex flex-col h-full bg-white">
    <!-- 필터바 -->
    <ChatFilterBar v-model:selected="selectedFilter" />

    <!-- 채팅 목록 -->
    <div class="flex-1 overflow-y-auto">
      <ChatList :chats="filteredChats" />
    </div>
  </div>
</template>
