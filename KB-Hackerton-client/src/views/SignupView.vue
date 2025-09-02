<script setup>
import { ref } from 'vue'
import SignupStepPersonal from '@/components/signup/SignupStepPersonal.vue'
import SignupStepBusiness from '@/components/signup/SignupStepBusiness.vue'

// 현재 단계 (1: 개인정보, 2: 사업정보)
const step = ref(1)

function goNext() {
  if (step.value < 2) step.value++
}
function handleComplete() {
  console.log('회원가입 완료!')
}
</script>

<template>
  <div class="w-full h-full bg-white p-3">
    <!-- 단계 표시 -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <span
          :class="[
            'w-6 h-6 rounded-full flex items-center justify-center text-white text-12',
            step >= 1 ? 'bg-main' : 'bg-gray-200',
          ]"
        >
          1
        </span>
        <span v-if="step < 2" class="text-14">개인정보 입력</span>
      </div>
      <span class="text-gray-300">›</span>
      <div class="flex items-center gap-2">
        <span
          :class="[
            'w-6 h-6 rounded-full flex items-center justify-center text-white text-12',
            step >= 2 ? 'bg-main' : 'bg-gray-200',
          ]"
        >
          2
        </span>
        <span v-if="step >= 2" class="text-14">사업정보 입력</span>
      </div>
    </div>

    <!-- 입력폼 -->
    <div v-if="step === 1">
      <SignupStepPersonal @next="goNext" />
    </div>
    <div v-else>
      <SignupStepBusiness @complete="handleComplete" />
    </div>
  </div>
</template>

<style scoped></style>
