<script setup>
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  show: { type: Boolean, default: false }, // 모달 표시 여부
  message: { type: String, default: '비밀번호가 변경되었습니다.' }, // 표시할 메시지
})
const emit = defineEmits(['confirm'])
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
  >
    <div class="relative w-[330px] h-[200px] flex flex-col justify-between p-6 bg-white rounded-xl">
      <!-- 메시지 -->
      <div class="flex flex-1 items-center justify-center">
        <p class="font-semibold text-16 text-center whitespace-pre-line">
          {{ message }}
        </p>
      </div>

      <!-- 확인 버튼 -->
      <div class="flex justify-center">
        <BaseButton color="main" class="w-[200px]" @click="$emit('confirm')"> 확인 </BaseButton>
      </div>
    </div>
  </div>
</template>
