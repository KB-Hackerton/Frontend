<script setup>
import { ref, computed } from 'vue'
import BaseInputWithButton from '@/components/common/BaseInputWithButton.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const emit = defineEmits(['success'])

const email = ref('')
const code = ref('')
const isVerified = ref(false)
const emailMessage = ref({ text: '', type: '' })
const codeMessage = ref({ text: '', type: '' })

const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))

function sendCode() {
  if (!isEmailValid.value) {
    emailMessage.value = { text: '올바른 이메일 주소를 입력해주세요.', type: 'error' }
    return
  }
  emailMessage.value = { text: '인증번호를 전송했습니다.', type: 'success' }
  console.log(`📧 인증번호 전송 to: ${email.value}`)
}

function verifyCode() {
  if (code.value === '1234') {
    codeMessage.value = { text: '인증에 성공했습니다.', type: 'success' }
    isVerified.value = true
  } else {
    codeMessage.value = { text: '인증번호가 올바르지 않습니다.', type: 'error' }
    isVerified.value = false
  }
}

function goNext() {
  if (!isVerified.value) {
    alert('이메일 인증을 완료해주세요.')
    return
  }
  console.log('비밀번호 재설정 페이지로 이동')
  emit('success')
}
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
        @click="sendCode"
      />
      <p
        v-if="emailMessage.text"
        class="mt-1 text-10 font-semibold"
        :class="emailMessage.type === 'error' ? 'text-red' : 'text-blue'"
      >
        {{ emailMessage.text }}
      </p>
    </div>

    <div class="pb-10">
      <BaseInputWithButton
        id="code"
        v-model="code"
        type="text"
        label="인증번호"
        placeholder="인증번호를 입력해주세요."
        button-text="확인"
        @click="verifyCode"
      />
      <p
        v-if="codeMessage.text"
        class="mt-1 text-10 font-semibold"
        :class="codeMessage.type === 'success' ? 'text-blue' : 'text-red'"
      >
        {{ codeMessage.text }}
      </p>
    </div>

    <BaseButton color="main" :disabled="!isVerified" @click="goNext"> 다음 </BaseButton>
  </div>
</template>

<style scoped></style>
