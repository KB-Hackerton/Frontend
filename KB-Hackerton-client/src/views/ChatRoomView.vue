<script setup>
import { reactive, computed, nextTick, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import Stomp from 'webstomp-client'
import SockJS from 'sockjs-client/dist/sockjs'
import defaultProfile from '@/assets/images/banner.png'

import chatCompleteModal from '@/components/chat/ChatCompleteModal.vue'


//  defineProps: roomId가 URL 파라미터로 들어올 때 문자열이므로 Number로 변환해 사용합니다.
const props = defineProps({
  roomId: {
    type: [Number, String], // 문자열도 받을 수 있도록 허용
    required: true,
  },
})

const chatStore = useChatStore()


const router = useRouter() // 페이지 이동이 필요할 경우


// 새 모달의 표시 여부
const isCompleteModalVisible = ref(false)

// 참여자 목록을 저장할 상태 변수
const chatMembers = ref([])

// 모달 상태 관리 및 핸들러 함수 (기존과 동일하게 사용 가능)
const isDeleteModalVisible = ref(false)



// 종료 버튼 텍스트
const completionButtonText = computed(() => {
  return state.chatRoom.isComplete ? '완료됨' : '종료하기'
})


// --- 함수(Methods) 정의 ---

// SOS 종료 플로우 관련 함수
const openCompleteModal = async () => {
  if (state.chatRoom.isComplete) return
  try {
    const members = await chatStore.fetchChatMembersForCompletion(state.roomId)
    chatMembers.value = members
    isCompleteModalVisible.value = true
  } catch (error) {
    console.error('참여자 목록을 불러오는데 실패했습니다:', error)
    alert('오류가 발생했습니다. 다시 시도해주세요.')
  }
}

const closeCompleteModal = () => {
  isCompleteModalVisible.value = false
}

const handleSosComplete = async (selectedIds) => {
  try {
    // onMounted에서 불러온 state.chatRoom.sosId를 사용합니다.
    await chatStore.completeSos(state.chatRoom.sosId, selectedIds)
    alert('SOS 요청이 성공적으로 종료되었습니다.')
    closeCompleteModal()
    router.push('/main')
  } catch (error) {
    console.error('SOS 최종 완료에 실패했습니다:', error)
    alert('오류가 발생했습니다. 다시 시도해주세요.')
  }
}

const state = reactive({
  stompClient: null,
  messages: [],
  newMessage: '',
  user: {
    memberId: '',
    memberEmail: '',
    accessToken: '',
  },
  chatRoom: {
    chatRoomId: null,
    bussinessName: '로딩 중...', // 초기 로딩 텍스트
    sosType: '',
    memberBadge: '',
    isComplete: false,
    isOwner: false,
    partnerImage: '',
  },
  roomId: Number(props.roomId), // props 값을 Number로 변환하여 state에 저장
  sosId: null,
})

// sosType 값을 한글로 변환하기 위한 computed 속성
const sosTypeKorean = computed(() => {
  switch (state.chatRoom.sosType) {
    case 'stock':
      return '물품'
    // 다른 sosType이 있다면 여기에 추가
    case 'labor':
      return '인력'
    case 'equipment':
      return '고장'
    case 'etc':
      return '기타'
    default:
      return state.chatRoom.sosType // 매핑되지 않은 경우 원래 값 표시
  }
})


// 날짜별 메시지 그룹화
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

const scrollToBottom = () => {
  nextTick(() => {
    const chatBox = document.querySelector('.chat-area')
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight
  })
}

const markAsRead = () => {
  if (state.stompClient && state.stompClient.connected) {
    // prefix가 'publish'이므로 경로를 맞춰줍니다.
    const destination = `/publish/read/${state.roomId}`

    state.stompClient.send(
      destination,
      { Authorization: `Bearer ${state.user.accessToken}` },
      JSON.stringify({}),
    )
    // console.log(`✅ Sent read receipt to ${destination}`);
  } else {
    console.warn('⚠️ Stomp client not connected, cannot send read receipt.')
  }
}

// WebSocket 연결
const connectWebSocket = () => {
  if (state.stompClient?.connected) return

  try {
    const sockJs = new SockJS(
      `${import.meta.env.VITE_APP_API_BASE_URL}/connect?token=${state.user.accessToken}`,
    )
    state.stompClient = Stomp.over(sockJs)

    // connect 함수의 인수는 3개: headers, connectCallback, errorCallback
    state.stompClient.connect(
      // 1. Headers
      { Authorization: `Bearer ${state.user.accessToken}` },

      // 2. Connect Callback (연결 성공 시)
      () => {
        // console.log('✅ WebSocket connected successfully!');

        // subscribe 함수는 여기서 호출되고 끝나야 합니다.
        state.stompClient.subscribe(
          `/topic/${state.roomId}`,
          (message) => {
            // console.log('📩 Message received:', message.body);
            const webSocketMessage = JSON.parse(message.body)

            // 1. 메시지 타입이 'CHAT'일 경우
            if (webSocketMessage.type === 'CHAT') {
              const receivedMessage = webSocketMessage.payload

              // 기존 메시지 추가 로직
              state.messages.push(receivedMessage)
              scrollToBottom()

              if (receivedMessage.senderId !== state.user.memberId) {
                if (!document.hidden) {
                  markAsRead()
                }
              }
            }
            // 2. 메시지 타입이 'READ_UPDATE'일 경우
            else if (webSocketMessage.type === 'READ_UPDATE') {
              const readInfo = webSocketMessage.payload
              // console.log(`${readInfo.readerEmail} 님이 메시지를 읽었습니다.`);

              state.messages = state.messages.map((msg) => {
                if (msg.unreadCount > 0) {
                  // unreadCount 와 함께 isRead 값도 1로 변경해줍니다.
                  return { ...msg, unreadCount: 0, isRead: 1 }
                }
                return msg
              })
            }
          },
          { Authorization: `Bearer ${state.user.accessToken}` },
        )
        markAsRead()
      }, // connect()의 성공 콜백은 여기서 끝납니다.

      // 3. Error Callback (연결 실패 시)
      // connect() 함수의 세 번째 인수인 에러 콜백은 여기에 위치해야 합니다.
      (error) => {
        console.error('🔴 WebSocket connection failed:', error)
      },
    )
  } catch (error) {
    console.error('🔴 SockJS or Stomp client creation failed:', error)
  }
}

// 메시지 전송
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

// 정리 (읽음 처리 + disconnect)
const cleanup = async () => {
  if (!state.stompClient?.connected) return
  try {
    await chatStore.markAsRead(state.roomId)
    state.stompClient.unsubscribe(`/topic/${state.roomId}`);
    state.stompClient.disconnect()
    // console.log('🔌 WebSocket disconnected.')
  } catch (error) {
    console.error('🔴 Cleanup failed:', error)
  } finally {
    state.stompClient = null
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
      memberId: parsedUser.member_id,
    }

    state.chatRoom = await chatStore.getChatRoomDetail(state.roomId)
    console.log('🟢 채팅방 정보 불러오기 성공:', state.chatRoom)
    state.messages = await chatStore.getChatHistory(state.roomId)
    connectWebSocket()
    scrollToBottom()
  } catch (error) {
    console.error('🔴 초기화 중 오류 발생:', error)
  }
})

