<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
import ConfirmLeaveModal from '@/components/membership-termination/ConfirmLeaveModal.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isChecked = ref(false)

const buttonClick = ref(false)

const handleMembershipTermination = () => {
  // 회원 탈퇴 api 연동
  router.push('/login')
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
      <BaseButton :color="'blue'" class="shadow-custom" @click="router.back(-1)">
        더 사용하기
      </BaseButton>
      <BaseButton
        :color="isChecked ? 'main' : 'gray-300'"
        :disabled="!isChecked"
        @click="buttonClick = true"
        class="shadow-custom"
      >
        탈퇴하기
      </BaseButton>
    </div>

    <div
      v-if="buttonClick"
      class="fixed inset-0 bg-black/55 z-[90]"
      @click="buttonClick = false"
    ></div>

    <ConfirmLeaveModal
      v-if="buttonClick"
      @close="buttonClick = false"
      @click="handleMembershipTermination"
      class="z-[100] fixed top-1/3 left-1/2 -translate-x-1/2"
    />
  </div>
</template>

<style scoped></style>
