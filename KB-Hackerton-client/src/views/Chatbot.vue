<script setup>
import { ref, nextTick } from 'vue'
import axios from 'axios'   // ✅ axios 불러오기

const messages = ref([
  { role: 'assistant', content: '안녕하세요! 소상공인 지원 챗봇입니다 😊 무엇을 도와드릴까요?' },
])

const newMessage = ref('')

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  // 1) 사용자 메시지 추가
  const userText = newMessage.value
  messages.value.push({ role: 'user', content: userText })
  newMessage.value = ''
  scrollToBottom()

  // 2) "생각하는 중..." 메시지 추가
  const thinkingIndex = messages.value.push({
    role: 'assistant',
    content: '생각하는 중...'
  }) - 1
  scrollToBottom()

  try {
    // 3) 서버에 POST 요청
    const res = await axios.post('https://zibitz.shop/chatbot', {
      message: userText
    })

    // 4) "생각하는 중..." 메시지 교체
    messages.value.splice(thinkingIndex, 1, {
      role: 'assistant',
      content: res.data?.data || '응답을 불러오지 못했습니다.'
    })
  } catch (err) {
    console.error(err)

    // 5) 에러 발생 시도 교체
    messages.value.splice(thinkingIndex, 1, {
      role: 'assistant',
      content: '❌ 오류가 발생했어요. 잠시 후 다시 시도해주세요.'
    })
  }

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
  <div class="flex flex-col h-full mx-[-1rem] bg-[#FAF9F6]">
    <!-- 헤더 -->


    <!-- 메시지 영역 -->
    <div id="chat-box" class="flex-1 overflow-y-auto p-4 space-y-3">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="[ 'flex', msg.role === 'user' ? 'justify-end' : 'justify-start' ]"
      >
        <div
          :class="[
            'px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow-sm',
            msg.role === 'user'
              ? 'bg-[#DA4C24] text-white rounded-br-none'
              : 'bg-white text-gray-800 border rounded-bl-none'
          ]"
        >
          {{ msg.content }}
        </div>
      </div>
    </div>

    <!-- 입력창 -->
    <form @submit.prevent="sendMessage" class="py-3 px-1 flex gap-2 border-t bg-white">
      <input
        v-model="newMessage"
        type="text"
        placeholder="메시지를 입력하세요..."
        class="flex-1 px-1 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C24]"
      />
      <button
        type="submit"
        class="bg-[#DA4C24] text-white px-2 py-2 rounded-lg hover:bg-[#B83C1C] transition"
      >
        보내기
      </button>
    </form>
  </div>
</template>