onBeforeUnmount(async () => {
  await cleanup()
})
</script>

<template>
  <div class="flex flex-col h-full mx-[-1rem] mt-[-1rem]">
    <div class="fixed w-full md:max-w-[365px]">
      <div class="flex items-end border-t bg-white px-4 pt-2 pb-1 shadow-sm gap-1">
        <h1 class="text-18 font-bold">{{ state.chatRoom.bussinessName }}</h1>
        <p class="text-14 text-gradient semibold">{{ state.chatRoom.memberBadge }}</p>
      </div>
      <div class="border-b bg-white px-4 pb-2">
        <div class="flex items-center justify-between">
          <div class="flex space-x-2">
            <span
              v-if="state.chatRoom.sosType"
              class="rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-600"
            >
              {{ sosTypeKorean }}
            </span>
          </div>
          <button
            v-if="state.chatRoom.isOwner"
            @click="openCompleteModal"
            :disabled="state.chatRoom.isComplete"
            class="rounded-md px-4 py-2 text-sm font-bold text-white transition-colors"
            :class="{
              'bg-rose-500 hover:bg-rose-600': !state.chatRoom.isComplete,
              'bg-gray-400 cursor-not-allowed': state.chatRoom.isComplete,
            }"
          >
            {{ completionButtonText }}
          </button>

        </div>


      </div>
    </div>

    <main
      class="chat-area flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden p-4 pt-[5rem] mb-[-3.5rem]"
    >
      <div v-for="(messagesInDate, date) in groupedMessages" :key="date">
        <div class="my-4 text-center text-sm text-gray-500">
          {{ formatDate(messagesInDate[0].createdAt) }}
        </div>

        <div v-for="msg in messagesInDate" :key="msg.id" class="mb-4 flex flex-col">
          <div v-if="msg.senderEmail !== state.user.memberEmail" class="flex items-end self-start">
            <div
              class="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-sm"
            >
              <img
                :src="
                    state.chatRoom.partnerImage? state.chatRoom.partnerImage + '?t=' + Date.now()
                    : defaultProfile
                "
                alt="프로필"
                class="w-12 h-12 rounded-md object-cover bg-gray-100 flex-shrink-0"
              />
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

    <footer class="border-t bg-white p-4 fixed bottom-0 md:max-w-[365px] w-full">
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


    <chatCompleteModal
      :show="isCompleteModalVisible"
      :members="chatMembers"
      @close="closeCompleteModal"
      @confirm="handleSosComplete"
    />
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
