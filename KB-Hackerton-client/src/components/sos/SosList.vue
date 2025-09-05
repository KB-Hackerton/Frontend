<script setup>
import { computed } from 'vue'
import SosListItem from './SosListItem.vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
})

const emit = defineEmits(['select'])

const typeMap = { stock: '물품', labor: '인력', equipment: '고장', etc: '기타' }

const normalized = computed(() =>
  (props.items || []).map((it) => {
    const typeLabel = typeMap[it.sos_type] ?? '기타'
    return { ...it, typeLabel }
  }),
)
</script>

<template>
  <section class="bg-white divide-y">
    <div v-if="normalized.length === 0" class="p-6 text-center text-gray-400">
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
