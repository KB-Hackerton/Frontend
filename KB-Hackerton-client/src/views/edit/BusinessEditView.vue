<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMypageStore } from '@/stores/mypage'
import { useAuthStore } from '@/stores/auth'
import { loadKakaoPostcode } from '@/utils/KakaoPostcodeLoader.js'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInputWithButton from '@/components/common/BaseInputWithButton.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseModal from '@/components/common/BaseModal.vue'

import businessClassData from '@/_dummy/business_class.json'

const router = useRouter()
const authStore = useAuthStore()
const mypageStore = useMypageStore()

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
const showSuccessModal = ref(false)
const showFailModal = ref(false)
const failMessage = ref('')

onMounted(() => {
  if (authStore.user?.business_dto) {
    businessNum.value = authStore.user.business_dto.businessCode || ''
    ceoName.value = authStore.user.member_name || ''
    companyName.value = authStore.user.business_dto.businessNm || ''
    openDate.value = authStore.user.business_dto.businessOpenDate?.split('T')[0] || ''
    address.value = authStore.user.business_dto.businessAddr || ''
    addressDetail.value = authStore.user.business_dto.businessAddrDetail || ''

    // ✅ 소분류명 기준으로 대/중/소 역추적
    const minorName = authStore.user.minor_nm
    let foundMajor, foundMiddle, foundMinor

    for (const major of businessClassData) {
      for (const middle of major.middles) {
        const minor = middle.minors.find((m) => m.minor_name === minorName)
        if (minor) {
          foundMajor = major
          foundMiddle = middle
          foundMinor = minor
          break
        }
      }
      if (foundMinor) break
    }

    if (foundMajor && foundMiddle && foundMinor) {
      categoryMain.value = foundMajor.major_name
      categoryMid.value = foundMiddle.middle_name
      categorySub.value = foundMinor.minor_name

      middleOptions.value = foundMajor.middles.map((mid) => ({
        value: mid.middle_name,
        label: mid.middle_name,
      }))

      minorOptions.value = foundMiddle.minors.map((min) => ({
        value: min.minor_name,
        label: min.minor_name,
      }))
    }
  }
})

// 대분류 선택 → 중분류 옵션 변경
watch(categoryMain, (newVal, oldVal) => {
  // ✅ 최초 onMounted 세팅일 때는 초기화하지 않음
  if (!oldVal) return

  const major = businessClassData.find((m) => m.major_name === newVal)

  middleOptions.value = major
    ? major.middles.map((mid) => ({
        value: mid.middle_name,
        label: mid.middle_name,
      }))
    : []

  // 대분류 바뀌면 무조건 초기화
  categoryMid.value = ''
  categorySub.value = ''
  minorOptions.value = []
})

// 중분류 선택 → 소분류 옵션 변경
watch(categoryMid, (newVal, oldVal) => {
  const major = businessClassData.find((m) => m.major_name === categoryMain.value)
  const middle = major?.middles.find((mid) => mid.middle_name === newVal)

  minorOptions.value = middle
    ? middle.minors.map((min) => ({ value: min.minor_name, label: min.minor_name }))
    : []

  if (oldVal) {
    categorySub.value = ''
  }
})

// 사업자등록번호 체크
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

// 수정 API 호출
async function handleEdit() {
  const payload = {
    business_code: businessNum.value,
    member_name: ceoName.value,
    business_nm: companyName.value,
    business_open_date: openDate.value,
    minor_name: categorySub.value,
    business_addr: address.value,
    business_addr_detail: addressDetail.value,
  }

  const ok = await mypageStore.editBusinessInfo(payload)
  if (ok) {
    showSuccessModal.value = true
  } else {
    failMessage.value = mypageStore.error
    showFailModal.value = true
  }
}

function goToMy() {
  showSuccessModal.value = false
  router.push('/mypage')
}
</script>

<template>
  <div class="flex flex-col gap-6 my-5">
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

    <BaseInput id="ceoName" v-model="ceoName" label="대표자 성명" :required="true" />
    <BaseInput id="companyName" v-model="companyName" label="상호명" :required="true" />
    <BaseInput id="openDate" v-model="openDate" type="date" label="개업일자" :required="true" />

    <BaseSelect
      id="categoryMain"
      v-model="categoryMain"
      label="업종 - 대분류"
      :options="businessClassData.map((m) => ({ value: m.major_name, label: m.major_name }))"
      :required="true"
    />
    <BaseSelect
      id="categoryMid"
      v-model="categoryMid"
      label="업종 - 중분류"
      :options="middleOptions"
      :required="true"
    />
    <BaseSelect
      id="categorySub"
      v-model="categorySub"
      label="업종 - 소분류"
      :options="minorOptions"
      :required="true"
    />

    <BaseInputWithButton
      id="address"
      v-model="address"
      type="text"
      label="사업장 주소"
      button-text="주소 찾기"
      :required="true"
      :readonly="true"
      @click="findAddr"
    />

    <BaseInput id="addressDetail" v-model="addressDetail" label="상세 주소" />

    <BaseButton color="main" class="mt-6" :disabled="!isFormValid" @click="handleEdit">
      수정하기
    </BaseButton>

    <!-- 성공 모달 -->
    <BaseModal
      :show="showSuccessModal"
      title="수정 완료"
      message="사업 정보가 정상적으로 수정되었습니다."
      confirmText="확인"
      @confirm="goToMy"
      @close="goToMy"
    />

    <!-- 실패 모달 -->
    <BaseModal
      :show="showFailModal"
      title="수정 실패"
      :message="failMessage"
      confirmText="닫기"
      @confirm="showFailModal = false"
      @close="showFailModal = false"
    />
  </div>
</template>
