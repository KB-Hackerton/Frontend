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
      'mx-auto w-[340px] h-[40px] rounded-xl font-bold text-20 flex items-center justify-center',
      disabled ? 'bg-gray-300 text-white cursor-not-allowed' : '',
      color === 'main' ? 'bg-main text-white' : '',
      color === 'yellow' ? 'bg-yellow text-black' : '',
    ]"
  >
    <slot />
  </button>
</template>
