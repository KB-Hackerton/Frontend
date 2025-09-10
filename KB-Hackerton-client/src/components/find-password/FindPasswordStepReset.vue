<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { resetPassword } from '@/api/auth.js'
import BaseInputPw from '../common/BaseInputPw.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '../common/BaseModal.vue'

const router = useRouter()

const props = defineProps({
  email: { type: String, required: true }, // 이전 단계에서 전달받은 이메일
})

const password = ref('')
const passwordCheck = ref('')
const passwordMessage = ref({ text: '', type: '' })
const passwordCheckMessage = ref({ text: '', type: '' })

const loading = ref(false)

const showSuccessModal = ref(false)
const showFailModal = ref(false)
const failMessage = ref('')

const isPasswordValid = computed(() => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/
  return regex.test(password.value)
})

// 비밀번호 작성
function checkPassword() {
  if (password.value && !isPasswordValid.value) {
    passwordMessage.value = {
      text: '비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.',
      type: 'error',
    }
  } else {
    passwordMessage.value = { text: '', type: '' }
  }
}

// 비밀번호 한번 더 작성
function checkPasswordMatch() {
  if (!passwordCheck.value) {
    passwordCheckMessage.value = { text: '', type: '' }
    return
  }
  if (password.value === passwordCheck.value) {
    passwordCheckMessage.value = { text: '비밀번호가 일치합니다.', type: 'success' }
  } else {
    passwordCheckMessage.value = { text: '비밀번호가 일치하지 않습니다.', type: 'error' }
  }
}

// 비밀번호 변경 버튼
async function changePassword() {
  if (!isPasswordValid.value) {
    failMessage.value = '비밀번호 조건을 확인해주세요.'
    showFailModal.value = true
    return
  }
  if (password.value !== passwordCheck.value) {
    failMessage.value = '비밀번호가 일치하지 않습니다.'
    showFailModal.value = true
    return
  }

  try {
    loading.value = true
    const res = await resetPassword({
      email: props.email.value,
      password: password.value,
    })

    if (res.code === 200) {
      showSuccessModal.value = true
      console.log('🟢 비밀번호 변경 성공')
    } else {
      failMessage.value = res.message || '비밀번호 변경에 실패했습니다.'
      showFailModal.value = true
      console.error('❌ 비밀번호 변경 실패')
    }
  } catch (err) {
    console.error('❌ 비밀번호 변경 실패', err)
    failMessage.value = '서버 오류로 비밀번호 변경에 실패했습니다.'
    showFailModal.value = true
  } finally {
    loading.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="p-3 space-y-8">
    <p class="text-center text-16 text-black py-10">
      비밀번호는<br />8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.
    </p>

    <div>
      <BaseInputPw
        id="password"
        v-model="password"
        placeholder="비밀번호 입력"
        @input="checkPassword"
      />
      <p
        v-if="passwordMessage.text"
        class="mt-1 text-10 font-semibold"
        :class="passwordMessage.type === 'error' ? 'text-red' : 'text-blue'"
      >
        {{ passwordMessage.text }}
      </p>
    </div>

    <div class="pb-10">
      <BaseInputPw
        id="passwordCheck"
        v-model="passwordCheck"
        placeholder="비밀번호 확인"
        @input="checkPasswordMatch"
      />
      <p
        v-if="passwordCheckMessage.text"
        class="mt-1 text-10 font-semibold"
        :class="passwordCheckMessage.type === 'success' ? 'text-blue' : 'text-red'"
      >
        {{ passwordCheckMessage.text }}
      </p>
    </div>

    <BaseButton color="main" @click="changePassword"> 비밀번호 변경 </BaseButton>
  </div>

  <BaseModal
    :show="showSuccessModal"
    title="비밀번호 변경 완료"
    message="비밀번호가 정상적으로 변경되었습니다.&#10;로그인 화면으로 이동합니다."
    confirmText="확인"
    @confirm="goToLogin"
    @close="goToLogin"
  />

  <BaseModal
    :show="showFailModal"
    title="비밀번호 변경 실패"
    :message="failMessage"
    confirmText="닫기"
    @confirm="showFailModal = false"
    @close="showFailModal = false"
  />
</template>
