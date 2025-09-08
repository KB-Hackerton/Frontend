<script setup>
const checked = defineModel({ type: Boolean, default: false })
const props = defineProps({
  label: { type: String, required: true },
})
</script>

<template>
  <div class="flex text-12 medium items-center justify-between">
    <div class="flex items-center gap-2">
      <input
        type="checkbox"
        v-model="checked"
        class="w-4 h-4 appearance-none rounded border border-gray-300 checked:bg-orange-100 checked:after:content-['✓'] checked:after:block checked:after:text-white checked:after:text-sm checked:after:leading-4 checked:after:text-center"
      />
      <p>{{ props.label }}</p>
    </div>
    <div v-if="checked" class="h-[0.4rem] w-[0.4rem] rounded-full bg-[#00C950]"></div>
  </div>
</template>

<style scoped></style>
