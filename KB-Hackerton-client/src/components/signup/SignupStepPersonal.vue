<script setup>
import { ref, computed, watch } from 'vue'
import { useSignupStore } from '@/stores/signup'
import { sendEmailCode, verifyEmailCode } from '@/api/auth.js'
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

const emailMessage = ref('')
const emailMessageColor = ref('text-blue')
const codeMessage = ref('')
const passwordMessage = ref('')
const passwordCheckMessage = ref('')

const sendDisabled = ref(false) // 버튼 비활성화 여부
const countdown = ref(0) // 남은 시간(초)
let timer = null // setInterval 핸들러
const isVerified = ref(false) // 인증 성공 여부

const termChecks = ref(terms.map(() => false))
const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))

// 이메일 변경 시 인증 상태 초기화
watch(email, () => {
  code.value = ''
  codeMessage.value = ''
  isVerified.value = false
  clearInterval(timer) // 이메일이 바뀌면 타이머 리셋 & 버튼 다시 활성화
  sendDisabled.value = false
  countdown.value = 0
})

// 인증번호 전송
async function sendCode() {
  if (!isEmailValid.value) {
    emailMessage.value = '올바른 이메일 주소를 입력해주세요.'
    emailMessageColor.value = 'text-red'
    return
  }
  try {
    await sendEmailCode(email.value)
    console.log(`📧 인증번호 전송 to: ${email.value}`)
    emailMessage.value = '인증번호를 전송했습니다.'
    emailMessageColor.value = 'text-blue'

    // 5분 타이머 시작
    sendDisabled.value = true
    countdown.value = 300
    clearInterval(timer)
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        sendDisabled.value = false
      }
    }, 1000)
  } catch (err) {
    console.error('❌ 이메일 전송 실패', err)

    if (err.response?.data?.code === 400) {
      emailMessage.value = err.response.data.message
      emailMessageColor.value = 'text-red'
    } else {
      emailMessage.value = '이메일 전송에 실패했습니다.'
      emailMessageColor.value = 'text-red'
    }
  }
}

// 인증번호 확인
async function verifyCode() {
  try {
    if (isVerified.value) {
      codeMessage.value = '이미 인증된 이메일입니다.'
      return
    }

    const res = await verifyEmailCode({ email: email.value, code: code.value })
    if (res.code === 200) {
      console.log(`📧 인증에 성공했습니다.`)
      codeMessage.value = '인증에 성공했습니다.'
      isVerified.value = true
    } else {
      codeMessage.value = '인증번호가 올바르지 않습니다.'
      isVerified.value = false
    }
  } catch (err) {
    console.error('❌ 인증 실패', err)
    codeMessage.value = '인증번호 확인 중 오류가 발생했습니다.'
    isVerified.value = false
  }
}

// 비밀번호
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
    isVerified.value &&
    isPasswordValid.value &&
    password.value === passwordCheck.value &&
    requiredTermsChecked
  )
})

function goNext() {
  signupStore.setPersonalInfo({ email: email.value, password: password.value })
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
        :disabled="sendDisabled"
        @click="sendCode"
      />
      <p v-if="emailMessage" class="font-semibold text-10 mt-1" :class="emailMessageColor">
        {{ emailMessage }}
        <span v-if="sendDisabled && countdown > 0" class="text-blue">
          ({{ Math.floor(countdown / 60) }}:{{ (countdown % 60).toString().padStart(2, '0') }})
        </span>
      </p>
    </div>

    <div>
      <BaseInputWithButton
        id="code"
        v-model="code"
        type="text"
        label="인증번호"
        placeholder="인증번호를 입력해주세요."
        :button-text="isVerified ? '인증 완료' : '확인'"
        :required="true"
        :disabled="isVerified"
        @click="verifyCode"
      />
      <p
        v-if="codeMessage"
        class="font-semibold text-10 mt-1"
        :class="isVerified ? 'text-blue' : 'text-red'"
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
