<script setup>
import { ref, computed } from 'vue'
import BaseInput from '../common/BaseInput.vue'
import BaseButton from '../common/BaseButton.vue'

const emit = defineEmits(['next'])

// 입력값 관리
const email = ref('')
const code = ref('')
const password = ref('')
const passwordCheck = ref('')

// 약관 항목 리스트
const terms = [
  { label: '[필수] 서비스 이용약관 동의', required: true },
  { label: '[필수] 개인정보 수집·이용 동의', required: true },
  { label: '[필수] 개인정보 제3자 제공 동의', required: true },
  { label: '[선택] 위치정보 이용 동의', required: false },
  { label: '[선택] 마케팅/광고 수신 동의', required: false },
]

const termChecks = ref(terms.map(() => false))

// 모두 동의 체크 상태
const agreeAll = computed({
  get: () => termChecks.value.every(Boolean),
  set: (val) => {
    termChecks.value = terms.map(() => val)
  },
})

// 유효성 검사
const isFormValid = computed(() => {
  const inputsFilled = email.value && code.value && password.value && passwordCheck.value
  const passwordMatch = password.value === passwordCheck.value
  const requiredTermsChecked = terms.every((t, i) => (t.required ? termChecks.value[i] : true))
  return inputsFilled && passwordMatch && requiredTermsChecked
})
</script>

<template>
  <div class="flex flex-col gap-6 mt-5">
    <div>
      <label for="email" class="block font-semibold text-16 text-gray-300">
        이메일 <span class="text-red">*</span>
      </label>
      <div class="flex gap-2">
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="이메일을 입력해주세요."
          autocomplete="email"
          class="flex-1 border-b border-gray-200 py-2 text-16 outline-none placeholder:text-gray-200"
        />
        <button
          type="button"
          class="w-20 h-8 font-bold text-10 flex items-center justify-center rounded-2xl border border-main bg-white text-main"
        >
          인증번호 전송
        </button>
      </div>
    </div>

    <div>
      <label for="code" class="block font-semibold text-16 text-gray-300">
        인증번호 <span class="text-red">*</span>
      </label>
      <div class="flex gap-2">
        <input
          id="code"
          v-model="code"
          type="text"
          placeholder="인증번호를 입력해주세요."
          class="flex-1 border-b border-gray-200 py-2 text-16 outline-none placeholder:text-gray-200"
        />
        <button
          type="button"
          class="w-20 h-8 font-bold text-10 flex items-center justify-center rounded-2xl border border-main bg-white text-main"
        >
          확인
        </button>
      </div>
    </div>

    <BaseInput
      id="password"
      v-model="password"
      type="password"
      label="비밀번호"
      placeholder="비밀번호를 입력해주세요."
      autocomplete="new-password"
      :required="true"
    />
    <BaseInput
      id="passwordCheck"
      v-model="passwordCheck"
      type="password"
      label="비밀번호 확인"
      placeholder="비밀번호를 다시 입력해주세요."
      autocomplete="new-password"
      :required="true"
    />

    <div>
      <p class="block font-semibold text-16 text-gray-300">
        이용약관 동의 <span class="text-red">*</span>
      </p>
      <div class="flex flex-col gap-2 p-2">
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="agreeAll" /> 모두 동의합니다
        </label>
        <div class="flex flex-col gap-2 bg-gray-100 text-14 p-5">
          <label v-for="(term, i) in terms" :key="i" class="flex items-center gap-2">
            <input type="checkbox" v-model="termChecks[i]" />
            {{ term.label }}
          </label>
        </div>
      </div>
    </div>

    <BaseButton color="main" class="mt-6" @click="emit('next')"> 다음 </BaseButton>
  </div>
</template>

<style scoped></style>
