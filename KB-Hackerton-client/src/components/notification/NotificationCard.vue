<script setup>
import { Icon } from '@iconify/vue'
import { defineProps } from 'vue'

const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <div
    class="rounded-[1rem] p-3 h-[6.5rem] w-full flex flex-col justify-between my-3"
    :class="
      notification.is_read
        ? 'text-gray-300 border border-gray-300 '
        : 'bg-white border border-black'
    "
    @click="emit('click')"
  >
    <div class="flex justify-between items-center">
      <p class="text-14 bold">{{ props.notification.title }}</p>
      <Icon icon="material-symbols:add-rounded" class="size-6 rotate-45" />
    </div>
    <p class="text-14 medium flex-1">{{ props.notification.content }}</p>
    <p class="text-14 medium text-end">{{ props.notification.created_at }}</p>
  </div>
</template>

<style scoped></style>
