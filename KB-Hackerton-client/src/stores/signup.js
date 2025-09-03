import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSignupStore = defineStore('signup', () => {
  const personalInfo = ref({
    email: '',
    password: '',
  })

  const businessInfo = ref({
    businessNum: '',
    ceoName: '',
    companyName: '',
    openDate: '',
    categoryMain: '',
    categoryMid: '',
    categorySub: '',
    address: '',
    addressDetail: '',
  })

  function setPersonalInfo(data) {
    personalInfo.value = { ...personalInfo.value, ...data }
    console.log('🔹 1단계 저장:', personalInfo.value)
  }

  function setBusinessInfo(data) {
    businessInfo.value = { ...businessInfo.value, ...data }
    console.log('🔹 2단계 저장:', businessInfo.value)
  }

  // 최종 합친 데이터
  function getFinalInfo() {
    return {
      ...personalInfo.value,
      ...businessInfo.value,
    }
  }

  // 초기화
  function resetSignup() {
    personalInfo.value = {
      email: '',
      password: '',
    }
    businessInfo.value = {
      businessNum: '',
      ceoName: '',
      companyName: '',
      openDate: '',
      categoryMain: '',
      categoryMid: '',
      categorySub: '',
      address: '',
      addressDetail: '',
    }
    console.log('🧹 회원가입 데이터 초기화 완료')
  }

  return { personalInfo, businessInfo, setPersonalInfo, setBusinessInfo, getFinalInfo, resetSignup }
})
