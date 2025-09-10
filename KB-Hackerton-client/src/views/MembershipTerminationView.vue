<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'

const router = useRouter()
const authStore = useAuthStore()

const isChecked = ref(false)
const showConfirmModal = ref(false)

// 회원 탈퇴 처리
const handleMembershipTermination = async () => {
  const ok = await authStore.withdrawUser()
  if (ok) {
    console.log('🟢 회원 탈퇴 성공')
    router.replace('/login')
  } else {
    console.error('❌ 회원 탈퇴 실패')
  }
}
</script>

<template>
  <div class="w-full h-full flex flex-col items-center">
    <div
      class="w-full h-full flex flex-col items-center overflow-scroll [&::-webkit-scrollbar]:hidden"
    >
      <h1 class="text-28 bold">탈퇴할거유?</h1>
      <p class="text-16 mideum text-center mt-5">
        탈퇴하기전에 <br />
        아래 정보들을 확인해주세요
      </p>
      <div class="flex flex-col w-full gap-6 mt-10">
        <div class="bg-gray-100 w-full h-hull text-center py-[0.5rem] rounded-xl shadow-custom">
          <p class="text-16 medium">지원금 신청 체크 리스트를 다시 작성해야해요</p>
        </div>
        <div class="bg-gray-100 w-full h-hull text-center py-[0.5rem] rounded-xl shadow-custom">
          <p class="text-16 medium">즐겨찾기한 공고들이 사라져요</p>
        </div>
        <div class="bg-gray-100 w-full h-hull text-center py-[0.5rem] rounded-xl shadow-custom">
          <p class="text-16 medium">계정 및 개인정보가 완전히 삭제돼요</p>
        </div>
        <div class="bg-gray-100 w-full h-hull text-center py-[0.5rem] rounded-xl shadow-custom">
          <p class="text-16 medium">
            탈퇴 후 복구나 재가입 시 <br />
            기존 데이터는 복원되지 않아요
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2 mt-20">
        <input type="checkbox" v-model="isChecked" class="w-5 h-5" />
        <p class="text-12 bold">*위 주의사항을 모두 숙지했고, 탈퇴에 동의합니다</p>
      </div>
    </div>

    <div class="flex w-full gap-6 fixed bottom-9 md:max-w-[375px] px-4">
      <BaseButton :color="'blue'" class="shadow-custom" @click="router.back()">
        더 사용하기
      </BaseButton>
      <BaseButton
        :color="isChecked ? 'main' : 'gray-300'"
        :disabled="!isChecked"
        @click="showConfirmModal = true"
        class="shadow-custom"
      >
        탈퇴하기
      </BaseButton>
    </div>
  </div>
  <BaseModal
    :show="showConfirmModal"
    title="회원탈퇴 확인"
    message="정말 회원탈퇴를 진행하시겠습니까?"
    cancelText="더 사용하기"
    cancelColor="blue"
    confirmText="탈퇴하기"
    @confirm="handleMembershipTermination"
    @cancel="showConfirmModal = false"
    @close="showConfirmModal = false"
  />
</template>

<style scoped></style>
