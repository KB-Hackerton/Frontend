<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { rpSendEmailCode, verifyEmailCode } from '@/api/auth.js'
import BaseInputWithButton from '@/components/common/BaseInputWithButton.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const emit = defineEmits(['success'])

const email = ref('')
const code = ref('')

const emailMessage = ref('')
const emailMessageColor = ref('text-blue')
const codeMessage = ref('')

const sendDisabled = ref(false) // 버튼 비활성화 여부
const countdown = ref(0) // 남은 시간(초)
let timer = null // setInterval 핸들러
const isVerified = ref(false) // 인증 성공 여부

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
    await rpSendEmailCode(email.value)
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

    if (err.response?.data?.code === 404) {
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

function goNext() {
  if (!isVerified.value) {
    alert('이메일 인증을 완료해주세요.')
    return
  }
  console.log('비밀번호 재설정 페이지로 이동')
  emit('success', email.value)
}

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="p-3 space-y-8">
    <p class="text-center text-16 text-black py-10">
      이메일 인증 후<br />비밀번호를 다시 설정할 수 있습니다.
    </p>

    <div>
      <BaseInputWithButton
        id="email"
        v-model="email"
        type="email"
        label="이메일"
        placeholder="이메일을 입력해주세요."
        button-text="인증번호 전송"
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

    <BaseButton color="main" :disabled="!isVerified" @click="goNext"> 다음 </BaseButton>
  </div>
</template>

<style scoped></style>
