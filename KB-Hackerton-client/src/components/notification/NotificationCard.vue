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
    class="rounded-[1rem] h-[8rem] pl-[0.3rem] w-full shadow-customm"
    :class="props.notification.is_read ? 'bg-gray-300 text-gray-300' : 'bg-main'"
  >
    <div
      class="bg-white rounded-[0.9rem] p-3 h-[8rem] w-full border border-gray-100 flex justify-between shadow-custom"
      @click="emit('click')"
    >
      <Icon
        :icon="
          props.notification.noti_type === 'sos'
            ? 'streamline-flex:sos-help-emergency-sign-solid'
            : 'ix:alarm-bell'
        "
        class="size-5"
        :class="props.notification.is_read ? 'text-gray-300' : 'text-main'"
      />
      <div class="flex flex-col justify-between flex-1 pl-3">
        <div class="flex justify-between">
          <p class="text-14 bold">{{ props.notification.title }}</p>
          <Icon icon="material-symbols:add-rounded" class="size-6 rotate-45" />
        </div>
        <div class="flex-1">
          <p class="text-14 regular pr-6">{{ props.notification.content }}</p>
        </div>
        <div>
          <p class="text-12 regular">{{ props.notification.created_at }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
