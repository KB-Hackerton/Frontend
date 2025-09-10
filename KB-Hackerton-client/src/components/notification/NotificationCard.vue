<script setup>
import { Icon } from '@iconify/vue'
import { defineProps } from 'vue'

const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['click', 'delete'])
</script>

<template>
  <div
    class="rounded-[1rem] h-[8rem] pl-[0.3rem] w-full shadow-customm"
    :class="props.notification.isRead ? 'bg-gray-300 text-gray-300' : 'bg-main'"
  >
    <div
      class="bg-white rounded-[0.9rem] p-3 h-[8rem] w-full border border-gray-100 flex justify-between shadow-custom"
      @click="emit('click')"
    >
      <Icon
        :icon="
          props.notification.notiType === 'sos'
            ? 'streamline-flex:sos-help-emergency-sign-solid'
            : 'ix:alarm-bell'
        "
        class="size-5"
        :class="props.notification.isRead ? 'text-gray-300' : 'text-main'"
      />
      <div class="flex flex-col justify-between flex-1 pl-3">
        <div class="flex justify-between">
          <p class="text-14 bold">{{ props.notification.title }}</p>
          <button @click.stop="emit('delete')">
            <Icon icon="material-symbols:add-rounded" class="size-6 rotate-45" />
          </button>
        </div>
        <div class="flex-1">
          <p class="text-14 regular pr-6">{{ props.notification.content }}</p>
        </div>
        <div>
          <p class="text-12 regular">
            {{ props.notification.createdAt.slice(0, 10).replaceAll(/-/gi, '.') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
