<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSignupStore } from '@/stores/signup'
import { loadKakaoPostcode } from '@/utils/KakaoPostcodeLoader.js'
import BaseInput from '../common/BaseInput.vue'
import BaseButton from '../common/BaseButton.vue'
import BaseInputWithButton from '../common/BaseInputWithButton.vue'
import BaseSelect from '../common/BaseSelect.vue'
import BaseModal from '../common/BaseModal.vue'
import businessClassData from '@/_dummy/business_class.json'

const router = useRouter()
const signupStore = useSignupStore()

// 입력값 관리
const businessNum = ref('')
const ceoName = ref('')
const companyName = ref('')
const openDate = ref('')
const categoryMain = ref('')
const categoryMid = ref('')
const categorySub = ref('')
const address = ref('')
const addressDetail = ref('')

const middleOptions = ref([])
const minorOptions = ref([])

const showSuccessModal = ref(false)
const showFailModal = ref(false)

// 대분류 선택 → 중분류 옵션 변경
watch(categoryMain, (newVal, oldVal) => {
  const major = businessClassData.find((m) => m.major_name === newVal)
  middleOptions.value = major
    ? major.middles.map((mid) => ({
        value: mid.middle_name,
        label: mid.middle_name,
      }))
    : []

  if (oldVal) {
    categoryMid.value = ''
    categorySub.value = ''
    minorOptions.value = []
  }
})

// 중분류 선택 → 소분류 옵션 변경
watch(categoryMid, (newVal, oldVal) => {
  const major = businessClassData.find((m) => m.major_name === categoryMain.value)
  const middle = major?.middles.find((mid) => mid.middle_name === newVal)
  minorOptions.value = middle
    ? middle.minors.map((min) => ({
        value: min.minor_name,
        label: min.minor_name,
      }))
    : []

  if (oldVal) {
    categorySub.value = ''
  }
})

// 사업자 등록번호
const businessNumMessage = ref('')
function checkBusinessNum() {
  if (!/^\d{10}$/.test(businessNum.value)) {
    businessNumMessage.value = '사업자 등록번호는 숫자 10자리입니다.'
  } else {
    businessNumMessage.value = ''
  }
}

// 주소 찾기
async function findAddr() {
  try {
    await loadKakaoPostcode()

    new window.daum.Postcode({
      oncomplete: (data) => {
        address.value = data.roadAddress || data.jibunAddress
        addressDetail.value = ''
      },
    }).open()
  } catch (err) {
    console.error('❌ 주소 검색 로드 실패:', err)
  }
}

// 유효성 검사
const isFormValid = computed(() => {
  return (
    businessNum.value &&
    !businessNumMessage.value &&
    ceoName.value &&
    companyName.value &&
    openDate.value &&
    categoryMain.value &&
    categoryMid.value &&
    categorySub.value &&
    address.value
  )
})

async function completeSignup() {
  signupStore.setBusinessInfo({
    businessNum: businessNum.value,
    ceoName: ceoName.value,
    companyName: companyName.value,
    openDate: openDate.value,
    categorySub: categorySub.value,
    address: address.value,
    addressDetail: addressDetail.value,
  })

  const ok = await signupStore.signupUser()

  if (ok) {
    showSuccessModal.value = true
    signupStore.resetSignup()
  } else {
    showFailModal.value = true
    console.error('❌ 회원가입 실패:', signupStore.error)
  }
}

function goToLogin() {
  console.log('✅ 회원가입 완료!')
  router.replace('/login')
}
</script>

<template>
  <div class="flex flex-col gap-6 mt-5">
    <div>
      <BaseInput
        id="businessNum"
        v-model="businessNum"
        label="사업자 등록번호"
        placeholder="숫자 10자리 입력"
        :required="true"
        description=" - 없이 숫자만 기입하시기 바랍니다."
        @input="checkBusinessNum"
      />
      <p v-if="businessNumMessage" class="font-semibold text-gray-300 text-10 mt-1">
        {{ businessNumMessage }}
      </p>
    </div>

    <BaseInput
      id="ceoName"
      v-model="ceoName"
      label="대표자 성명"
      placeholder="대표자 성명을 입력해주세요."
      :required="true"
      description="사업자 등록증의 성명과 동일해야 합니다."
    />

    <BaseInput
      id="companyName"
      v-model="companyName"
      label="상호명"
      placeholder="상호명을 입력해주세요."
      :required="true"
      description="사업자 등록증의 상호명과 동일해야 합니다."
    />

    <BaseInput
      id="openDate"
      v-model="openDate"
      type="date"
      label="개업일자"
      placeholder="YYYY-MM-DD"
      :required="true"
      description="사업자 등록증의 개업연월일과 동일해야 합니다."
    />

    <BaseSelect
      id="categoryMain"
      v-model="categoryMain"
      label="업종 - 대분류"
      :required="true"
      :options="businessClassData.map((m) => ({ value: m.major_name, label: m.major_name }))"
    />

    <BaseSelect
      id="categoryMid"
      v-model="categoryMid"
      label="업종 - 중분류"
      :required="true"
      :options="middleOptions"
    />

    <BaseSelect
      id="categorySub"
      v-model="categorySub"
      label="업종 - 소분류"
      :required="true"
      :options="minorOptions"
    />

    <BaseInputWithButton
      id="address"
      v-model="address"
      type="text"
      label="사업장 주소"
      placeholder="주소 찾기로 주소를 입력해주세요."
      button-text="주소 찾기"
      :required="true"
      :readonly="true"
      @click="findAddr"
    />

    <BaseInput
      id="addressDetail"
      v-model="addressDetail"
      label="사업장 상세 주소"
      placeholder="상세 주소를 입력해주세요."
    />

    <BaseButton color="main" class="mt-6" :disabled="!isFormValid" @click="completeSignup">
      가입하기
    </BaseButton>
  </div>
  <BaseModal
    :show="showSuccessModal"
    title="회원가입 완료"
    message="정상적으로 회원가입이 완료되었습니다. &#10; 로그인 화면으로 이동합니다."
    confirmText="확인"
    @confirm="goToLogin"
    @close="goToLogin"
  />

  <!-- 실패 모달 -->
  <BaseModal
    :show="showFailModal"
    title="회원가입 실패"
    :message="signupStore.error || '회원가입에 실패했습니다.'"
    confirmText="닫기"
    @confirm="showFailModal = false"
    @close="showFailModal = false"
  />
</template>

<style scoped></style>
