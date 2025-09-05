<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  selected: {
    type: Array,
    default: () => ['전체'],
  },
})
const emit = defineEmits(['update:selected'])

const categories = ['전체', '물품', '인력', '고장', '기타']

// 로컬 상태 (props 동기화)
const selectedLocal = ref([...props.selected])
watch(
  () => props.selected,
  (v) => {
    selectedLocal.value = [...v]
  },
)

function toggleCategory(category) {
  if (category === '전체') {
    selectedLocal.value = ['전체']
  } else {
    // '전체' 제거 후 토글
    selectedLocal.value = selectedLocal.value.filter((c) => c !== '전체')
    if (selectedLocal.value.includes(category)) {
      selectedLocal.value = selectedLocal.value.filter((c) => c !== category)
    } else {
      selectedLocal.value.push(category)
    }
    // 아무 것도 없으면 '전체'
    if (selectedLocal.value.length === 0) {
      selectedLocal.value = ['전체']
    }
  }
  emit('update:selected', selectedLocal.value) // v-model 이벤트
}
</script>

<template>
  <div class="flex gap-2 overflow-x-auto bg-white px-3 py-2 border-b">
    <button
      v-for="category in categories"
      :key="category"
      type="button"
      class="px-4 py-1 rounded-full text-14 border transition whitespace-nowrap"
      :class="
        selectedLocal.includes(category)
          ? 'bg-main text-white border-main'
          : 'bg-white text-black border-gray-300'
      "
      :aria-pressed="selectedLocal.includes(category)"
      @click="toggleCategory(category)"
    >
      {{ category }}
    </button>
  </div>
</template>
