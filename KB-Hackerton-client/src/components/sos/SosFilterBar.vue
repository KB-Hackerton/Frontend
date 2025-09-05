<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  selected: {
    type: Array,
    default: () => ['전체'],
  },
  showAll: {
    type: Boolean,
    default: true, // 기본은 '전체' 포함
  },
  multiple: {
    type: Boolean,
    default: true, // 기본은 다중 선택
  },
})
const emit = defineEmits(['update:selected'])

const categories = computed(() =>
  props.showAll ? ['전체', '물품', '인력', '고장', '기타'] : ['물품', '인력', '고장', '기타'],
)

// 로컬 상태 (props 동기화)
const selectedLocal = ref([...props.selected])
watch(
  () => props.selected,
  (v) => {
    selectedLocal.value = [...v]
  },
)

function toggleCategory(category) {
  if (props.multiple) {
    // ✅ 다중 선택 모드
    if (props.showAll && category === '전체') {
      selectedLocal.value = ['전체']
    } else {
      selectedLocal.value = selectedLocal.value.filter((c) => c !== '전체')
      if (selectedLocal.value.includes(category)) {
        selectedLocal.value = selectedLocal.value.filter((c) => c !== category)
      } else {
        selectedLocal.value.push(category)
      }
      if (props.showAll && selectedLocal.value.length === 0) {
        selectedLocal.value = ['전체']
      }
    }
  } else {
    // ✅ 단일 선택 모드
    selectedLocal.value = [category]
  }

  emit('update:selected', selectedLocal.value)
}
</script>

<template>
  <div class="flex gap-2 overflow-x-auto bg-white px-3 py-2">
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
