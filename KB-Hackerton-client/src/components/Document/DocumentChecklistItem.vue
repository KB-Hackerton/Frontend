<script setup>
const checked = defineModel({ type: Boolean, default: false })
const props = defineProps({
  label: { type: String, required: true },
})
</script>

<template>
  <label class="flex gap-4 text-12 medium items-center">
    <input type="checkbox" v-model="checked" />
    <p>{{ props.label }}</p>
  </label>
</template>

<style scoped></style>
