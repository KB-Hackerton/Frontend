<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  members: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'confirm'])

const selectedMemberIds = ref([])

const toggleSelection = (memberId) => {
  const index = selectedMemberIds.value.indexOf(memberId)
  if (index > -1) {
    selectedMemberIds.value.splice(index, 1)
  } else {
    selectedMemberIds.value.push(memberId)
  }
}

const isSelected = (memberId) => {
  return selectedMemberIds.value.includes(memberId)
}

const isConfirmButtonDisabled = computed(() => {
  return selectedMemberIds.value.length === 0
})

const onConfirm = () => {
  emit('confirm', selectedMemberIds.value)
  selectedMemberIds.value = [] // 확인 후 선택 초기화
}

const onClose = () => {
  selectedMemberIds.value = [] // 닫기 시 선택 초기화
  emit('close')
}
</script>

<template>
  <!-- 모달 배경 -->
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center"
    @click.self="onClose"
  >
    <!-- 반투명 배경 -->
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>

    <!-- 모달 본체 -->
    <div class="relative bg-white rounded-2xl w-[90%] max-w-[360px] p-6 shadow-xl">

      <button
        @click="onClose"
        class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
        aria-label="Close modal"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- 제목 -->
      <h2 class="text-center text-lg font-bold mb-6 leading-relaxed">
        당신에게 도움을 준<br />사람들을 선택해주세요.
      </h2>

      <!-- 멤버 리스트 -->
      <div class="space-y-2 max-h-[300px] overflow-y-auto mb-4">
        <div
          v-for="member in members"
          :key="member.memberId"
          @click="toggleSelection(member.memberId)"
          class="flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200"
          :class="[
            isSelected(member.memberId)
              ? 'bg-rose-50 border-2 border-rose-300'
              : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
          ]"
        >
          <!-- 체크박스 -->
          <div
            class="flex items-center justify-center w-6 h-6 rounded transition-all duration-200"
            :class="[
              isSelected(member.memberId)
                ? 'bg-rose-500'
                : 'bg-white border-2 border-gray-300'
            ]"
          >
            <svg
              v-if="isSelected(member.memberId)"
              class="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <!-- 프로필 이미지 -->
          <div class="w-10 h-10 bg-rose-100 rounded-full flex-shrink-0 mx-3">
            <img
              v-if="member.imageURL"
              :src="member.imageURL + '?t=' + Date.now()"
              alt="프로필 이미지"
              class="w-full h-full rounded-full object-cover"
            />
            <div
              v-else
              class="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-white text-lg font-bold"
            >
              {{ (member.memberName || '이름 없음').charAt(0) }}
            </div>
          </div>

          <!-- 비즈니스 이름 -->
          <span class="text-base font-medium text-gray-800">
            {{ member.memberName || member.memberName || '이름 없음' }}
          </span>
        </div>
      </div>

      <!-- 선택된 인원 수 표시 -->
      <div class="text-center text-sm text-gray-500 mb-4">
        총 {{ selectedMemberIds.length }}명 선택됨
      </div>

      <!-- 버튼 -->
      <button
        @click="onConfirm"
        :disabled="isConfirmButtonDisabled"
        class="w-full py-3 rounded-xl font-semibold text-base transition-all duration-200"
        :class="[
          isConfirmButtonDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-rose-500 text-white hover:bg-rose-600 active:scale-[0.98]'
        ]"
      >
        종료하기 ({{ selectedMemberIds.length }}명)
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 스크롤바 스타일링 */
.max-h-\[300px\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[300px\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-\[300px\]::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.max-h-\[300px\]::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
