<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  title: { type: String, required: true },
})
const emit = defineEmits(['close'])
</script>

<template>
  <div>
    <div
      class="w-[20rem] h-[14rem] bg-white rounded-[1rem] flex flex-col items-center justify-between py-8"
    >
      <p class="text-20 bold text-center w-[12rem]">{{ props.title }}</p>
      <div class="flex gap-6 w-full px-5">
        <button
          @click="emit('close')"
          class="w-full h-[2.5rem] text-20 bold text-white bg-main rounded-[10px] px-4 py-1 shadow-custom"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
