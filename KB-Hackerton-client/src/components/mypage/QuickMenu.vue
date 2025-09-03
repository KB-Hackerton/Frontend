<script setup>
import QuickMenuItem from './QuickMenuItem.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    // 예시: [{ to: '/favorites', icon: '...', label: '즐겨찾기' }]
  },
})
</script>

<template>
  <section class="flex justify-around bg-white py-4 my-3">
    <QuickMenuItem
      v-for="(item, i) in items"
      :key="i"
      :to="item.to"
      :icon="item.icon"
      :label="item.label"
    />
  </section>
</template>
