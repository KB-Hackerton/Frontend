<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseInputPw from '../common/BaseInputPw.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()

const password = ref('')
const passwordCheck = ref('')
const passwordMessage = ref({ text: '', type: '' })
const passwordCheckMessage = ref({ text: '', type: '' })

const isPasswordValid = computed(() => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/
  return regex.test(password.value)
})

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

function changePassword() {
  if (!isPasswordValid.value) {
    alert('비밀번호 조건을 확인해주세요.')
    return
  }
  if (password.value !== passwordCheck.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }
  console.log('✅ 비밀번호 변경 완료:', password.value)
  alert('비밀번호가 변경되었습니다.')
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
</template>
