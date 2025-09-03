<script setup>
defineProps({
  type: { type: String, default: 'button' },
  color: { type: String, default: 'main' },
  disabled: Boolean,
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'mx-auto w-[340px] h-[40px] flex items-center justify-center rounded-xl font-semibold text-20 transition',
      disabled
        ? 'bg-gray-300 text-white cursor-not-allowed'
        : color === 'main'
          ? 'bg-main text-white'
          : '',
    ]"
  >
    <slot />
  </button>
</template>
