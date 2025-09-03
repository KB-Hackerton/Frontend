<script setup>
import { ref, computed } from 'vue'
import { useSignupStore } from '@/stores/signup'
import BaseInput from '../common/BaseInput.vue'
import BaseButton from '../common/BaseButton.vue'
import BaseInputWithButton from '../common/BaseInputWithButton.vue'
import BaseSelect from '../common/BaseSelect.vue'

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

// 사업자 등록번호
const businessNumMessage = ref('')
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
  <div class="flex flex-col gap-6 mt-5">
    <div>
      <BaseInput
        id="businessNum"
        v-model="businessNum"
        label="사업자 등록번호"
        placeholder="숫자 10자리 입력"
        :required="true"
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
      :options="['소매업', '음식점업', '보건의료업']"
    />

    <BaseSelect
      id="categoryMid"
      v-model="categoryMid"
      label="업종 - 중분류"
      :required="true"
      :options="['소매업', '음식점업', '보건의료업']"
    />

    <BaseSelect
      id="categorySub"
      v-model="categorySub"
      label="업종 - 소분류"
      :required="true"
      :options="['소매업', '음식점업', '보건의료업']"
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
</template>

<style scoped></style>
