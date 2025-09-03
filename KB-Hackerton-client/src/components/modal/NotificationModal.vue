<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['close'])
</script>

<template>
  <div
    class="w-[20rem] h-[14rem] bg-white rounded-[1rem] flex flex-col items-center justify-between py-8"
  >
    <p class="text-20 bold">{{ props.notification.title }}</p>
    <p class="text-16 medium px-12 text-center line-clamp-2 leading-7">
      {{ props.notification.content }}
    </p>
    <div class="flex gap-6 w-full px-5">
      <button
        class="w-full h-[2.5rem] text-20 bold text-white bg-blue rounded-[10px] px-4 py-1 shadow-custom"
      >
        이동하기
      </button>
      <button
        @click="emit('close')"
        class="w-full h-[2.5rem] text-20 bold text-white bg-main rounded-[10px] px-4 py-1 shadow-custom"
      >
        확인
      </button>
    </div>
  </div>
</template>

<style scoped></style>
