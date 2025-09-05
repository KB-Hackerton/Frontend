<script setup>
import { defineEmits } from 'vue'
const emit = defineEmits(['close', 'click'])
</script>

<template>
  <div
    class="w-[20rem] h-[14rem] bg-white rounded-[0.7rem] flex flex-col items-center justify-between py-8"
  >
    <div class="pt-4">
      <p class="text-20 bold">정말 ‘경사났네’를</p>
      <p class="text-20 bold">떠나시겠습니까?</p>
    </div>

    <div class="flex gap-6 w-full px-5">
      <button
        @click="emit('close')"
        class="w-full h-[2.5rem] text-20 bold text-white bg-blue rounded-[10px] px-4 py-1 shadow-custom"
      >
        머무르기
      </button>
      <button
        @click="emit('click')"
        class="w-full h-[2.5rem] text-20 bold text-white bg-main rounded-[10px] px-4 py-1 shadow-custom"
      >
        떠나기
      </button>
    </div>
  </div>
</template>

<style scoped></style>
