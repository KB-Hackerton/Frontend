<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isDisabled: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])
</script>

<template>
  <div class="flex justify-between items-center">
    <p :class="['text-14 bold', props.isDisabled ? 'text-gray-300' : '']">시간 설정</p>

    <button
      :class="isDisabled ? 'border border-1 border-gray-200' : 'border border-1 border-orange-100'"
      class="py-1 px-2 rounded-[0.5rem] shadow-custom"
      @click="emit('click')"
      :disabled="isDisabled"
    >
      <p :class="['text-12 medium', props.isDisabled ? 'text-gray-300' : 'text-main']">
        {{ props.startTime }} ~ {{ props.endTime }}
      </p>
    </button>
  </div>
</template>

<style scoped></style>
