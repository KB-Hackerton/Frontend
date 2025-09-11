<script setup>
import { ref, onMounted, computed } from 'vue'
import ChatFilterBar from '@/components/chat/ChatFilterBar.vue'
import ChatList from '@/components/chat/ChatList.vue'
import { useChatStore } from '@/stores/chat'
import { storeToRefs } from 'pinia'


const chatStore = useChatStore()
const { chatRoomList, loading } = storeToRefs(chatStore)


// 필터 값을 위한 로컬 상태 (이것은 이 컴포넌트에서만 사용되므로 로컬 상태로 유지하는 것이 좋음)
const selectedFilter = ref('전체')

const user = localStorage.getItem('user')
const member_id = user ? JSON.parse(user).member_id : null
console.log(member_id)
onMounted(async () => {
  await chatStore.getChatRoomList()
})

// 필터링 로직
const filteredChats = computed(() => {

  if (selectedFilter.value === '전체') {
    return chatRoomList.value
  }
  if (selectedFilter.value === '안 읽은 채팅방') {
    return chatRoomList.value.filter((c) => c.unreadCount > 0)
  }
  if (selectedFilter.value === '요청') {
    return chatRoomList.value.filter((c) => c.ownerId === member_id)
  }
  if (selectedFilter.value === '출동') {
    return chatRoomList.value.filter((c) => c.ownerId !== member_id)
  }
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
