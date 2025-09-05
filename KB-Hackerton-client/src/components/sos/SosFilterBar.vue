<script setup>
import { ref, watch, computed } from 'vue'

// Props & Emits
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

// State
const selectedLocal = ref([...props.selected])

// Computed
const categories = computed(() =>
  props.showAll ? ['전체', '물품', '인력', '고장', '기타'] : ['물품', '인력', '고장', '기타'],
)

// Watch
watch(
  () => props.selected,
  (v) => {
    selectedLocal.value = [...v]
  },
)

// Methods
function toggleCategory(category) {
  if (props.multiple) {
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
      class="whitespace-nowrap rounded-full border px-4 py-1 text-14 transition"
      :class="
        selectedLocal.includes(category)
          ? 'bg-main border-main text-white'
          : 'bg-white border-gray-300 text-black'
      "
      :aria-pressed="selectedLocal.includes(category)"
      @click="toggleCategory(category)"
    >
      {{ category }}
    </button>
  </div>
</template>
