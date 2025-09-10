<script setup>
import { reactive, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import Stomp from 'webstomp-client'
import SockJS from 'sockjs-client/dist/sockjs'
import axios from 'axios'

//  defineProps: roomId가 URL 파라미터로 들어올 때 문자열이므로 Number로 변환해 사용합니다.
const props = defineProps({
  roomId: {
    type: [Number, String], // 문자열도 받을 수 있도록 허용
    required: true,
  },
})

const state = reactive({
  stompClient: null,
  messages: [],
  newMessage: '',
  user: {
    memberEmail: '',
    accessToken: '',
  },
  chatRoom: {
    chatRoomId: null,
    roomName: '어차피 운동할거면 여기서', // 예시 제목
  },
  // props 값을 Number로 변환하여 state에 저장
  roomId: Number(props.roomId),
})

// 2. [추가] 메시지를 날짜별로 그룹화하는 computed 속성
const groupedMessages = computed(() => {
  const groups = {}
  state.messages.forEach((msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(msg)
  })
  return groups
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

const connectWebSocket = () => {
  if (state.stompClient?.connected) return

  try {
    const sockJs = new SockJS(
      `${import.meta.env.VITE_APP_API_BASE_URL}/connect?token=${state.user.accessToken}`,
    )
    state.stompClient = Stomp.over(sockJs)
    state.stompClient.connect(
      { Authorization: `Bearer ${state.user.accessToken}` },
      () => {
        console.log('✅ WebSocket connected successfully!')
        state.stompClient.subscribe(
          `/topic/${state.roomId}`,
          (message) => {
            console.log('📩 Message received:', message.body)
            const receivedMessage = JSON.parse(message.body)
            if (!receivedMessage.senderEmail && receivedMessage.senderId) {
              receivedMessage.senderEmail = state.user.memberEmail
            }
            state.messages.push(receivedMessage)

            scrollToBottom()
          },
          { Authorization: `Bearer ${state.user.accessToken}` },
        )
      },
      (error) => {
        console.error('🔴 WebSocket connection failed:', error)
      },
    )
  } catch (error) {
    console.error('🔴 SockJS or Stomp client creation failed:', error)
  }
}

const sendMessage = () => {
  if (state.newMessage.trim() === '' || !state.stompClient?.connected) return

  const messagePayload = {
    message: state.newMessage,
    roomId: state.roomId,
  }

  state.stompClient.send(`/publish/${state.roomId}`, JSON.stringify(messagePayload), {
    Authorization: `Bearer ${state.user.accessToken}`,
  })
  state.newMessage = ''
}

const scrollToBottom = () => {
  nextTick(() => {
    const chatBox = document.querySelector('.chat-area')
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight
    }
  })
}

const cleanup = async () => {
  if (state.stompClient?.connected) {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_BASE_URL}/chat/room/${state.roomId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${state.user.accessToken}` },
        },
      )
      if (state.stompClient.value && state.stompClient.value.connected) {
        state.stompClient.value.unsubscribe(`/topic/${state.roomId}`)
        state.stompClient.value.disconnect()
      }
      state.stompClient.disconnect()
      console.log('🔌 WebSocket disconnected.')
    } catch (error) {
      console.error('🔴 Cleanup failed:', error)
    } finally {
      state.stompClient = null
    }
  }
}
onMounted(async () => {
  try {
    const userString = localStorage.getItem('user')
    const accessToken = localStorage.getItem('accessToken')

    if (!userString || !accessToken) {
      console.error('사용자 정보 또는 토큰이 없습니다. 로그인이 필요합니다.')
      return
    }

    const parsedUser = JSON.parse(userString)
    state.user = {
      memberEmail: parsedUser.member_email,
      accessToken: accessToken,
    }

    // API 호출 시 state.roomId 사용 (이미 숫자로 변환됨)
    const roomResponse = await axios.get(
      `${import.meta.env.VITE_APP_API_BASE_URL}/chat/room/detail/${state.roomId}`,
      { headers: { Authorization: `Bearer ${state.user.accessToken}` } },
    )
    state.chatRoom = roomResponse.data
    console.log(state.chatRoom)
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_BASE_URL}/chat/history/${state.roomId}`,
      { headers: { Authorization: `Bearer ${state.user.accessToken}` } },
    )
    state.messages = response.data
    console.log(state.messages)
    connectWebSocket() // 실제 사용 시 주석 해제
    scrollToBottom()
  } catch (error) {
    console.error('🔴 초기화 중 오류 발생:', error)
  }
})

onBeforeUnmount(cleanup)
onBeforeRouteLeave((to, from, next) => {
  cleanup()
  next()
})
</script>

<template>
  <div class="flex h-screen flex-col bg-gray-50">
    <header class="flex items-center justify-between border-b bg-white p-4 shadow-sm">
      <button class="p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h1 class="text-lg font-bold">{{ state.chatRoom.roomName }}</h1>
      <div class="flex items-center space-x-2">
        <button class="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
        <button class="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>

    <div class="border-b bg-white p-4">
      <div class="flex items-center justify-between">
        <div class="flex space-x-2">
          <span class="rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-600">요청</span>
          <span class="rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-600">보통</span>
          <span class="rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-600">인력</span>
        </div>
        <button
          class="rounded-md bg-rose-500 px-4 py-2 text-sm font-bold text-white hover:bg-rose-600"
        >
          종료하기
        </button>
      </div>
    </div>

    <main class="chat-area flex-1 overflow-y-auto bg-gray-100 p-4">
      <div v-for="(messagesInDate, date) in groupedMessages" :key="date">
        <div class="my-4 text-center text-sm text-gray-500">
          {{ formatDate(messagesInDate[0].createdAt) }}
        </div>

        <div v-for="msg in messagesInDate" :key="msg.id" class="mb-4 flex flex-col">
          <div v-if="msg.senderEmail !== state.user.memberEmail" class="flex items-end self-start">
            <div
              class="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                />
              </svg>
            </div>
            <div class="max-w-xs rounded-2xl rounded-bl-none bg-white p-3 shadow-md md:max-w-md">
              <p class="text-base text-gray-800">{{ msg.content }}</p>
            </div>
            <p class="ml-2 text-xs text-gray-400">
              {{
                new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                })
              }}
            </p>
          </div>

          <div v-else class="flex items-end self-end">
            <div v-if="msg.isRead === 0" class="mr-2 text-xs font-bold text-yellow-500">1</div>
            <p class="mr-2 text-xs text-gray-400">
              {{
                new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                })
              }}
            </p>
            <div
              class="max-w-xs rounded-2xl rounded-br-none bg-main p-3 text-white shadow-md md:max-w-md"
            >
              <p class="text-base">{{ msg.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="border-t bg-white p-4 fixed bottom-0 left-0 right-0">
      <div class="flex items-center gap-2">
        <input
          v-model="state.newMessage"
          type="text"
          placeholder="메시지 보내기"
          @keyup.enter="sendMessage"
          class="flex-1 rounded-full border-none bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <button
          @click="sendMessage"
          :disabled="!state.newMessage.trim()"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.chat-area::-webkit-scrollbar {
  width: 8px;
}

.chat-area::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-area::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.chat-area::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.read-status {
  position: absolute;
  top: 6px;
  right: 12px;
  font-size: 0.75rem;
  color: #a3a3a3;
}
</style>
