<script setup>
import { ref, computed } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue' // BaseButton 경로 확인

// Props: 부모 컴포넌트로부터 '보여주기 여부'와 '멤버 목록'을 받습니다.
const props = defineProps({
  show: { type: Boolean, default: false },
  members: { type: Array, default: () => [] }, // 참여자 목록
})

// Emits: 부모 컴포넌트로 '닫기' 또는 '확인' 이벤트를 보냅니다.
const emit = defineEmits(['close', 'confirm'])

// 1. 여러 명을 선택하기 위한 상태 변수 (선택된 멤버의 ID를 배열로 저장)
const selectedMemberIds = ref([])

// 2. 멤버를 클릭했을 때 선택/해제하는 함수
const toggleSelection = (memberId) => {
  const index = selectedMemberIds.value.indexOf(memberId)
  if (index > -1) {
    // 이미 선택된 상태면 배열에서 제거
    selectedMemberIds.value.splice(index, 1)
  } else {
    // 선택되지 않은 상태면 배열에 추가
    selectedMemberIds.value.push(memberId)
  }
}

// 3. 특정 멤버가 선택되었는지 확인하는 함수 (UI 스타일링에 사용)
const isSelected = (memberId) => {
  return selectedMemberIds.value.includes(memberId)
}

// 4. 종료하기 버튼 활성화 여부를 결정 (한 명이라도 선택해야 활성화)
const isConfirmButtonDisabled = computed(() => {
  return selectedMemberIds.value.length === 0
})

// 5. '종료하기' 버튼 클릭 시 선택된 ID 배열을 부모에게 전달
const onConfirm = () => {
  emit('confirm', selectedMemberIds.value)
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
    <div class="relative w-[340px] max-w-[90vw] p-6 bg-white rounded-xl flex flex-col gap-4">
      <h2 class="text-center text-18 font-bold">당신에게 도움을 준<br />사람들을 선택해주세요.</h2>

      <div class="flex flex-col gap-2 max-h-[40vh] overflow-y-auto">
        <div
          v-for="member in members"
          :key="member.memberId"
          @click="toggleSelection(member.memberId)"
          class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors"
          :class="isSelected(member.memberId) ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-200'"
        >
          <div class="w-8 h-8 bg-rose-100 rounded-md flex-shrink-0 mr-3">
          </div>
          <span class="font-medium">{{ member.bussinessName }}</span>
        </div>
      </div>

      <BaseButton
        color="main"
        :disabled="isConfirmButtonDisabled"
        @click="onConfirm"
      >
        종료하기
      </BaseButton>
    </div>
  </div>
</template>
