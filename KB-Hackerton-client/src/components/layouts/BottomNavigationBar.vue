<script setup>
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div
    class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full md:w-[375px] bg-gray-100 h-[90px] flex justify-center z-50"
  >
    <div class="h-[56px] mb-[34px] w-full flex align-center items-center gap-11 px-5">
      <RouterLink to="/" class="flex-1 flex flex-col items-center">
        <div
          class="flex flex-col items-center"
          :class="[route.path === '/' ? 'text-main' : 'text-gray-300 ']"
        >
          <Icon icon="material-symbols:home-rounded" class="w-[28px] h-auto" />
          <p class="semibold text-10">홈</p>
        </div>
      </RouterLink>

      <RouterLink to="/calendar" class="flex-1 flex flex-col items-center">
        <div
          class="flex flex-col items-center"
          :class="[route.path.startsWith('/calendar') ? 'text-main' : 'text-gray-300']"
        >
          <Icon icon="fe:calendar" class="w-[28px] h-auto" />
          <p class="semibold text-10">캘린더</p>
        </div>
      </RouterLink>

      <RouterLink to="/sos" class="flex-1 flex flex-col items-center">
        <div
          class="flex flex-col items-center"
          :class="[route.path.startsWith('/sos') ? 'text-main' : 'text-gray-300 ']"
        >
          <Icon icon="streamline-flex:sos-help-emergency-sign-solid" class="w-[28px] h-auto" />
          <p class="semibold text-10">SOS</p>
        </div>
      </RouterLink>

      <RouterLink to="/chat-list" class="flex-1 flex flex-col items-center">
        <div
          class="flex flex-col items-center"
          :class="[route.path.startsWith('/chat-list') ? 'text-main' : 'text-gray-300 ']"
        >
          <Icon icon="material-symbols:chat" class="w-[28px] h-auto" />
          <p class="semibold text-10">채팅</p>
        </div>
      </RouterLink>

      <RouterLink to="/favorites" class="flex-1 flex flex-col items-center">
        <div
          class="flex flex-col items-center"
          :class="[route.path.startsWith('/favorites') ? 'text-main' : 'text-gray-300 ']"
        >
          <Icon icon="material-symbols:kid-star" class="w-[28px] h-auto" />
          <p class="semibold text-10 whitespace-nowrap">즐겨찾기</p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
