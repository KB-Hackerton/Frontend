<script setup>
import { ref, computed } from 'vue'
import { useSignupStore } from '@/stores/signup'
import BaseInput from '../common/BaseInput.vue'
import BaseButton from '../common/BaseButton.vue'
import BaseInputWithButton from '../common/BaseInputWithButton.vue'
import BaseCheckbox from '../common/BaseCheckbox.vue'

const emit = defineEmits(['next'])
const signupStore = useSignupStore()

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

// 이메일 + 인증번호 전송
const emailMessage = ref('')
const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
function sendCode() {
  if (!isEmailValid.value) {
    emailMessage.value = '올바른 이메일 주소를 입력해주세요.'
    return
  }
  emailMessage.value = '인증번호를 전송했습니다.'
  console.log(`📧 인증번호 전송 to: ${email.value}`)
}

// 인증번호 + 확인
const codeMessage = ref('')
function verifyCode() {
  if (code.value === '1234') {
    codeMessage.value = '인증에 성공했습니다.'
  } else {
    codeMessage.value = '인증번호가 올바르지 않습니다.'
  }
}

// 비밀번호
const passwordMessage = ref('')
const isPasswordValid = computed(() => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/
  return regex.test(password.value)
})
function checkPassword() {
  if (password.value && !isPasswordValid.value) {
    passwordMessage.value = '비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.'
  } else {
    passwordMessage.value = ''
  }
}

// 비밀번호 확인
const passwordCheckMessage = ref('')
function checkPasswordMatch() {
  if (passwordCheck.value) {
    if (password.value === passwordCheck.value) {
      passwordCheckMessage.value = '비밀번호가 일치합니다.'
    } else {
      passwordCheckMessage.value = '비밀번호가 일치하지 않습니다.'
    }
  } else {
    passwordCheckMessage.value = ''
  }
}

// 이용약관 동의
const termChecks = ref(terms.map(() => false))
const agreeAll = computed({
  get: () => termChecks.value.every(Boolean),
  set: (val) => {
    termChecks.value = terms.map(() => val)
  },
})

// 유효성 검사
const isFormValid = computed(() => {
  const requiredTermsChecked = terms.every((t, i) => (t.required ? termChecks.value[i] : true))
  return (
    isEmailValid.value &&
    codeMessage.value === '인증에 성공했습니다.' &&
    isPasswordValid.value &&
    password.value === passwordCheck.value &&
    requiredTermsChecked
  )
})

function goNext() {
  signupStore.setPersonalInfo({
    email: email.value,
    password: password.value,
  })
  emit('next')
}
</script>

<template>
  <div class="flex flex-col gap-6 mt-5">
    <div>
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
      <p
        v-if="emailMessage"
        class="font-semibold text-10 mt-1"
        :class="emailMessage.includes('올바른') ? 'text-red' : 'text-blue'"
      >
        {{ emailMessage }}
      </p>
    </div>

    <div>
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
      <p
        v-if="codeMessage"
        class="font-semibold text-10 mt-1"
        :class="codeMessage.includes('성공') ? 'text-blue' : 'text-red'"
      >
        {{ codeMessage }}
      </p>
    </div>

    <div>
      <BaseInput
        id="password"
        v-model="password"
        type="password"
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요."
        autocomplete="new-password"
        :required="true"
        @input="checkPassword"
      />
      <p v-if="passwordMessage" class="font-semibold text-red text-10 mt-1">
        {{ passwordMessage }}
      </p>
    </div>

    <div>
      <BaseInput
        id="passwordCheck"
        v-model="passwordCheck"
        type="password"
        label="비밀번호 확인"
        placeholder="비밀번호를 다시 입력해주세요."
        autocomplete="new-password"
        :required="true"
        @input="checkPasswordMatch"
      />
      <p
        v-if="passwordCheckMessage"
        class="font-semibold text-10 mt-1"
        :class="passwordCheckMessage.includes('일치합니다') ? 'text-blue' : 'text-red'"
      >
        {{ passwordCheckMessage }}
      </p>
    </div>

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

    <BaseButton color="main" class="mt-6" :disabled="!isFormValid" @click="goNext">
      다음
    </BaseButton>
  </div>
</template>

<style scoped></style>
