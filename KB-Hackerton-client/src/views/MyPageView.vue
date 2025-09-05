<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { Icon } from '@iconify/vue'
import userData from '@/_dummy/user.json'
import defaultProfile from '@/assets/images/banner.png'
import QuickMenu from '@/components/mypage/QuickMenu.vue'
import OptionList from '@/components/mypage/OptionList.vue'

const router = useRouter()
const user = ref(userData)

const quickMenuItems = [
  { to: '/', icon: 'solar:star-line-duotone', label: '즐겨찾기' },
  { to: '/notice-list', icon: 'material-symbols:contract-outline-rounded', label: '공지사항' },
  { to: '/', icon: 'fluent-mdl2:chat-bot', label: '챗봇' },
]

const optionListItems = [
  { to: '/setting', icon: 'material-symbols:settings-outline-rounded', label: '설정' },
  { to: '/terms-of-service', icon: 'material-symbols:contract-outline-rounded', label: '이용약관' },
  { to: '/', icon: 'material-symbols:help-outline', label: 'FAQ' },
  { icon: 'material-symbols:logout', label: '로그아웃', onClick: logout, showArrow: false },
  { icon: 'lets-icons:sad', label: '회원탈퇴', onClick: withdraw, danger: true, showArrow: false },
]

// 로그아웃
function logout() {
  console.log('로그아웃 실행')
  router.replace('/login')
}

// 회원탈퇴
function withdraw() {
  if (confirm('정말 회원탈퇴를 진행하시겠습니까?')) {
    console.log('회원탈퇴 실행')
    router.replace('/login')
  }
}
</script>

<template>
  <div class="w-full h-full bg-white">
    <section class="p-5 flex items-center">
      <div class="relative">
        <img
          :src="user.profile_image?.storage_key || defaultProfile"
          alt="프로필 이미지"
          class="w-20 h-20 rounded-full object-cover border"
        />
        <button
          class="absolute bottom-0 right-0 bg-main text-white w-6 h-6 rounded-full flex items-center justify-center shadow"
          aria-label="프로필 수정"
        >
          <Icon icon="solar:pen-bold" class="w-3 h-3 text-white" />
        </button>
      </div>

      <div class="ml-5 flex-1">
        <div class="flex items-center gap-2">
          <h2 class="font-bold text-26">{{ user.member_name }}</h2>
          <span class="font-medium text-16 text-gradient">도움 주민</span>
        </div>

        <div class="flex gap-2 mt-3">
          <router-link to="/" class="px-4 py-1 bg-gray-100 rounded-lg text-10 shadow">
            사업 정보 변경
          </router-link>
          <router-link to="/" class="px-4 py-1 bg-gray-100 rounded-lg text-10 shadow">
            비밀번호 변경
          </router-link>
        </div>
      </div>
    </section>

    <section class="ml-5 p-5 border-b text-16 text-black">
      <div class="flex">
        <span class="w-16">상호명</span>
        <span class="flex-1">{{ user.business.business_nm }}</span>
      </div>
      <div class="flex">
        <span class="w-16">업종</span>
        <span class="flex-1">{{ user.business.business_class.minor_name }} </span>
      </div>
      <div class="flex">
        <span class="w-16">주소</span>
        <span class="flex-1">
          {{ user.business.business_addr }} {{ user.business.business_addr_detail }}
        </span>
      </div>
    </section>

    <QuickMenu :items="quickMenuItems" />
    <OptionList :items="optionListItems" />
  </div>
</template>

<style scoped></style>
