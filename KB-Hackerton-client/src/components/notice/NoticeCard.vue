<script setup>
import { Icon } from '@iconify/vue'
import { defineProps } from 'vue'

const props = defineProps({
  notice: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="flex justify-between border-b border-gray-200 h-[4.5rem] items-center pl-4 pr-2">
    <h1 class="bold text-14">{{ props.notice.title }}</h1>
    <Icon icon="material-symbols:arrow-forward-ios-rounded" class="size-6 text-gray-300" />
  </div>
</template>

<style scoped></style>
