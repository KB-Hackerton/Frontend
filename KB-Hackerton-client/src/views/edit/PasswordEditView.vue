<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMypageStore } from '@/stores/mypage'
import BaseInputPw from '@/components/common/BaseInputPw.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'

const router = useRouter()
const mypageStore = useMypageStore()

const originalPw = ref('')
const newPw = ref('')
const checkPw = ref('')

const newPwMessage = ref({ text: '', type: '' })
const checkPwMessage = ref({ text: '', type: '' })

const showSuccessModal = ref(false)
const showFailModal = ref(false)
const failMessage = ref('')

// 비밀번호 정규식 (영문, 숫자, 특수문자 포함 8~20자)
const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/

// 신규 비밀번호 유효성
const isNewPwValid = computed(() => pwRegex.test(newPw.value))

// 전체 폼 유효성
const isFormValid = computed(() => {
  return originalPw.value && isNewPwValid.value && newPw.value === checkPw.value
})

// 신규 비밀번호 검증
function checkPassword() {
  if (newPw.value && !isNewPwValid.value) {
    newPwMessage.value = {
      text: '비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.',
      type: 'error',
    }
  } else {
    newPwMessage.value = { text: '', type: '' }
  }
}

// 비밀번호 확인 검증
function checkPasswordMatch() {
  if (!checkPw.value) {
    checkPwMessage.value = { text: '', type: '' }
    return
  }
  if (newPw.value === checkPw.value) {
    checkPwMessage.value = { text: '비밀번호가 일치합니다.', type: 'success' }
  } else {
    checkPwMessage.value = { text: '비밀번호가 일치하지 않습니다.', type: 'error' }
  }
}

// 비밀번호 변경
async function changePassword() {
  if (!isFormValid.value) {
    failMessage.value = '입력값을 확인해주세요.'
    showFailModal.value = true
    return
  }

  try {
    const res = await mypageStore.changePassword({
      originalPassword: originalPw.value,
      newPassword: newPw.value,
    })

    if (res?.code === 200) {
      showSuccessModal.value = true
      console.log('🟢 비밀번호 변경 성공')
    } else {
      failMessage.value = res?.message || '비밀번호 변경에 실패했습니다.'
      showFailModal.value = true
      console.error('❌ 비밀번호 변경 실패')
    }
  } catch (err) {
    console.error('❌ 서버 오류', err)
    failMessage.value = '서버 오류로 비밀번호 변경에 실패했습니다.'
    showFailModal.value = true
  }
}

// 성공 시 마이페이지로 이동
function goToMy() {
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
      <BaseInputPw id="originalPw" v-model="originalPw" placeholder="현재 비밀번호" />
    </div>

    <!-- 신규 비밀번호 -->
    <div>
      <BaseInputPw id="newPw" v-model="newPw" placeholder="신규 비밀번호" @input="checkPassword" />
      <p
        v-if="newPwMessage.text"
        class="mt-1 text-10 font-semibold"
        :class="newPwMessage.type === 'error' ? 'text-red' : 'text-blue'"
      >
        {{ newPwMessage.text }}
      </p>
    </div>

    <!-- 신규 비밀번호 확인 -->
    <div class="pb-10">
      <BaseInputPw
        id="checkPw"
        v-model="checkPw"
        placeholder="신규 비밀번호 확인"
        @input="checkPasswordMatch"
      />
      <p
        v-if="checkPwMessage.text"
        class="mt-1 text-10 font-semibold"
        :class="checkPwMessage.type === 'success' ? 'text-blue' : 'text-red'"
      >
        {{ checkPwMessage.text }}
      </p>
    </div>

    <BaseButton
      color="main"
      :disabled="!isFormValid || mypageStore.loading"
      @click="changePassword"
    >
      {{ mypageStore.loading ? '처리 중...' : '비밀번호 변경' }}
    </BaseButton>
  </div>

  <BaseModal
    :show="showSuccessModal"
    title="비밀번호 변경 완료"
    message="비밀번호가 정상적으로 변경되었습니다."
    confirmText="확인"
    @confirm="goToMy"
    @close="goToMy"
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
