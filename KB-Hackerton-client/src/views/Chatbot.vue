<script setup>
import { ref, nextTick } from 'vue'

const messages = ref([
  { role: 'assistant', content: '안녕하세요! 소상공인 지원 챗봇입니다 😊 무엇을 도와드릴까요?' },
])

const newMessage = ref('')

const sendMessage = () => {
  if (!newMessage.value.trim()) return

  messages.value.push({ role: 'user', content: newMessage.value })
  const userText = newMessage.value
  newMessage.value = ''

  setTimeout(() => {
    messages.value.push({
      role: 'assistant',
      content: `“${userText}”에 대한 정보를 찾아드릴게요!`,
    })
    scrollToBottom()
  }, 500)

  scrollToBottom()
}

const scrollToBottom = () => {
  nextTick(() => {
    const box = document.getElementById('chat-box')
    box.scrollTop = box.scrollHeight
  })
}
</script>

<template>
  <div class="flex flex-col h-[600px] max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
    <!-- 헤더 -->
    <div class="p-4 bg-[#DA4C24] text-white font-bold text-lg rounded-t-2xl">
      🐯 경상났네 챗봇
    </div>

    <!-- 메시지 영역 -->
    <div id="chat-box" class="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF9F6]">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="[
          'flex',
          msg.role === 'user' ? 'justify-end' : 'justify-start'
        ]"
      >
        <div
          :class="[
            'px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow-sm',
            msg.role === 'user'
              ? 'bg-[#DA4C24] text-white rounded-br-none'
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          ]"
        >
          {{ msg.content }}
        </div>
      </div>
    </div>

    <!-- 입력창 -->
    <form @submit.prevent="sendMessage" class="p-3 flex gap-2 border-t bg-white">
      <input
        v-model="newMessage"
        type="text"
        placeholder="메시지를 입력하세요..."
        class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C24]"
      />
      <button
        type="submit"
        class="bg-[#DA4C24] text-white px-4 py-2 rounded-lg hover:bg-[#B83C1C] transition"
      >
        보내기
      </button>
    </form>
  </div>
</template>
