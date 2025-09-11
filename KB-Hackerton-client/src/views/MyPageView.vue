<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMypageStore } from '@/stores/mypage'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import QuickMenu from '@/components/mypage/QuickMenu.vue'
import OptionList from '@/components/mypage/OptionList.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import defaultProfile from '@/assets/images/banner.png'

const authStore = useAuthStore()
const mypageStore = useMypageStore()
const router = useRouter()

const fileInput = ref(null)
const cacheBuster = ref(Date.now())
const showConfirmModal = ref(false) // 로그아웃 모달
const showFailModal = ref(false) // 업로드 실패 모달
const failMessage = ref('')

const quickMenuItems = [
  { to: '/favorites', icon: 'solar:star-line-duotone', label: '즐겨찾기' },
  { to: '/notice-list', icon: 'material-symbols:contract-outline-rounded', label: '공지사항' },
  { to: '/chatbot', icon: 'fluent-mdl2:chat-bot', label: '챗봇' },
]

const optionListItems = [
  { to: '/setting', icon: 'material-symbols:settings-outline-rounded', label: '설정' },
  { to: '/terms-of-service', icon: 'material-symbols:contract-outline-rounded', label: '이용약관' },
  { to: '/', icon: 'material-symbols:help-outline', label: 'FAQ' },
  { icon: 'material-symbols:logout', label: '로그아웃', onClick: askLogout, showArrow: false },
  {
    to: '/membership/terminate',
    icon: 'lets-icons:sad',
    label: '회원탈퇴',
    danger: true,
    showArrow: false,
  },
]

// 파일 선택 창 열기 (아이콘 클릭 시)
function triggerFileInput() {
  fileInput.value.click()
}

// 파일 업로드 처리
async function handleFileChange(e) {
  const file = e.target.files[0]
  if (!file) return

  const res = await mypageStore.editProfileImage(file)
  if (res && res.code === 200) {
    authStore.user = { ...authStore.user, profile_image_id: res.url }
    localStorage.setItem('user', JSON.stringify(authStore.user))
    cacheBuster.value = Date.now()
    console.log('🟢 프로필 이미지 변경 성공:', res.data)
  } else {
    console.error('❌ 프로필 이미지 변경 실패', mypageStore.error)
    failMessage.value = mypageStore.error || '이미지 업로드에 실패했습니다.'
    showFailModal.value = true
  }
}

// 로그아웃 버튼
function askLogout() {
  showConfirmModal.value = true
}

// 확인 모달에서 "확인"
async function confirmAction() {
  showConfirmModal.value = false
  authStore.logoutUser()
  router.replace('/login')
}

onMounted(() => {
  console.log('🔎 authStore.user:', authStore.user)
})
</script>

<template>
  <div class="w-full h-full bg-white">
    <section class="p-5 flex items-center">
      <div class="relative">
        <img
          :src="
            authStore.user?.profile_image_id
              ? authStore.user.profile_image_id + '?t=' + Date.now()
              : defaultProfile
          "
          alt="프로필 이미지"
          class="w-20 h-20 rounded-full object-cover border"
        />
        <button
          class="absolute bottom-0 right-0 bg-main text-white w-6 h-6 rounded-full flex items-center justify-center shadow"
          aria-label="프로필 이미지 수정"
          @click="triggerFileInput"
        >
          <Icon icon="solar:pen-bold" class="w-3 h-3 text-white" />
        </button>
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          class="hidden"
          @change="handleFileChange"
        />
      </div>

      <div class="ml-5 flex-1">
        <div class="flex items-center gap-2">
          <h2 class="font-bold text-26">{{ authStore.user?.member_name }}</h2>
          <span class="font-medium text-14 text-gradient">{{ authStore.user?.badge }}</span>
        </div>

        <div class="flex gap-2 mt-3">
          <router-link
            to="/mypage/business-edit"
            class="px-4 py-1 bg-gray-100 rounded-lg text-10 shadow"
          >
            사업 정보 변경
          </router-link>
          <router-link
            to="/mypage/password-edit"
            class="px-4 py-1 bg-gray-100 rounded-lg text-10 shadow"
          >
            비밀번호 변경
          </router-link>
        </div>
      </div>
    </section>

    <section class="ml-5 p-5 border-b text-16 text-black">
      <div class="flex">
        <span class="w-16">상호명</span>
        <span class="flex-1">{{ authStore.user?.business_dto.businessNm }}</span>
      </div>
      <div class="flex">
        <span class="w-16">업종</span>
        <span class="flex-1">{{ authStore.user?.minor_nm }} </span>
      </div>
      <div class="flex">
        <span class="w-16">주소</span>
        <span class="flex-1">
          {{ authStore.user?.business_dto.businessAddr }}
          {{ authStore.user?.business_dto.businessAddrDetail }}
        </span>
      </div>
    </section>

    <QuickMenu :items="quickMenuItems" />
    <OptionList :items="optionListItems" />
  </div>

  <BaseModal
    :show="showConfirmModal"
    title="로그아웃 확인"
    message="정말 로그아웃 하시겠습니까?"
    confirmText="로그아웃"
    @confirm="confirmAction"
    @close="showConfirmModal = false"
  />

  <BaseModal
    :show="showFailModal"
    title="이미지 업로드 실패"
    :message="failMessage"
    confirmText="닫기"
    @confirm="showFailModal = false"
    @close="showFailModal = false"
  />
</template>

<style scoped></style>
