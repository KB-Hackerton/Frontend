<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseInputPw from '@/components/common/BaseInputPw.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import PasswordSuccessModal from './PasswordSuccessModal.vue'

const router = useRouter()

const prevPw = ref('')
const newPw = ref('')
const checkPw = ref('')

const prevPwMessage = ref('')
const newPwMessage = ref('')
const checkPwMessage = ref('')

const showSuccessModal = ref(false)

// 비밀번호 정규식 (영문, 숫자, 특수문자 포함 8~20자)
const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/

// 신규 비밀번호 유효성
const isNewPwValid = computed(() => pwRegex.test(newPw.value))

// 전체 폼 유효성
const isFormValid = computed(() => {
  return prevPw.value && isNewPwValid.value && newPw.value === checkPw.value
})

// 기존 비밀번호 확인 (더미 로직)
watch(prevPw, (val) => {
  if (val && val !== '1234') {
    prevPwMessage.value = '비밀번호가 일치하지 않습니다.'
  } else {
    prevPwMessage.value = ''
  }
})

// 신규 비밀번호 확인
watch(newPw, (val) => {
  if (val && !isNewPwValid.value) {
    newPwMessage.value = '비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.'
  } else {
    newPwMessage.value = ''
  }
})

// 비밀번호 일치 확인
watch([newPw, checkPw], () => {
  if (checkPw.value) {
    checkPwMessage.value =
      newPw.value === checkPw.value ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'
  } else {
    checkPwMessage.value = ''
  }
})

// 변경 버튼 클릭
function handleChangePw() {
  if (!isFormValid.value) {
    alert('입력값을 확인해주세요.')
    return
  }

  // TODO: API 연동
  console.log('✅ 비밀번호 변경 완료:', newPw.value)
  showSuccessModal.value = true
}

// 성공 모달 닫기
function closeModal() {
  showSuccessModal.value = false
  router.push('/mypage')
}
</script>

<template>
  <div class="p-3 space-y-8">
    <p class="text-center text-16 text-black py-10">
      비밀번호는<br />8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.
    </p>

    <!-- 기존 비밀번호 -->
    <div>
      <BaseInputPw id="prevPw" v-model="prevPw" placeholder="현재 비밀번호" />
      <p v-if="prevPwMessage" class="mt-1 text-10 font-semibold text-red">
        {{ prevPwMessage }}
      </p>
    </div>

    <!-- 신규 비밀번호 -->
    <div>
      <BaseInputPw id="newPw" v-model="newPw" placeholder="신규 비밀번호" />
      <p v-if="newPwMessage" class="mt-1 text-10 font-semibold text-red">
        {{ newPwMessage }}
      </p>
    </div>

    <!-- 신규 비밀번호 확인 -->
    <div class="pb-10">
      <BaseInputPw id="checkPw" v-model="checkPw" placeholder="신규 비밀번호 확인" />
      <p
        v-if="checkPwMessage"
        class="mt-1 text-10 font-semibold"
        :class="checkPwMessage.includes('일치합니다') ? 'text-blue' : 'text-red'"
      >
        {{ checkPwMessage }}
      </p>
    </div>

    <BaseButton color="main" :disabled="!isFormValid" @click="handleChangePw">
      비밀번호 변경
    </BaseButton>
  </div>
  <PasswordSuccessModal
    :show="showSuccessModal"
    message="비밀번호가 변경되었습니다."
    @confirm="closeModal"
  />
</template>
