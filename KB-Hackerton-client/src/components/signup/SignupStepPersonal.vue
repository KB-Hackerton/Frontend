<script setup>
import { ref, computed } from 'vue'
import BaseInput from '../common/BaseInput.vue'
import BaseButton from '../common/BaseButton.vue'
import BaseInputWithButton from '../common/BaseInputWithButton.vue'
import BaseCheckbox from '../common/BaseCheckbox.vue'

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
    <BaseInputWithButton
      id="email"
      v-model="email"
      type="email"
      label="이메일"
      placeholder="이메일을 입력해주세요."
      button-text="인증번호 전송"
      :required="true"
      @click="sendCode"
    />

    <BaseInputWithButton
      id="code"
      v-model="code"
      type="text"
      label="인증번호"
      placeholder="인증번호를 입력해주세요."
      button-text="확인"
      :required="true"
      @click="verifyCode"
    />

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
        <BaseCheckbox v-model="agreeAll" label="모두 동의합니다" />
        <div class="flex flex-col gap-2 bg-gray-100 text-14 p-5 rounded-lg">
          <BaseCheckbox
            v-for="(term, i) in terms"
            :key="i"
            v-model="termChecks[i]"
            :label="term.label"
            :required="term.required"
          />
        </div>
      </div>
    </div>

    <!-- :disabled="!isFormValid"  -->
    <BaseButton color="main" class="mt-6" @click="emit('next')"> 다음 </BaseButton>
  </div>
</template>

<style scoped></style>
