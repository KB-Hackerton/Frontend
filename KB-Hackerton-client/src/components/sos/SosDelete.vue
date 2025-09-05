<script setup>
import BaseButton from '@/components/common/BaseButton.vue'

// Props & Emits
const props = defineProps({
  show: { type: Boolean, default: false }, // 모달 표시 여부
})
const emit = defineEmits(['confirm', 'close'])
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
  >
    <div class="relative w-[330px] h-[230px] flex flex-col justify-between p-6 bg-white rounded-xl">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-black">✕</button>

      <div class="flex flex-1 items-center justify-center">
        <p class="font-semibold text-20 text-center">SOS 요청을<br />삭제하시겠습니까?</p>
      </div>

      <!-- 삭제 버튼 (하단 고정) -->
      <div class="flex justify-center">
        <BaseButton color="main" class="w-[200px]" @click="$emit('confirm')"> 삭제하기 </BaseButton>
      </div>
    </div>
  </div>
</template>
