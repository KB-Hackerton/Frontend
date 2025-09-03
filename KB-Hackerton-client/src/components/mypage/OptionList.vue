<script setup>
import OptionListItem from './OptionListItem.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    // 예: [{ to, icon, label, showArrow, danger, onClick }]
  },
})
</script>

<template>
  <section class="bg-white divide-y">
    <OptionListItem v-for="(item, i) in items" :key="i" v-bind="item" />
  </section>
</template>
