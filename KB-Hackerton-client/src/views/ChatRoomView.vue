<script setup>
import { reactive, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import Stomp from 'webstomp-client'
import SockJS from 'sockjs-client/dist/sockjs'
import axios from 'axios'

const state = reactive({
  stompClient: null,
  messages: [],
  newMessage: '',
  user: {
    memberEmail: '',
    accessToken: '',
  },
  roomId: 1,
})

const connectWebSocket = () => {
  if (state.stompClient?.connected) return;

  try {
    const sockJs = new SockJS(`${import.meta.env.VITE_APP_API_BASE_URL}/connect?token=${state.user.accessToken}`);
    state.stompClient = Stomp.over(sockJs);
    state.stompClient.debug = () => {};

    state.stompClient.connect(
      { Authorization: `Bearer ${state.user.accessToken}` },
      () => {
        console.log('✅ WebSocket connected successfully!');
        state.stompClient.subscribe(`/topic/${state.roomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          // 실시간으로 오는 메시지는 senderEmail이 없을 수 있으므로 추가해줍니다.
          if (!receivedMessage.senderEmail && receivedMessage.senderId) {
            // 이 부분은 백엔드에서 내려주는 실시간 메시지 DTO 구조에 따라 조정이 필요할 수 있습니다.
            // 지금은 임시로 현재 사용자 이메일을 넣어줍니다.
            receivedMessage.senderEmail = state.user.memberEmail;
          }
          state.messages.push(receivedMessage);
          scrollToBottom();
        }, { Authorization: `Bearer ${state.user.accessToken}` });
      },
      (error) => {
        console.error('🔴 WebSocket connection failed:', error);
      }
    );
  } catch (error) {
    console.error('🔴 SockJS or Stomp client creation failed:', error);
  }
};

const sendMessage = () => {
  if (state.newMessage.trim() === '' || !state.stompClient?.connected) return;

  const messagePayload = {
    message: state.newMessage,
    roomId: state.roomId,
  };

  state.stompClient.send(`/publish/${state.roomId}`, JSON.stringify(messagePayload), {
    Authorization: `Bearer ${state.user.accessToken}`,
  });
  state.newMessage = '';
};

const scrollToBottom = () => {
  nextTick(() => {
    const chatBox = document.querySelector('.chat-area');
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });
};

const cleanup = async () => {
  if (state.stompClient?.connected) {
    try {
      await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/chat/room/${state.roomId}/read`, {}, {
        headers: { Authorization: `Bearer ${state.user.accessToken}` },
      });
      state.stompClient.disconnect();
      console.log('🔌 WebSocket disconnected.');
    } catch (error) {
      console.error('🔴 Cleanup failed:', error);
    } finally {
      state.stompClient = null;
    }
  }
};

onMounted(async () => {
  try {
    const userString = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    if (!userString || !accessToken) {
      console.error('사용자 정보 또는 토큰이 없습니다. 로그인이 필요합니다.');
      return;
    }

    // ★★★★★ 문제 해결 1: snake_case -> camelCase로 명시적 변환 ★★★★★
    const parsedUser = JSON.parse(userString);
    state.user = {
      memberEmail: parsedUser.member_email, // 이 부분이 핵심 수정사항입니다.
      accessToken: accessToken
    };
    console.log('👤 사용자 정보:', state.user.memberEmail);

    const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/chat/history/${state.roomId}`, {
      headers: { Authorization: `Bearer ${state.user.accessToken}` },
    });
    state.messages = response.data;
    console.log('📨 채팅 내역:', state.messages);
    for (const responseElement of state.messages) {
      console.log('📨 채팅 내역 요소:', responseElement.content);
    }
    connectWebSocket();
    scrollToBottom();

  } catch (error) {
    console.error('🔴 초기화 중 오류 발생:', error);
  }
});

onBeforeUnmount(cleanup);
onBeforeRouteLeave((to, from, next) => {
  cleanup();
  next();
});
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-gray-100 p-4">
    <div class="flex h-[calc(100vh-4rem)] w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl">
      <header class="flex items-center justify-between rounded-t-xl border-b p-4">
        <h1 class="text-xl font-bold text-gray-800">채팅방 (ID: {{ state.roomId }})</h1>
        <button class="text-gray-500 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <main class="chat-area flex-1 space-y-6 overflow-y-auto p-6">
        <div v-for="(msg, index) in state.messages" :key="index"
             class="flex"
             :class="msg.senderEmail === state.user.memberEmail ? 'justify-end' : 'justify-start'">
          <div class="max-w-xs md:max-w-md">
            <div class="rounded-2xl p-3"
                 :class="{
                   'bg-main text-white rounded-br-none': msg.senderEmail === state.user.memberEmail,
                   'bg-gray-200 ': msg.senderEmail !== state.user.memberEmail
                 }">
              <p></p>
              <p class="text-base">{{ msg.content }}</p>
            </div>
            <p class="mt-1 text-right text-xs text-gray-400">
              {{ new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) }}
            </p>
          </div>
        </div>
      </main>

      <footer class="border-t p-4">
        <div class="flex items-center gap-2">
          <input
            v-model="state.newMessage"
            type="text"
            placeholder="메시지를 입력하세요..."
            @keyup.enter="sendMessage"
            class="flex-1 rounded-full border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            @click="sendMessage"
            :disabled="state.newMessage.trim() === ''"
            class="rounded-full bg-blue-600 p-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 rotate-90" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
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
</style>
