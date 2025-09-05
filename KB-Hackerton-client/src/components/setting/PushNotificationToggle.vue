<script setup>
import { defineProps, defineEmits } from 'vue'
import ToggleSwitch from '../toggle/ToggleSwitch.vue'

const props = defineProps({
  title: { type: String, required: true },
  isChecked: { type: Boolean, default: false },
})
const emits = defineEmits(['toggle'])
</script>

<template>
  <div class="flex justify-between items-center">
    <p class="text-14 semibold">{{ props.title }}</p>

    <ToggleSwitch :isChecked="isChecked" @click="emits('toggle')" />
  </div>
</template>

<style scoped></style>
