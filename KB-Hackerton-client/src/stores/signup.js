import { ref } from 'vue'
import { defineStore } from 'pinia'
import { postSignup } from '@/api/auth.js'

export const useSignupStore = defineStore('Signup', () => {
  const loading = ref(false)
  const error = ref('')

  const personalInfo = ref({
    email: '',
    password: '',
  })

  const businessInfo = ref({
    businessNum: '',
    ceoName: '',
    companyName: '',
    openDate: '',
    categorySub: '',
    address: '',
    addressDetail: '',
  })

  const setPersonalInfo = (data) => {
    personalInfo.value = { ...personalInfo.value, ...data }
  }

  const setBusinessInfo = (data) => {
    businessInfo.value = { ...businessInfo.value, ...data }
  }

  const signupUser = async () => {
    loading.value = true
    error.value = ''

    try {
      const res = await postSignup({
        kakao_id: '',
        member_email: personalInfo.value.email,
        password: personalInfo.value.password,
        business_code: businessInfo.value.businessNum,
        member_name: businessInfo.value.ceoName,
        business_nm: businessInfo.value.companyName,
        business_open_date: businessInfo.value.openDate,
        minor_name: businessInfo.value.categorySub,
        business_addr: businessInfo.value.address,
        business_addr_detail: businessInfo.value.addressDetail,
      })

      if (res.code !== 201) {
        error.value = res.message || '회원가입에 실패했습니다.'
        return false
      }

      resetSignup()
      return true
    } catch (err) {
      console.error('❌ 회원가입 에러', err)

      const status = err.response?.status
      if (status && String(status).startsWith('4')) {
        error.value = '입력한 회원가입 정보가 올바르지 않습니다.'
      } else if (status && String(status).startsWith('5')) {
        error.value = '서버 오류로 회원가입할 수 없습니다.'
      } else {
        error.value = '네트워크 오류로 회원가입할 수 없습니다.'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  const resetSignup = () => {
    personalInfo.value = { email: '', password: '' }
    businessInfo.value = {
      businessNum: '',
      ceoName: '',
      companyName: '',
      openDate: '',
      categorySub: '',
      address: '',
      addressDetail: '',
    }
  }

  return {
    loading,
    error,
    personalInfo,
    businessInfo,
    setPersonalInfo,
    setBusinessInfo,
    signupUser,
    resetSignup,
  }
})
