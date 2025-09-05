<script setup>
import { computed } from 'vue'
import SosListItem from './SosListItem.vue'

// Props & Emits
const props = defineProps({
  items: { type: Array, default: () => [] },
})
const emit = defineEmits(['select'])

// Type Mapping
const typeMap = { stock: '물품', labor: '인력', equipment: '고장', etc: '기타' }

// Computed
const normalized = computed(() =>
  (props.items || []).map((it) => ({
    ...it,
    typeLabel: typeMap[it.sos_type] ?? '기타',
  })),
)
</script>

<template>
  <section class="bg-white divide-y">
    <div v-if="normalized.length === 0" class="p-6 text-center text-black">
      등록된 SOS가 없습니다.
    </div>

    <SosListItem
      v-for="item in normalized"
      :key="item.sos_id"
      :item="item"
      @select="$emit('select', $event)"
    />
  </section>
</template>
