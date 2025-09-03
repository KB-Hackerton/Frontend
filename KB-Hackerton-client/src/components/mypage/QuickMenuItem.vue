<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
  to: { type: String, required: true },
  icon: { type: String, required: true },
  label: { type: String, required: true },
})
</script>

<template>
  <router-link :to="to" class="flex flex-col items-center">
    <div
      class="w-[100px] h-[80px] bg-blue text-white flex flex-col items-center justify-center rounded-lg"
    >
      <Icon :icon="icon" class="w-6 h-6 text-white" />
      <p class="text-sm mt-1">{{ label }}</p>
    </div>
  </router-link>
</template>
