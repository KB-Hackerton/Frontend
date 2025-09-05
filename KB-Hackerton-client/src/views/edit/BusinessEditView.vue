<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useSignupStore } from '@/stores/signup'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInputWithButton from '@/components/common/BaseInputWithButton.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'

import userData from '@/_dummy/user.json'
import businessClassData from '@/_dummy/business_class.json'

const emit = defineEmits(['complete'])
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

const businessNumMessage = ref('')

onMounted(() => {
  if (userData.business) {
    businessNum.value = userData.business.business_code || '' // 사업자등록번호
    ceoName.value = userData.member_name || ''
    companyName.value = userData.business.business_nm || ''
    openDate.value = userData.business.business_open_date || ''
    categoryMain.value = userData.business.business_class.major_code || ''
    categoryMid.value = userData.business.business_class.middle_code || ''
    categorySub.value = userData.business.business_class.minor_code || ''
    address.value = userData.business.business_addr || ''
    addressDetail.value = userData.business.business_addr_detail || ''

    const major = businessClassData.find((m) => m.major_code === categoryMain.value)
    middleOptions.value = major
      ? major.middles.map((mid) => ({ value: mid.middle_code, label: mid.middle_name }))
      : []

    const middle = major?.middles.find((mid) => mid.middle_code === categoryMid.value)
    minorOptions.value = middle
      ? middle.minors.map((min) => ({ value: min.minor_code, label: min.minor_name }))
      : []
  }
})

// 대분류 선택 → 중분류 옵션 변경
watch(categoryMain, (newVal, oldVal) => {
  const major = businessClassData.find((m) => m.major_code === newVal)
  middleOptions.value = major
    ? major.middles.map((mid) => ({
        value: mid.middle_code,
        label: mid.middle_name,
      }))
    : []

  // ✅ 초기 로딩일 때는 유지, 사용자가 직접 바꿀 때만 초기화
  if (oldVal) {
    categoryMid.value = ''
    categorySub.value = ''
    minorOptions.value = []
  }
})

// 중분류 선택 → 소분류 옵션 변경
watch(categoryMid, (newVal, oldVal) => {
  const major = businessClassData.find((m) => m.major_code === categoryMain.value)
  const middle = major?.middles.find((mid) => mid.middle_code === newVal)
  minorOptions.value = middle
    ? middle.minors.map((min) => ({
        value: min.minor_code,
        label: min.minor_name,
      }))
    : []

  if (oldVal) {
    categorySub.value = ''
  }
})

// 사업자 등록번호
function checkBusinessNum() {
  if (!/^\d{10}$/.test(businessNum.value)) {
    businessNumMessage.value = '사업자 등록번호는 숫자 10자리입니다.'
  } else {
    businessNumMessage.value = ''
  }
}

// 주소 찾기 (더미)
function findAddr() {
  // TODO: 다음(카카오) 주소검색 연동
  console.log('주소 검색 실행')
  address.value = '경북 안동시 제비원로 195'
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

function completeSignup() {
  signupStore.setBusinessInfo({
    businessNum: businessNum.value,
    ceoName: ceoName.value,
    companyName: companyName.value,
    openDate: openDate.value,
    categoryMain: categoryMain.value,
    categoryMid: categoryMid.value,
    categorySub: categorySub.value,
    address: address.value,
    addressDetail: addressDetail.value,
  })

  console.log('✅ 최종 회원가입 데이터:', signupStore.getFinalInfo())
  emit('complete')
}
</script>

<template>
  <div class="flex flex-col gap-6 my-5">
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
      :options="businessClassData.map((m) => ({ value: m.major_code, label: m.major_name }))"
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
      수정하기
    </BaseButton>
  </div>
</template>

<style scoped></style>
