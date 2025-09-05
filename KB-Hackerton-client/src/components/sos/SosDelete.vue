<script setup>
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  show: { type: Boolean, default: false }, // 모달 표시 여부
})

const emit = defineEmits(['confirm', 'close'])
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-xl w-[330px] h-[230px] p-6 relative flex flex-col justify-between">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-black">✕</button>

      <div class="flex-1 flex items-center justify-center">
        <p class="font-semibold text-20 text-center">SOS 요청을<br />삭제하시겠습니까?</p>
      </div>

      <!-- 삭제 버튼 (하단 고정) -->
      <div class="flex justify-center">
        <BaseButton color="main" class="w-[200px]" @click="$emit('confirm')"> 삭제하기 </BaseButton>
      </div>
    </div>
  </div>
</template>
